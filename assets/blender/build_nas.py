"""Build a reusable NAS prototype and a studio preview. Run with Blender -b -P."""
from pathlib import Path
import math
import bpy
from mathutils import Vector

OUT = Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metal=0, rough=.4, glow=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if glow:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = glow
    return m

metal = material('Powder coated graphite', (.075,.085,.09), .65, .36)
plastic = material('Textured drive sled polymer', (.032,.038,.04), .1, .48)
black = material('Recess black', (.005,.008,.009), .1, .6)
silver = material('Machined fasteners', (.36,.4,.42), .85, .24)
green = material('Status green', (.22,.65,.3), .1, .3, 2)
blue = material('USB insert', (.015,.15,.3), .05, .5)
ink = material('Silkscreen', (.55,.61,.63), 0, .65)

root = bpy.data.objects.new('NAS_4_BAY', None)
bpy.context.collection.objects.link(root)

def box(name, pos, size, mat, bevel=.001, parent=root):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new('Manufactured edge radius', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        ob.modifiers.new('Weighted corner normals', 'WEIGHTED_NORMAL')
    ob.parent = parent
    return ob

def text(name, body, pos, size=.004):
    bpy.ops.object.text_add(location=pos, rotation=(math.pi/2,0,0))
    ob = bpy.context.object
    ob.name = name
    ob.data.body = body
    ob.data.size = size
    ob.data.extrude = .00001
    ob.data.materials.append(ink)
    ob.parent = root
    bpy.ops.object.convert(target='MESH')

# Metres; front faces negative Y. Separate sled roots enable later animation.
box('Enclosure', (0,0,.105), (.225,.245,.192), metal,.005)
box('Front inset surround', (0,-.123,.105), (.216,.007,.181),black,.003)
for i in range(4):
    x = -.084+i*.047
    sled = bpy.data.objects.new('NAS_DRIVE_'+str(i+1),None)
    bpy.context.collection.objects.link(sled)
    sled.parent = root
    box('Drive %d face'%(i+1),(x,-.13,.106),(.044,.01,.163),plastic,.002,sled)
    box('Recessed handle pocket',(x,-.136,.084),(.033,.003,.101),black,.003,sled)
    box('Drive handle',(x,-.139,.09),(.026,.005,.08),metal,.003,sled)
    box('Release latch',(x,-.14,.043),(.022,.004,.009),plastic,.001,sled)
    box('Activity indicator',(x,-.137,.173),(.006,.002,.0015),green,.0005,sled)
    text('Bay number',str(i+1),(x-.002,-.141,.15),.004)
    for j in range(6):
        box('Lower sled ventilation',(x-.014+j*.0055,-.136,.03),(.002,.002,.008),black,.0003,sled)

box('Control column',(.098,-.129,.105),(.021,.009,.168),metal,.002)
for i,label in enumerate(['STATUS','LAN','DISK']):
    z = .16-i*.017
    box(label+' indicator',(.098,-.135,z),(.003,.002,.002),green,.0005)
    text(label,label,(.09,-.136,z-.006),.0022)
box('Power button recess',(.098,-.135,.081),(.012,.003,.012),black,.003)
box('Power button',(.098,-.137,.081),(.009,.003,.009),plastic,.002)
box('Power indicator',(.098,-.139,.084),(.003,.001,.001),green,.0002)
box('USB metal socket',(.098,-.135,.054),(.011,.003,.006),silver,.0006)
box('USB socket opening',(.098,-.137,.054),(.009,.002,.0045),black,.0002)
box('USB insert',(.098,-.138,.053),(.008,.001,.0013),blue,.0001)
text('Front wordmark','NEXT / STORAGE',(-.103,-.13,.192),.004)
for x in [-.084,.084]:
    for y in [-.085,.085]:
        box('Rubber foot',(x,y,.005),(.031,.032,.01),black,.003)
# Side ventilation and screw heads, legible in the three-quarter preview.
for row in range(6):
    for col in range(15):
        box('Side vent',(.1127,-.074+col*.010,.05+row*.008),(.0007,.006,.0025),black,.0005)
for y in [-.103,.102]:
    for z in [.027,.184]:
        box('Side fastener',(.113,y,z),(.001,.004,.004),silver,.001)
        box('Fastener slot',(.1137,y,z),(.0004,.0025,.0005),black,.0001)

# Rear cooling grille and sockets.
for i in range(19):
    box('Rear grille',(0,.1235,.039+i*.007),(.15,.001,.003),black,.001)
for x in [-.06,-.04]:
    box('Rear LAN socket',(x,.125,.026),(.015,.004,.012),black,.001)

# Export only the product; studio lights and floor never enter the GLB.
bpy.ops.object.select_all(action='DESELECT')
for ob in bpy.context.scene.objects:
    ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'nas-prototype.glb'),use_selection=True,export_format='GLB',export_apply=True)

floor = material('Studio graphite',(.055,.061,.067),.1,.55)
box('Studio floor',(0,0,-.015),(200,200,.02),floor,.0,None)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.world.color = (.18,.18,.18)

def point_at(ob, target):
    ob.rotation_euler = (Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()

for name,pos,energy,size in [('Key',(.1,-.45,.7),35,.5),('Fill',(-.45,-.15,.3),18,.4),('Rim',(.35,.4,.5),50,.3)]:
    bpy.ops.object.light_add(type='AREA',location=pos)
    lamp = bpy.context.object
    lamp.name = name
    lamp.data.energy = energy
    lamp.data.shape = 'DISK'
    lamp.data.size = size
    point_at(lamp,(0,0,.1))
bpy.ops.object.camera_add(location=(.43,-.65,.35))
cam = bpy.context.object
point_at(cam,(0,0,.1))
cam.data.type = 'ORTHO'
cam.data.ortho_scale = .43
scene.camera = cam
scene.render.resolution_x = 1200
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(OUT/'nas-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'nas-prototype.blend'))
bpy.ops.render.render(write_still=True)
