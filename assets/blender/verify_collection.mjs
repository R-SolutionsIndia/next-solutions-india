import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const base=path.join(path.dirname(fileURLToPath(import.meta.url)), 'collection');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
const expected=['nas','hdd','server','monitor','sata-ssd','external-ssd','nvme-ssd','ram','motherboard','cpu-cooler','gpu','mouse','keyboard','storage-array','network-switch','ups','power-supply','service-tray','rack','workstation-desk'];
assert.deepEqual(Object.keys(manifest.assets).sort(),expected.sort());
const report=[];
for (const [name,entry] of Object.entries(manifest.assets)) {
  const data=fs.readFileSync(path.join(base,entry.file));
  assert.equal(data.toString('ascii',0,4),'glTF');
  assert.equal(data.readUInt32LE(4),2);
  assert.equal(data.readUInt32LE(8),data.length);
  const jsonLength=data.readUInt32LE(12);
  const doc=JSON.parse(data.toString('utf8',20,20+jsonLength));
  const binaryStart=20+jsonLength+8;
  assert.ok(!doc.cameras?.length,`${name}: studio camera leaked into export`);
  assert.ok(!doc.extensions?.KHR_lights_punctual,`${name}: studio lights leaked`);
  assert.ok(doc.nodes.some(n=>n.name===entry.root),`${name}: missing root`);
  let triangles=0,vertices=0;
  for(const mesh of doc.meshes) for(const primitive of mesh.primitives) {
    const accessor=doc.accessors[primitive.attributes.POSITION];
    assert.equal(accessor.componentType,5126);
    assert.equal(accessor.type,'VEC3');
    const view=doc.bufferViews[accessor.bufferView];
    const offset=binaryStart+(view.byteOffset||0)+(accessor.byteOffset||0);
    for(let i=0;i<accessor.count;i++) for(let j=0;j<3;j++) {
      assert.ok(Number.isFinite(data.readFloatLE(offset+i*(view.byteStride||12)+j*4)),`${name}: nonfinite vertex`);
    }
    assert.ok(accessor.max.some((v,i)=>v>accessor.min[i]),`${name}: collapsed geometry`);
    triangles+=(primitive.indices===undefined?accessor.count:doc.accessors[primitive.indices].count)/3;
    vertices+=accessor.count;
  }
  assert.ok(triangles>0 && triangles<250000,`${name}: unexpected triangle budget ${triangles}`);
  assert.ok(data.length<12*1024*1024,`${name}: oversized individual asset`);
  assert.ok(entry.dimensions_m.every(v=>Number.isFinite(v)&&v>0),`${name}: bad dimensions`);
  for(const pivot of entry.moving_roots) assert.ok(doc.nodes.some(n=>n.name===pivot),`${name}: lost pivot ${pivot}`);
  const preview=path.join(base,'previews',name+'.png');
  assert.ok(fs.existsSync(preview),`${name}: no inspection render`);
  report.push({name,bytes:data.length,triangles,vertices,meshes:doc.meshes.length,pivots:entry.moving_roots.length});
}
console.table(report);
console.log(`Verified ${report.length} GLBs; ${(report.reduce((n,r)=>n+r.bytes,0)/1048576).toFixed(2)} MiB total.`);
