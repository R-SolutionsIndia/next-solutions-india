import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'assets/blender/collection');
const output = path.join(root, 'public/models/hardware');
await fs.mkdir(output, { recursive: true });
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const sourceManifest = JSON.parse(await fs.readFile(path.join(source, 'manifest.json'), 'utf8'));
const assets = {};
let total = 0;
for (const [name, info] of Object.entries(sourceManifest.assets)) {
  const document = await io.read(path.join(source, info.file));
  await document.transform(dedup(), weld(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const bytes = await io.writeBinary(document);
  // Content-addressed URLs allow permanent caching without stale deployment assets.
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const filename = `${name}.${hash}.glb`;
  await fs.writeFile(path.join(output, filename), bytes);
  const decoded = await io.readBinary(bytes);
  if (!decoded.getRoot().listMeshes().length) throw new Error(`Empty optimized model: ${name}`);
  const decodedNames = new Set(decoded.getRoot().listNodes().map(node => node.getName()));
  for (const pivot of info.moving_roots) {
    if (!decodedNames.has(pivot)) throw new Error(`Lost model pivot: ${pivot}`);
  }
  assets[name] = { url: `/models/hardware/${filename}`, bytes: bytes.length };
  total += bytes.length;
}
// Read installed component transforms directly from the approved Blender assembly.
const assembly = await io.read(path.join(source, 'populated-chassis.glb'));
const transforms = {};
for (const [name, info] of Object.entries(sourceManifest.assets)) {
  const node = assembly.getRoot().listNodes().find(node => node.getName() === info.root);
  if (node) transforms[name] = { position: node.getTranslation(), quaternion: node.getRotation() };
}
const manifest = { assets, chassis: transforms };
await fs.writeFile(path.join(root, 'components/scene/hardware-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
const keep = new Set(Object.values(assets).map(asset => path.basename(asset.url)));
for (const filename of await fs.readdir(output)) {
  if (/^[a-z-]+\.[a-f0-9]{12}\.glb$/.test(filename) && !keep.has(filename)) await fs.unlink(path.join(output, filename));
}
console.log(`Prepared ${Object.keys(assets).length} hardware assets: ${(total / 1048576).toFixed(2)} MiB.`);
