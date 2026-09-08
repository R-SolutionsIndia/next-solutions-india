"""Import every delivered GLB into Blender and check geometry and dimensions."""
import bpy
import json
from pathlib import Path
from mathutils import Vector

base=Path(__file__).resolve().parent/'collection'
manifest=json.loads((base/'manifest.json').read_text())
results=[]
for name,entry in manifest['assets'].items():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(base/entry['file']))
    bpy.context.view_layer.update()
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    assert meshes, name+' has no meshes after import'
    points=[o.matrix_world@Vector(v) for o in meshes for v in o.bound_box]
    dims=[max(v[i] for v in points)-min(v[i] for v in points) for i in range(3)]
    assert all(abs(a-b)<.0002 for a,b in zip(dims,entry['dimensions_m'])),(name,dims,entry['dimensions_m'])
    assert all(o.data.materials for o in meshes), name+' lost materials'
    results.append({'name':name,'imported_meshes':len(meshes),'dimensions_m':dims,'status':'pass'})
if (base/'populated-chassis.glb').exists():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(base/'populated-chassis.glb'))
    roots={o.name for o in bpy.context.scene.objects if o.parent is None}
    component_names=['service-tray','motherboard','cpu-cooler','gpu','hdd','sata-ssd','nvme-ssd','ram','power-supply']
    expected={manifest['assets'][name]['root'] for name in component_names}
    assert expected.issubset(roots),('Missing installed components',expected-roots)
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    assert meshes and all(o.data.materials for o in meshes)
    results.append({'name':'populated-chassis','component_roots':len(expected),'imported_meshes':len(meshes),'status':'pass'})
(base/'roundtrip-check.json').write_text(json.dumps(results,indent=2))
print('ROUNDTRIP_PASS',len(results))
