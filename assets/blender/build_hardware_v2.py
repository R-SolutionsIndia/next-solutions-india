"""Manufacturer-informed modelling study. Keeps production layout unchanged."""
import bpy, math
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parent / 'v2'
OUT.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(OUT.parent/'nas-prototype.blend'))
scene = bpy.context.scene
scene.render.resolution_x = 1600
scene.render.resolution_y = 1000
scene.cycles.samples = 48

def mat(name, rgb, metallic=0, rough=.45):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb,1)
    m.use_nodes = True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*rgb,1)
    p.inputs['Metallic'].default_value=metallic
    p.inputs['Roughness'].default_value=rough
    return m

coat=mat('V2 charcoal powdercoat',(.019,.023,.027),.25,.48)
rubber=mat('V2 soft grip polymer',(.012,.015,.019),0,.62)
alloy=mat('V2 machined aluminium',(.32,.35,.38),.85,.3)
dark=mat('V2 deep recess',(.002,.003,.004),0,.75)
paper=mat('V2 drive label',(.7,.72,.7),0,.85)
pcb=mat('V2 PCB green',(.018,.065,.037),.15,.5)
gold=mat('V2 connector gold',(.5,.3,.065),.75,.3)

def box(name,pos,size,m,parent=None,r=.001):
    bpy.ops.mesh.primitive_cube_add(size=1,location=pos)
    o=bpy.context.object;o.name=name;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(m);o.parent=parent
    if r:
        b=o.modifiers.new('Edge bevel','BEVEL');b.width=r;b.segments=3
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def root(name):
    o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o);return o

def label(body,pos,size,parent,top=True):
    bpy.ops.object.text_add(location=pos,rotation=(0,0,0) if top else (math.pi/2,0,0))
    o=bpy.context.object;o.name='Legend '+body;o.data.body=body;o.data.size=size
    o.data.materials.append(dark if top else paper);o.parent=parent
    bpy.ops.object.convert(target='MESH')
    return o

nas=bpy.data.objects['NAS_4_BAY']
for o in list(nas.children_recursive):
    if o.type=='MESH' and any(n in o.name for n in ['Enclosure','Drive handle','Control column']):
        o.data.materials.clear();o.data.materials.append(coat)
    if o.name.startswith('Side vent'):
        bpy.data.objects.remove(o,do_unlink=True)
# Actual recessed side slots replace raised decorative marks.
shell=bpy.data.objects['Enclosure']
cutters=[]
for row in range(5):
    for col in range(12):
        cutters.append(box('Vent cutter',(.112,-.063+col*.011,.045+row*.01),(.007,.007,.003),dark,r=0))
bpy.ops.object.select_all(action='DESELECT')
for o in cutters:o.select_set(True)
bpy.context.view_layer.objects.active=cutters[0]
bpy.ops.object.join();cutter=bpy.context.object
bpy.context.view_layer.objects.active=shell
mod=shell.modifiers.new('Recessed ventilation','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cutter
bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.data.objects.remove(cutter,do_unlink=True)
for i in range(4):
    sled=bpy.data.objects['NAS_DRIVE_'+str(i+1)]
    x=-.084+i*.047
    box('Drive tray body',(x,-.005,.098),(.041,.205,.139),dark,sled,.001)
    # Bay numeral must travel with its tray.
    o=bpy.data.objects.get('Bay number'+('' if i==0 else '.%03d'%i))
    if o:o.parent=sled

def hdd_model():
    p=root('HDD_3_5')
    box('Cast aluminium HDD base',(0,0,.013),(.1016,.147,.026),dark,p,.003)
    box('Stamped metal cover',(0,0,.0265),(.1,.145,.002),alloy,p,.002)
    box('Paper specification label',(0,.01,.028),(.077,.095,.0003),paper,p,.001)
    label('ENTERPRISE HDD',(-.034,.038,.0283),.005,p)
    label('3.5 / SATA',(-.034,.026,.0283),.004,p)
    label('STORAGE SERIES',(-.034,.017,.0283),.003,p)
    for i in range(35):
        box('Barcode',(-.033+i*.0018,-.015,.0283),(.0006 if i%3 else .0012,.011,.0001),dark,p,0)
    for x in [-.042,.042]:
        for y in [-.062,0,.062]:
            box('Torx fastener',(x,y,.028),(.004,.004,.001),alloy,p,.001)
            box('Torx recess',(x,y,.0286),(.0018,.0007,.0002),dark,p,0)
    box('SATA connector housing',(0,-.073,.009),(.066,.005,.009),dark,p,.001)
    for i in range(22):box('SATA contact',(-.031+i*.0028,-.076,.009),(.0013,.003,.002),gold,p,0)
    return p

def mouse_model():
    p=root('WORKSTATION_MOUSE')
    # Lofted ergonomic surface with a higher rear palm rest and tapered nose.
    verts=[];faces=[];rows=25;cols=40
    for j in range(rows):
        t=j/(rows-1);y=-.059+t*.118
        w=.023+.010*math.sin(math.pi*t)**.6
        h=.019+.021*math.sin(math.pi*t)**.85
        for i in range(cols):
            a=2*math.pi*i/cols
            verts.append((w*math.cos(a),y,.007+max(0,math.sin(a))*(h-.007)))
    for j in range(rows-1):
        for i in range(cols):
            a=j*cols+i;b=j*cols+(i+1)%cols
            faces.append((a,b,b+cols,a+cols))
    faces.extend([tuple(reversed(range(cols))),tuple((rows-1)*cols+i for i in range(cols))])
    mesh=bpy.data.meshes.new('Ergonomic loft');mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new('Mouse curved shell',mesh);bpy.context.collection.objects.link(o);o.parent=p
    o.data.materials.append(coat)
    for f in mesh.polygons:f.use_smooth=True
    sub=o.modifiers.new('Surface smoothing','SUBSURF');sub.levels=2
    # Button separation follows the upper surface, with actual wheel geometry.
    for j in range(12):
        t=.05+j*.022;y=-.059+t*.118;h=.019+.021*math.sin(math.pi*t)**.85
        box('Button centre seam',(0,y,h+.0002),(.00065,.0028,.0005),dark,p,.0001)
    bpy.ops.mesh.primitive_torus_add(major_radius=.006,minor_radius=.002,major_segments=40,minor_segments=12,location=(0,-.025,.037),rotation=(0,math.pi/2,0))
    o=bpy.context.object;o.name='Scroll wheel';o.data.materials.append(alloy);o.parent=p
    for x in [-.03]:
        for y in [-.009,.011]:box('Thumb navigation button',(x,y,.019),(.004,.015,.003),rubber,p,.001)
    box('Mouse bottom seam',(0,0,.006),(.058,.111,.006),rubber,p,.003)
    return p

def keyboard_model():
    p=root('WORKSTATION_KEYBOARD')
    box('Slim aluminium keyboard chassis',(0,0,.009),(0.3,0.12,0.018),alloy,p,.005)
    box('Keyboard deck',(0,0,.019),(.294,.114,.004),rubber,p,.003)
    legends=['1234567890-=','QWERTYUIOP[]','ASDFGHJKL;', 'ZXCVBNM,./']
    for row,chars in enumerate(legends):
        for col,c in enumerate(chars):
            x=-.125+col*.019+row*.004;y=.041-row*.02
            box('Key '+c,(x,y,.024),(.017,.017,.007),coat,p,.002)
            ob=label(c,(x-.004,y-.003,.028),.004,p)
            ob.data.materials.clear();ob.data.materials.append(paper)
    box('Space bar',(-.016,-.044,.024),(.112,.017,.007),coat,p,.002)
    for x in [-.126,-.105,-.084,.06,.081,.102,.123]:
        box('Modifier key',(x,-.044,.024),(.017,.017,.007),coat,p,.002)
    return p

def server_model():
    p=root('RACK_SERVER_2U')
    box('Server steel chassis',(0,.16,.045),(.445,.65,.089),alloy,p,.002)
    box('Server front bezel',(0,-.168,.045),(.445,.008,.087),dark,p,.001)
    for row in range(2):
        for col in range(6):
            x=-.179+col*.065;z=.025+row*.039
            box('Server drive carrier',(x,-.177,z),(.061,.012,.034),coat,p,.001)
            box('Carrier release',(x+.022,-.185,z),(.01,.005,.027),rubber,p,.001)
            for k in range(7):
                box('Carrier grille',(x-.023+k*.005,-.184,z),(.002,.001,.02),dark,p,0)
    for x in [-.233,.233]:
        box('Rack mounting ear',(x,-0.172,0.045),(0.021,0.009,0.089),coat,p,0.001)
        box('Rack handle',(x,-.194,.045),(.01,.015,.06),alloy,p,.004)
    return p

def monitor_model():
    p=root('WORKSTATION_MONITOR')
    box('Monitor base',(0,0,0.008),(0.25,0.18,0.016),coat,p,0.004)
    box('Monitor stand',(0,0.035,0.16),(0.06,0.04,0.29),alloy,p,0.005)
    box('Monitor enclosure',(0,0.025,0.35),(0.7,0.034,0.31),coat,p,0.005)
    screen=mat('Monitor glass',(0.012,0.025,0.031),0.15,0.2)
    box('Display panel',(0,0.007,0.353),(0.682,0.002,0.288),screen,p,0.002)
    label('NEXT / INFRASTRUCTURE',(-0.29,0.005,0.44),0.011,p,False)
    for i in range(6):
        box('Dashboard row',(-0.06,-0.002,0.4-i*0.024),(0.46,0.001,0.003),alloy,p,0)
    return p

hdd=hdd_model();mouse=mouse_model();keyboard=keyboard_model()
server=server_model();monitor=monitor_model()
# Keep independent asset exports at metre scale with stable root names.
def export(p,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in [p,*p.children_recursive]:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),use_selection=True,export_format='GLB',export_apply=True)

export(nas,'nas');export(hdd,'hdd');export(mouse,'mouse');export(keyboard,'keyboard')
export(server,'server');export(monitor,'monitor')
# Separate studio positions are only for reviewing individual assets.
server.location=(-0.47,0.36,0)
monitor.location=(0.47,0.34,0)
hdd.location=(.29,-.02,0);mouse.location=(.29,-.24,0);keyboard.location=(0,-.25,0)
scene.camera.location=(1.1,-2,1.3)
scene.camera.rotation_euler=(Vector((0,0.18,0.15))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
scene.camera.data.ortho_scale=1.9
scene.view_settings.exposure=-.7
scene.render.filepath=str(OUT/'hardware-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hardware-study.blend'))
bpy.ops.render.render(write_still=True)
