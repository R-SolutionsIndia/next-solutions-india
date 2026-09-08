"""Reproducible hardware collection. Blender 5.2; metres, Z-up, front -Y.

Run Blender -b -t 6 -P assets/blender/build_collection.py.
Outputs editable source, individual GLBs, renders and a geometry manifest.
"""
import bpy
import math
import json
import sys
from pathlib import Path
from mathutils import Vector

HERE = Path(__file__).resolve().parent
OUT = HERE / 'collection'
OUT.mkdir(exist_ok=True)
(OUT/'models').mkdir(exist_ok=True)
(OUT/'previews').mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(HERE/'v2/hardware-study.blend'))
bpy.context.preferences.filepaths.save_version = 0
scene = bpy.context.scene
for ob in [o for o in scene.objects if o.parent is None]:
    if ob.name not in ['NAS_4_BAY','HDD_3_5','RACK_SERVER_2U','WORKSTATION_MONITOR']:
        for child in list(ob.children_recursive): bpy.data.objects.remove(child,do_unlink=True)
        bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:
    if ob.parent is None: ob.location=(0,0,0)

def material(name, color, metal=0, rough=.45):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    s=m.node_tree.nodes.get('Principled BSDF')
    s.inputs['Base Color'].default_value=(*color,1)
    s.inputs['Metallic'].default_value=metal;s.inputs['Roughness'].default_value=rough
    return m

coat=material('Charcoal powder coated steel',(.022,.028,.032),.35,.43)
plastic=material('Fine moulded ABS',(.015,.019,.021),0,.52)
black=material('Dark cavity interior',(.003,.004,.005),0,.7)
rubber=material('Elastomer grip',(.012,.014,.016),0,.72)
silver=material('Satin aluminium',(.36,.4,.43),.82,.32)
steel=material('Nickel plated fasteners',(.46,.48,.5),.9,.23)
pcb=material('Green solder mask',(.013,.07,.038),.18,.4)
gold=material('Gold plated connector contacts',(.61,.38,.095),.75,.28)
white=material('Printed warm white',(.76,.8,.78),0,.65)
blue=material('Cable jacket blue',(.012,.13,.23),0,.4)
copper=material('Copper heat pipes',(.5,.2,.065),.8,.32)
green=material('Green status LED',(.1,.55,.22),0,.3)
green.node_tree.nodes.get('Principled BSDF').inputs['Emission Color'].default_value=(.1,.55,.22,1)
green.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=.8

def group(name,parent=None):
    o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o);o.parent=parent;return o

def box(name,pos,dims,mat=coat,parent=None,r=.001):
    x,y,z=(d/2 for d in dims)
    me=bpy.data.meshes.new(name)
    me.from_pydata([(-x,-y,-z),(x,-y,-z),(x,y,-z),(-x,y,-z),(-x,-y,z),(x,-y,z),(x,y,z),(-x,y,z)],[],
                  [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])
    me.update()
    o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o)
    o.location=pos;o.data.materials.append(mat);o.parent=parent
    if r:
        b=o.modifiers.new('Edge radius','BEVEL');b.width=min(r,min(dims)*.45);b.segments=3
        o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL')
    return o

def cyl(name,pos,radius,depth,mat=steel,parent=None,rot=(0,0,0),vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=pos,rotation=rot)
    o=bpy.context.object;o.name=name;o.data.materials.append(mat);o.parent=parent
    b=o.modifiers.new('Machined rim','BEVEL');b.width=min(depth*.12,radius*.08);b.segments=2
    o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def line(name,points,radius,mat,parent):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=12
    if len(points)>8:
        s=c.splines.new('POLY');s.points.add(len(points)-1)
        for b,p in zip(s.points,points):b.co=(*p,1)
    else:
        s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
        for b,p in zip(s.bezier_points,points):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
    c.bevel_depth=radius;c.bevel_resolution=2
    o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(mat);o.parent=parent
    return o

def label(body,pos,size,parent,top=False,mat=white):
    bpy.ops.object.text_add(location=pos,rotation=(0,0,0) if top else (math.pi/2,0,0))
    o=bpy.context.object;o.name='Print '+body;o.data.body=body;o.data.size=size
    o.data.resolution_u=2;o.data.materials.append(mat);o.parent=parent
    return o

def screw(pos,parent,front=False,r=.002):
    rot=(math.pi/2,0,0) if front else (0,0,0)
    cyl('Countersunk screw',pos,r,.0008,steel,parent,rot,16)
    x,y,z=pos
    if front:
        box('Cross recess',(x,y-.0005,z),(r*1.2,.0002,r*.22),black,parent,0)
        box('Cross recess',(x,y-.0005,z),(r*.22,.0002,r*1.2),black,parent,0)
    else:
        box('Cross recess',(x,y,z+.0005),(r*1.2,r*.22,.0002),black,parent,0)
        box('Cross recess',(x,y,z+.0005),(r*.22,r*1.2,.0002),black,parent,0)

def port(pos,parent,kind='RJ45',rear=False):
    x,y,z=pos;sign=1 if rear else -1
    w,h=(.014,.012) if kind=='RJ45' else ((.009,.003) if kind=='USB-C' else (.013,.0055))
    box(kind+' rim',(x,y,z),(w+.002,.004,h+.002),steel,parent,.0006)
    box(kind+' socket',(x,y+sign*.0022,z),(w,.0006,h),black,parent,.0002)
    if kind=='RJ45':
        for i in range(8):box('RJ45 contact',(x-.0044+i*.00125,y+sign*.0027,z+.002),(.00045,.0005,.004),gold,parent,0)
        box('Latch key',(x,y+sign*.0027,z-.004),(.005,.0006,.002),plastic,parent,0)
    else:box('USB tongue',(x,y+sign*.0027,z),(w*.8,.0007,.0012),blue,parent,.0001)

def fan(pos,r,parent,front=False):
    g=group('Fan rotor assembly',parent)
    cyl('Fan shadow',(0,0,0),r,.004,black,g)
    cyl('Fan hub',(0,0,.006),r*.26,.009,plastic,g)
    for i in range(9):
        a=i*2*math.pi/9;vs=[]
        for j in range(6):
            t=j/5;rr=r*(.26+.7*t);ang=a+.65*t
            vs.extend([(rr*math.cos(ang),rr*math.sin(ang),.005+.003*t),
                       (rr*math.cos(ang+.4),rr*math.sin(ang+.4),.003+.003*t)])
        fs=[(j*2,j*2+1,j*2+3,j*2+2) for j in range(5)]
        me=bpy.data.meshes.new('Swept blade');me.from_pydata(vs,[],fs);me.update()
        o=bpy.data.objects.new('Swept cooling blade',me);bpy.context.collection.objects.link(o);o.parent=g;o.data.materials.append(plastic)
        for face in me.polygons:face.use_smooth=True
        s=o.modifiers.new('Blade thickness','SOLIDIFY');s.thickness=.0006
    for a in [0,math.pi/2,math.pi,3*math.pi/2]:
        line('Fan support',[(r*.25*math.cos(a),r*.25*math.sin(a),-.002),(r*math.cos(a),r*math.sin(a),-.002)],.001,plastic,g)
    line('Fan circular shroud',[(r*math.cos(i*math.pi/16),r*math.sin(i*math.pi/16),.004) for i in range(33)],.002,plastic,g)
    g.location=pos
    if front:g.rotation_euler=(math.pi/2,0,0)
    return g

def barcode(pos,width,parent):
    x,y,z=pos
    for i in range(38):box('Printed barcode',(x+i*width/38,y,z),(width/90 if i%3 else width/60,.008,.00003),black,parent,0)

def remove_tree(o):
    for c in list(o.children_recursive):bpy.data.objects.remove(c,do_unlink=True)
    bpy.data.objects.remove(o,do_unlink=True)

assets={}
cutters=[]
def cut_box(target,pos,dims):
    ob=box('Manufacturing cutout',pos,dims,black,r=0)
    ob.hide_render=True;cutters.append(ob)
    m=target.modifiers.new('Machined cutout','BOOLEAN');m.operation='DIFFERENCE';m.object=ob
def register(name,ob):assets[name]=ob;return ob
nas=register('nas',bpy.data.objects['NAS_4_BAY'])
hdd=register('hdd',bpy.data.objects['HDD_3_5'])
server=register('server',bpy.data.objects['RACK_SERVER_2U'])
monitor=register('monitor',bpy.data.objects['WORKSTATION_MONITOR'])

# NAS rear: two real cooling rotors, vent wires and grouped connection panel.
for o in list(nas.children_recursive):
    if o.name.startswith('Rear grille') or o.name.startswith('Rear LAN'):bpy.data.objects.remove(o,do_unlink=True)
for x in [-.05,.05]:
    f=fan((x,.127,.116),.044,nas,True);f.rotation_euler.x=-math.pi/2
    for i in range(6):
        rr=.013+i*.0055
        pts=[(x+rr*math.cos(a*math.pi/16),.14,.116+rr*math.sin(a*math.pi/16)) for a in range(33)]
        line('NAS circular fan grille',pts,.0007,steel,nas)
    for dx in [-.035,.035]:
        for dz in [-.035,.035]:screw((x+dx,.139,.116+dz),nas,True,.0017)
for x in [-.029,-.009]:port((x,.129,.034),nas,rear=True)
port((.015,.129,.034),nas,'USB',True)
cyl('NAS DC inlet',(.047,.129,.035),.004,.003,black,nas,(math.pi/2,0,0))
# Lid seam, rubber feet and underside fasteners.
for x in [-.09,.09]:
    for y in [-.09,.09]:screw((x,y,.01),nas)
for o in list(nas.children_recursive):
    if o.name.startswith(('Side fastener','Fastener slot')):bpy.data.objects.remove(o,do_unlink=True)
for y in [-.103,.102]:
    for z in [.027,.184]:
        cyl('NAS side screw',(.113,y,z),.002,.0008,steel,nas,(0,math.pi/2,0),16)
        box('Side screw recess',(.1135,y,z),(.0002,.002,.0005),black,nas,0)

# HDD: bottom PCB, spindle stamping and separated SATA data/power groups.
for o in list(hdd.children_recursive):
    if o.name.startswith(('SATA contact','Torx fastener','Torx recess')):bpy.data.objects.remove(o,do_unlink=True)
box('HDD underside PCB',(0,-.037,-.0005),(.088,.059,.0015),pcb,hdd,.001)
for x in [-.024,.012]:box('HDD controller package',(x,-.035,-.002),(.017,.015,.002),plastic,hdd,.0003)
cyl('Underside spindle boss',(0,.03,-.001),.019,.002,silver,hdd)
for start,count in [(-.033,15),(.016,7)]:
    for i in range(count):box('SATA gold contact',(start+i*.0016,-.075,.011),(.0009,.004,.0002),gold,hdd,0)
for x in [-.042,.042]:
    for y in [-.062,0,.062]:screw((x,y,.028),hdd,r=.002)
line('Stamped lid reinforcement',[(-.046,-.066,.0278),(-.035,-.058,.0278),(.035,-.058,.0278),(.046,-.066,.0278)],.0007,silver,hdd)
line('Stamped upper lid rim',[(-.046,.066,.0278),(-.035,.061,.0278),(.035,.061,.0278),(.046,.066,.0278)],.0006,silver,hdd)
label('MODEL / HDD35',(-.034,.007,.0284),.0025,hdd,True,black)
label('SERIAL / 000 000 000',(-.034,.001,.0284),.0025,hdd,True,black)
label('HANDLE WITH CARE',(-.034,-.034,.0284),.0023,hdd,True,black)

def make_ssd(name,portable=False):
    p=register(name,group(name.upper()))
    w,d,h=(.058,.1,.009) if portable else (.06985,.1002,.007)
    box('SSD enclosure',(0,0,h/2),(w,d,h),coat,p,.002)
    box('Enclosure parting seam',(0,0,h*.42),(w+.0003,d+.0003,.0005),black,p,.0001)
    if portable:
        for i in range(25):box('Anodised fluting',(-w*.42+i*w*.035,0,h+.0001),(.00045,d*.85,.0003),black,p,0)
        port((0,-d/2-.0005,h/2),p,'USB-C')
        label('PORTABLE / SSD',(-.022,.025,h+.0004),.004,p,True)
        box('Activity LED',(.018,-.037,h+.0003),(.004,.001,.0004),green,p,.0002)
    else:
        box('SSD paper label',(0,.002,h+.0002),(w*.84,d*.77,.0002),white,p,.001)
        box('Blue label stripe',(0,.029,h+.0004),(w*.84,.019,.0001),blue,p,0)
        label('SOLID STATE',(-.026,.026,h+.0006),.005,p,True)
        label('SATA / 2.5 INCH',(-.026,.014,h+.0006),.003,p,True,black)
        barcode((-.025,-.012,h+.0006),.047,p)
        box('SATA port',(0,-d/2,h*.5),(.042,.004,.004),black,p,.0002)
        for start,count in [(-.019,15),(.01,7)]:
            for i in range(count):box('SATA contact',(start+i*.0012,-d/2-.0022,h*.5),(.0007,.001,.002),gold,p,0)
    for x in [-w*.4,w*.4]:
        for y in [-d*.41,d*.41]:screw((x,y,h+.0004),p,r=.0015)
    return p

sata=make_ssd('sata-ssd');external=make_ssd('external-ssd',True)
nvme=register('nvme-ssd',group('NVME_2280'))
board=box('M2 PCB',(0,0,.001),(.022,.08,.0016),pcb,nvme,.0004)
cut_box(board,(.006,-.039,.001),(.002,.007,.006))
for y in [-.022,.006,.026]:box('NAND package',(0,y,.0028),(.017,.014,.002),plastic,nvme,.0003)
for i in range(18):
    if i in [14,15]:continue
    box('M key contact',(-.01+i*.0011,-.038,.002),(.00065,.004,.0002),gold,nvme,0)
cyl('M2 mounting eyelet',(0,.037,.002),.0024,.0005,gold,nvme)
cyl('M2 mounting hole',(0,.037,.0024),.0014,.0003,black,nvme)
box('Black NVMe label',(0,.001,.004),(.018,.057,.0002),plastic,nvme,.0003)
label('NVMe',(-.008,.014,.0043),.004,nvme,True)
label('2280 / PCIe',(-.008,.005,.0043),.002,nvme,True)
for side in [-1,1]:
    for j in range(13):box('M2 surface component',(side*.0095,-.027+j*.004,.0026),(.001,.002,.001),steel,nvme,.0001)

ram=register('ram',group('RAM_UDIMM'))
board=box('DIMM PCB',(0,0,.017),(.13335,.0015,.031),pcb,ram,.0004)
cut_box(board,(-.0012,0,.0015),(.003,.005,.008))
for x in [-.0667,.0667]:cut_box(board,(x,0,.015),(.002,.005,.003))
for side in [-1,1]:
    for i in range(8):
        box('DRAM package',(-.055+i*.0156,side*.0018,.019),(.011,.002,.017),plastic,ram,.0005)
    for i in range(66):
        if 31<=i<=33:continue
        box('DIMM edge contact',(-.063+i*.00193,side*.0009,.004),(.001,.0002,.005),gold,ram,0)
label('DDR / MEMORY',(-.052,-.003,.026),.003,ram)
for x in [-.066,.066]:box('DIMM latch notch',(x,0,.015),(.001,.002,.003),black,ram,0)

mother=register('motherboard',group('MOTHERBOARD'))
box('ATX PCB',(0,0,.002),(.244,.305,.002),pcb,mother,.001)
for x in [-.11,0,.11]:
    for y in [-.139,0,.139]:
        cyl('Board mounting ring',(x,y,.0035),.003,.0003,gold,mother)
        cyl('Board mounting hole',(x,y,.0038),.0015,.0002,black,mother)
box('CPU socket',(-.02,.045,.007),(.057,.063,.009),black,mother,.001)
box('CPU retention frame',(-.02,.045,.012),(.049,.054,.002),steel,mother,.001)
box('CPU heat spreader',(-.02,.045,.014),(.039,.041,.003),silver,mother,.001)
for i in range(4):
    x=.043+i*.016
    box('DIMM socket',(x,.034,.008),(.007,.143,.011),black,mother,.001)
    for y in [-.041,.109]:box('DIMM latch',(x,y,.011),(.009,.006,.013),white,mother,.001)
for y in [-.045,-.085,-.12]:
    box('PCIe socket',(-.035,y,.007),(.096,.009,.009),black,mother,.001)
    box('PCIe slot key',(-.035,y,.012),(.089,.001,.0005),gold,mother,0)
for i in range(22):
    x=-.099+(i%6)*.016;y=-.12+(i//6)*.02
    box('Board controller',(x,y,.005),(.01,.012,.005),plastic,mother,.0003)
    for j in [-1,1]:box('IC solder pads',(x+j*.006,y,.004),(.001,.012,.001),steel,mother,0)
for i in range(10):cyl('VRM capacitor',(-.09+i*.015,.12,.01),.004,.014,silver,mother)
box('Rear IO shield',(-.116,.045,.021),(.014,.16,.038),silver,mother,.001)
for i in range(5):box('Rear connector recess',(-.124,-.01+i*.025,.022),(.002,.018,.022),black,mother,.001)
trace=material('Copper under solder mask',(.028,.105,.055),.25,.48)
for i in range(22):
    x=-.08+i*.005
    line('PCB routed trace',[(x,-.135,.0031),(x,-.102+i*.001,.0031),(x+.025,-.077+i*.001,.0031),(x+.025,.002,.0031)],.00012,trace,mother)
for i in range(18):
    y=.018+i*.0022
    line('Memory bus trace',[(.003,y,.0031),(.018,y,.0031),(.035,y+.012,.0031),(.085,y+.012,.0031)],.0001,trace,mother)
for i in range(65):
    x=-.105+(i%13)*.016;y=-.14+(i//13)*.009
    box('SMD resistor',(x,y,.004),(.0025,.0012,.0007),plastic,mother,.0001)
    for d in [-.0015,.0015]:box('SMD terminal',(x+d,y,.004),(.0005,.0012,.0007),steel,mother,0)
for x in [-.083,-.058]:
    box('VRM heatsink base',(x,.047,.012),(.018,.077,.01),coat,mother,.001)
    for j in range(7):box('VRM fin',(x-.007+j*.0024,.047,.021),(.001,.077,.013),coat,mother,.0002)
cyl('CMOS battery',(-.069,-.015,.007),.01,.006,steel,mother)
for i in range(6):
    box('SATA board connector',(.104,-.129+i*.013,.009),(.021,.011,.012),black,mother,.001)
    box('SATA board socket',(.115,-.129+i*.013,.009),(.001,.008,.005),gold,mother,0)
box('24 pin ATX connector',(.111,.06,.009),(.009,.05,.012),plastic,mother,.001)
for i in range(12):
    for x in [.108,.113]:box('ATX socket',(x,.039+i*.0038,.015),(.002,.002,.0003),black,mother,0)
for body,pos in [('CPU',(-.041,.085,.0032)),('DIMM',(.039,.115,.0032)),('PCI EXPRESS',(-.08,-.037,.0032)),('SATA',(.08,-.14,.0032))]:label(body,pos,.003,mother,True)

cooler=register('cpu-cooler',group('CPU_COOLER'))
box('Cooler contact plate',(0,0,.003),(.052,.052,.006),copper,cooler,.001)
for i in range(28):box('Aluminium cooling fin',(0,0,.009+i*.0016),(.082,.07,.0007),silver,cooler,.0001)
for x in [-.025,0,.025]:line('Heat pipe',[(x,-.028,.005),(x,-.032,.045),(x,.027,.054)],.0025,copper,cooler)
fan((0,0,.057),.035,cooler)
for x in [-.032,.032]:
    for y in [-.032,.032]:
        cyl('Fan mounting boss',(x,y,.058),.003,.012,plastic,cooler)
        screw((x,y,.065),cooler,r=.0015)

gpu=register('gpu',group('GRAPHICS_CARD'))
box('GPU PCB',(0,0,.009),(.265,.103,.002),pcb,gpu,.001)
box('GPU backplate',(0,0,.006),(.275,.11,.004),coat,gpu,.001)
for i in range(70):box('GPU heatsink fin',(-.129+i*.0037,0,.027),(.001,.098,.031),silver,gpu,.0002)
for y in [-.053,.053]:box('GPU shroud edge',(0,y,.04),(.276,.006,.029),coat,gpu,.002)
for x in [-.14,.14]:box('GPU shroud end',(x,0,.04),(.006,.11,.029),coat,gpu,.002)
for x in [-.087,0,.087]:fan((x,0,.046),.041,gpu)
for i in range(48):box('GPU PCIe contact',(-.105+i*.0021,-.058,.01),(.0012,.011,.0004),gold,gpu,0)
box('GPU IO bracket',(-.145,0,.03),(.002,.12,.06),steel,gpu,.0004)
for y in [-.036,-.012,.012,.036]:box('Display output',(-.146,y,.029),(.002,.016,.007),black,gpu,.001)
label('GRAPHICS',(-.06,-.057,.04),.009,gpu)

# Real peripheral geometry: a separated palm shell, two curved buttons and wheel.
mouse=register('mouse',group('WORKSTATION_MOUSE'))
def mouse_surface(name,umin,umax,tmin,tmax,mat):
    vs=[];fs=[];nu=24;nt=28
    for j in range(nt+1):
        t=tmin+(tmax-tmin)*j/nt;y=-.0625+.125*t
        width=.022+.011*math.sin(math.pi*t)**.65
        for i in range(nu+1):
            u=umin+(umax-umin)*i/nu
            x=width*u
            z=.007+(.02+.025*math.sin(math.pi*t)**.8)*max(0,1-u*u)**.48
            # Gentle asymmetric ergonomic tilt, strongest at palm.
            z+=.003*(-u)*math.sin(math.pi*t)
            vs.append((x,y,z))
    for j in range(nt):
        for i in range(nu):
            a=j*(nu+1)+i;fs.append((a,a+1,a+nu+2,a+nu+1))
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update()
    ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.parent=mouse;ob.data.materials.append(mat)
    for f in me.polygons:f.use_smooth=True
    so=ob.modifiers.new('Moulded shell thickness','SOLIDIFY');so.thickness=.0014
    be=ob.modifiers.new('Soft mould edges','BEVEL');be.width=.0005;be.segments=2
    return ob
mouse_surface('Palm shell',-1,1,.435,.999,coat)
mouse_surface('Left click button',-1,-.11,.003,.425,coat)
mouse_surface('Right click button',.11,1,.003,.425,coat)
mouse_surface('Centre wheel channel',-.095,.095,.003,.425,black)
# Close the nose and rear skirt; the shell must not have an open mouth.
for t,name in [(.003,'Mouse nose'),(.999,'Mouse rear skirt')]:
    y=-.0625+.125*t;w=.022+.011*math.sin(math.pi*t)**.65;vs=[];fs=[]
    for i in range(41):
        u=-1+i/20
        z=.007+(.02+.025*math.sin(math.pi*t)**.8)*max(0,1-u*u)**.48+.003*(-u)*math.sin(math.pi*t)
        vs.extend([(w*u,y,.004),(w*u,y,z)])
    for i in range(40):
        a=2*i;fs.append((a,a+2,a+3,a+1) if t<.5 else (a+1,a+3,a+2,a))
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update()
    ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.parent=mouse;ob.data.materials.append(plastic)
box('Mouse underside',(0,0,.004),(.058,.114,.007),rubber,mouse,.003)
box('Thumb rest',(-.034,.009,.007),(.023,.068,.007),rubber,mouse,.003)
cyl('Metal scroll wheel',(0,-.028,.039),.008,.006,steel,mouse,(0,math.pi/2,0),40)
for i in range(28):
    a=i*2*math.pi/28
    box('Wheel knurl',(0,-.028+.008*math.cos(a),.039+.008*math.sin(a)),(.006,.0005,.0005),black,mouse,0)
for y in [.002,.018]:box('Thumb button',(-.032,y,.024),(.004,.013,.004),plastic,mouse,.001)
port((0,-.063,.012),mouse,'USB-C')
for y in [-.041,.042]:box('PTFE skate',(0,y,.0003),(.038,.009,.0005),white,mouse,.001)
cyl('Optical sensor',(0,0,-.0002),.004,.0006,black,mouse)

keyboard=register('keyboard',group('WORKSTATION_KEYBOARD'))
box('Keyboard aluminium base',(0,0,.008),(.32,.13,.016),silver,keyboard,.003)
box('Inset keyboard deck',(0,0,.017),(.313,.123,.004),black,keyboard,.002)
def key(body,x,y,width=1):
    w=width*.019-.002
    box('Keycap skirt '+body,(x,y,.021),(w,.017,.004),plastic,keyboard,.0017)
    vs=[];fs=[];n=8
    for j in range(n+1):
        for i in range(n+1):
            u=(i/n-.5)*2;v=(j/n-.5)*2
            z=.0244+.0011*(1-math.exp(-2*(u*u+v*v)))
            vs.append((x+u*(w-.001)/2,y+v*.0077,z))
    for j in range(n):
        for i in range(n):
            a=j*(n+1)+i;fs.append((a,a+1,a+n+2,a+n+1))
    me=bpy.data.meshes.new('Sculpted keycap');me.from_pydata(vs,[],fs);me.update()
    ob=bpy.data.objects.new('Concave key '+body,me);bpy.context.collection.objects.link(ob);ob.parent=keyboard;ob.data.materials.append(coat)
    for face in me.polygons:face.use_smooth=True
    so=ob.modifiers.new('Key top thickness','SOLIDIFY');so.thickness=.001
    label(body,(x-w*.34,y-.0015,.0258),.0027,keyboard,True)
def row(spec,y):
    x=-.146
    for body,width in spec:
        key(body,x+width*.019/2,y,width);x+=width*.019
row([('Esc',1)]+[(f'F{i}',1) for i in range(1,13)]+[('Del',1),('End',1)],.052)
row([(c,1) for c in ['`','1','2','3','4','5','6','7','8','9','0','-','=']]+[('Back',2)],.031)
row([('Tab',1.5)]+[(c,1) for c in 'QWERTYUIOP']+[('[',1),(']',1),('\\',1.5)],.011)
row([('Caps',1.75)]+[(c,1) for c in 'ASDFGHJKL']+[(';',1),("'",1),('Enter',2.25)],-.009)
row([('Shift',2.25)]+[(c,1) for c in 'ZXCVBNM']+[(',',1),('.',1),('/',1),('Shift',1.75),('Up',1)],-.029)
row([('Ctrl',1.25),('Fn',1.25),('Alt',1.25),('',6.25),('Alt',1),('Left',1),('Down',1),('Right',1)],-.049)
port((0,.067,.009),keyboard,'USB',True)
for x in [-.12,.12]:
    for y in [-.045,.045]:box('Keyboard rubber foot',(x,y,-.001),(.022,.012,.002),rubber,keyboard,.001)

# Existing server body gets lid stamping, service screws and actual rear IO.
box('Server lid perimeter seam',(0,.16,.090),(.433,.638,.0007),black,server,.001)
box('Removable server lid',(0,.16,.091),(.429,.634,.0014),silver,server,.001)
for x in [-.17,.17]:
    for y in [-.12,.42]:screw((x,y,.092),server)
label('COMPUTE / 2U',(-.12,-.186,.076),.007,server)
for i in range(6):
    port((-.135+i*.024,.487,.04),server,'RJ45',True)
for x in [.097,.169]:
    box('Hot swap power module',(x,.489,.045),(.063,.01,.071),coat,server,.001)
    box('IEC inlet',(x,.495,.05),(.025,.002,.019),black,server,.001)
    box('PSU release',(x+.023,.497,.025),(.008,.005,.02),blue,server,.001)
for i in range(18):box('Rear server exhaust',(-.208+i*.018,.487,.075),(.009,.001,.008),black,server,.001)
for x in [-.22,.22]:box('Telescopic chassis rail',(x,.16,.025),(.006,.59,.019),steel,server,.001)
for col in range(6):
    for rowidx in range(2):
        x=-.179+col*.065;z=.025+rowidx*.039
        label('%02d'%(col+rowidx*6),(x-.023,-.187,z+.012),.003,server)
        box('Server bay LED',(x+.022,-.188,z+.01),(.003,.001,.0012),green,server,.0002)
for x in [-.233,.233]:
    for z in [.012,.077]:screw((x,-.179,z),server,True,.002)

storage=register('storage-array',group('RACK_STORAGE_ARRAY'))
box('Storage array chassis',(0,.16,.067),(.445,.6,.133),silver,storage,.002)
box('Storage front backing',(0,-.145,.067),(.443,.01,.13),black,storage,.001)
for rowidx in range(3):
    for col in range(4):
        x=-.163+col*.108;z=.024+rowidx*.041
        tray=group('STORAGE_DRIVE_%02d'%(rowidx*4+col+1),storage)
        box('Storage caddy',(x,-.155,z),(.104,.013,.037),coat,tray,.001)
        box('Caddy inset',(x-.008,-.163,z),(.077,.002,.025),black,tray,.001)
        box('Caddy handle',(x-.008,-.165,z),(.07,.003,.008),silver,tray,.001)
        box('Drive release',(x+.04,-.166,z),(.013,.004,.026),plastic,tray,.001)
        box('Drive LED',(x+.04,-.169,z+.01),(.003,.001,.001),green,tray,.0002)
        label('%02d'%(rowidx*4+col+1),(x-.045,-.168,z+.008),.003,tray)
for x in [-.232,.232]:
    box('Storage mounting ear',(x,-.147,.066),(.021,.009,.133),coat,storage,.001)
    line('Storage handle',[(x,-.16,.03),(x,-.18,.035),(x,-.18,.1),(x,-.16,.105)],.0035,steel,storage)
for x in [-.14,0,.14]:
    f=fan((x,.462,.069),.043,storage,True);f.rotation_euler.x=-math.pi/2

switch=register('network-switch',group('NETWORK_SWITCH_24'))
box('Switch chassis',(0,.07,.023),(.445,.24,.04445),coat,switch,.001)
label('MANAGED / 24',(-.21,-.052,.033),.005,switch)
for i in range(24):
    rowidx=i//12;col=i%12
    port((-.128+col*.023,-.052,.014+rowidx*.018),switch)
for i in range(4):
    box('SFP cage',(.164+i*.014,-.052,.022),(.012,.004,.013),steel,switch,.0004)
    box('SFP opening',(.164+i*.014,-.055,.022),(.009,.001,.01),black,switch,.0002)
for x in [-.232,.232]:box('Switch rack ear',(x,-.048,.023),(.022,.008,.044),silver,switch,.001)
for i in range(6):
    x=-.128+i*.023
    box('Patch cable boot',(x,-.064,.033),(.009,.016,.009),blue,switch,.001)
    line('Ethernet patch lead',[(x,-.07,.033),(x,-.1,-.01),(.21,-.1,-.035-i*.008),(.25,.05,.02)],.0025,blue,switch)

ups=register('ups',group('RACK_UPS'))
box('UPS steel body',(0,.1,.065),(.445,.43,.13),coat,ups,.002)
box('UPS front panel',(0,-.119,.065),(.441,.008,.126),plastic,ups,.002)
for j in range(18):box('UPS grille',(-.08,-.124,.015+j*.0057),(.255,.002,.002),black,ups,.0003)
box('LCD bezel',(.13,-.126,.073),(.073,.005,.048),black,ups,.001)
screen=material('LCD illuminated blue',(.008,.08,.13),0,.35)
sp=screen.node_tree.nodes.get('Principled BSDF');sp.inputs['Emission Color'].default_value=(.008,.08,.13,1);sp.inputs['Emission Strength'].default_value=.5
box('UPS LCD',(.13,-.129,.074),(.063,.001,.036),screen,ups,.001)
label('230 V',(.107,-.13,.078),.009,ups)
label('ONLINE',(.11,-.13,.064),.004,ups)
for x in [.11,.13,.15]:cyl('UPS control button',(x,-.129,.035),.004,.003,plastic,ups,(math.pi/2,0,0))
for x in [-.231,.231]:box('UPS mounting ear',(x,-.116,.065),(.02,.008,.13),steel,ups,.001)

psu=register('power-supply',group('COMPUTE_PSU'))
box('PSU enclosure',(0,0,.043),(.15,.14,.086),coat,psu,.002)
fan((0,0,.087),.052,psu)
for i in range(6):
    r=.017+i*.006
    line('PSU fan guard',[(r*math.cos(j*math.pi/16),r*math.sin(j*math.pi/16),.1) for j in range(33)],.0008,steel,psu)
box('IEC power inlet',(-.03,-.072,.04),(.028,.003,.02),black,psu,.001)
box('PSU switch',(.03,-.073,.04),(.013,.004,.017),plastic,psu,.001)
for x,z in [(-.036,.036),(-.024,.036),(-.03,.044)]:box('IEC contact pin',(x,-.074,z),(.002,.001,.005),steel,psu,.0002)
label('I',(.029,-.076,.044),.004,psu)
label('O',(.028,-.076,.034),.003,psu)
for x in [-.06,.06]:
    for z in [.014,.071]:screw((x,-.071,z),psu,True)
for i in range(7):box('PSU rear grille',(.056,-.071,.023+i*.005),(.02,.001,.002),black,psu,.0003)

tray=register('service-tray',group('SERVICE_TRAY'))
box('Service tray base',(0,0,.006),(.44,.54,.012),silver,tray,.001)
for x in [-.222,.222]:box('Service tray slide rail',(x,0,.025),(.006,.54,.038),steel,tray,.001)
box('Service tray front',(0,-.274,.025),(.44,.007,.045),coat,tray,.001)
for i in range(50):box('Service tray front vents',(-.21+i*.0085,-.278,.023),(.004,.001,.018),black,tray,.0003)
for x in [-.16,.16]:line('Tray handle',[(x-.03,-.278,.026),(x-.028,-.3,.028),(x+.028,-.3,.028),(x+.03,-.278,.026)],.003,steel,tray)
# Open service chassis: folded walls, board standoffs, drive cages and card support.
for x in [-.218,.218]:
    box('Folded chassis side',(x,0,.082),(.003,.54,.14),silver,tray,.0007)
    box('Chassis return flange',(x,0,.153),(.012,.54,.003),steel,tray,.0005)
box('Rear chassis panel',(0,.268,.082),(.434,.003,.14),silver,tray,.0005)
for x in [-.11,0,.11]:
    for y in [-.139,0,.139]:
        cyl('Motherboard brass standoff',(-.045+y,.11-x,.017),.003,.01,gold,tray)
        screw((-.045+y,.11-x,.027),tray,r=.0018)
box('Rear IO aperture',(.0,.270,.043),(.16,.001,.037),black,tray,.001)
for i in range(7):
    x=-.184+i*.019
    box('Expansion slot rear grille',(x,.270,.1),(.013,.001,.075),black,tray,.001)
    screw((x,.271,.144),tray,True,r=.0015)
# Full length card seats in the PCIe slot and is restrained at both ends.
box('GPU front retention post',(-.061,-.057,.081),(.009,.014,.135),steel,tray,.001)
box('GPU padded support',(-.074,-.057,.029),(.033,.02,.008),rubber,tray,.001)
box('GPU retention cap',(-.08,-.057,.149),(.047,.018,.006),coat,tray,.001)
screw((-.061,-.057,.153),tray)
for x,y,w,d in [(-.145,-.175,.108,.16),(-.024,-.181,.077,.108)]:
    box('Drive mounting sled',(x,y,.017),(w,d,.004),steel,tray,.0007)
    for side in [-1,1]:
        box('Drive cage side',(x+side*w/2,y,.03),(.003,d,.027),silver,tray,.0005)
        for dy in [-d*.36,d*.36]:screw((x+side*(w/2-.006),y+dy,.02),tray,r=.0015)
for x in [-.012,.079,.167]:
    f=fan((x,-.073,.066),.036,tray,front=True)
    box('Fan mounting foot',(x,-.073,.019),(.078,.025,.013),coat,tray,.001)
    for dx in [-.037,.037]:box('Fan cage upright',(x+dx,-.073,.064),(.005,.016,.081),coat,tray,.001)
    box('Fan cage top',(x,-.073,.105),(.078,.018,.004),coat,tray,.001)
# Routed power loom runs along the right wall, with small branches to loads.
for i in range(5):
    line('Sleeved ATX power loom',[(.18+i*.003,-.15,.083),(.203+i*.001,-.1,.055),(.20+i*.001,.0,.039),(.095,.015+i*.003,.035),(.015,.0+i*.003,.036)],.0013,black,tray)
for y in [-.08,.01]:box('Cable loom clamp',(.205,y,.043),(.015,.007,.019),plastic,tray,.001)
for x in [-.145,-.024]:
    for cable_name,points,radius,mat in [
        ('SATA data cable',[(x,-.25,.032),(x+.025,-.252,.028),(.052,-.245,.028),(.055,-.12,.028),(.074,.002,.033)],.0016,blue),
        ('Drive power harness',[(x+.021,-.25,.031),(x+.03,-.255,.031),(.15,-.255,.034),(.16,-.217,.045)],.002,black)]:
        cable=line(cable_name,points,radius,mat,tray)
        for point in cable.data.splines[0].bezier_points:
            point.handle_left_type='VECTOR';point.handle_right_type='VECTOR'
label('OPEN COMPUTE / SERVICE CHASSIS',(-.115,-.279,.033),.005,tray)

# Monitor rear housing, VESA mount, cable routing and subtle UI emission.
for o in list(monitor.children_recursive):
    if o.name.startswith('Dashboard row'):bpy.data.objects.remove(o,do_unlink=True)
box('Monitor rear VESA boss',(0,.047,.35),(.13,.03,.13),coat,monitor,.008)
for x in [-.05,.05]:
    for z in [.3,.4]:screw((x,.066,z),monitor,True)
for i in range(36):box('Monitor lower exhaust',(-.21+i*.012,.025,.2),(.004,.01,.004),black,monitor,.0003)
port((-.12,.03,.198),monitor,'USB')
line('Monitor power lead',[(0,.08,.3),(0,.09,.14),(.04,.08,.04)],.0025,black,monitor)
for i in range(5):
    box('UI separator',(0,.005,.395-i*.033),(.54,.0005,.0006),silver,monitor,0)
    label(['COMPUTE','NETWORK','STORAGE','BACKUP','SYSTEM'][i],(-.29,.003,.408-i*.033),.006,monitor)
    for j in range(12):box('Utilisation bar',(-.02+j*.02,.003,.411-i*.033),(.014,.0005,.008),green if j<7+i%3 else coat,monitor,.0002)

rack=register('rack',group('RACK_CABINET'))
for z in [.025,1.475]:box('Cabinet structural frame',(0,0,z),(.6,.76,.05),coat,rack,.003)
for x in [-.282,.282]:
    for y in [-.355,.355]:box('Cabinet corner post',(x,y,.75),(.032,.032,1.44),coat,rack,.002)
for x in [-.245,.245]:
    box('EIA mounting rail',(x,-.32,.75),(.025,.016,1.4),steel,rack,.001)
    for unit in range(31):
        for offset in [.006,.022,.038]:
            z=.053+unit*.04445+offset
            box('Square cage nut aperture',(x,-.329,z),(.009,.001,.009),black,rack,.0003)
    for unit in range(0,31,2):label(str(unit+1),(x-.004,-.33,.06+unit*.04445),.005,rack)
box('Cabinet right removable panel',(.299,0,.75),(.003,.7,1.4),coat,rack,.001)
box('Cabinet left removable panel',(-.299,0,.75),(.003,.7,1.4),coat,rack,.001)
for z in [.78,1.02]:box('Equipment shelf',(0,.02,z),(.48,.6,.006),coat,rack,.001)
door=group('RACK_DOOR_HINGE',rack);door.location=(-.28,-.383,.055)
for x in [0,.55]:box('Door upright',(x,0,.7),(.025,.025,1.4),coat,door,.002)
for z in [0,1.4]:box('Door crossbar',(.275,0,z),(.55,.025,.025),coat,door,.002)
# Open grille made of thin wires; real openings instead of a solid black plane.
for i in range(47):box('Door grille vertical',(.018+i*.011,0,.7),(.0012,.0015,1.36),plastic,door,0)
for i in range(120):box('Door grille horizontal',(.275,0,.023+i*.0114),(.52,.0015,.0012),plastic,door,0)
box('Door latch',(.52,-.019,.71),(.02,.015,.1),plastic,door,.004)
for z in [.15,1.25]:cyl('Door hinge pin',(0,0,z),.005,.07,steel,door)
for x in [-.25,.25]:
    for y in [-.3,.3]:cyl('Adjustable cabinet foot',(x,y,-.015),.026,.03,rubber,rack)

desk=register('workstation-desk',group('WORKSTATION_DESK'))
box('Workstation desktop',(0,0,.74),(1.25,.65,.035),coat,desk,.005)
for x in [-.53]:
    for y in [-.24,.24]:
        box('Desk square tube leg',(x,y,.36),(.035,.035,.72),coat,desk,.002)
        box('Desk levelling foot',(x,y,-.0175),(.036,.036,.035),rubber,desk,.002)
box('Drawer pedestal',(.45,.025,.35),(.3,.51,.7),coat,desk,.004)
for i in range(3):
    z=.13+i*.215
    drawer=group('DESK_DRAWER_'+str(i+1),desk)
    box('Drawer front',(.45,-.238,z),(.28,.014,.19),plastic,drawer,.003)
    line('Drawer pull',[(.39,-.25,z+.045),(.395,-.267,z+.045),(.505,-.267,z+.045),(.51,-.25,z+.045)],.003,steel,drawer)
for x in [.33,.57]:
    for y in [-.19,.23]:box('Pedestal foot',(x,y,-.0175),(.03,.03,.035),rubber,desk,.002)
box('Left desk foot rail',(-.53,0,.01),(.04,.5,.04),coat,desk,.002)
box('Desk rear stretcher',(0,.24,.67),(1.06,.03,.05),coat,desk,.001)
box('Cable trough',(0,.26,.66),(.7,.11,.035),black,desk,.002)
for x in [-.42,.42]:cyl('Desktop cable grommet',(x,.24,.759),.022,.002,black,desk)

def descendants(p):return [p,*p.children_recursive]
def convert_geometry():
    bpy.context.view_layer.update()
    dg=bpy.context.evaluated_depsgraph_get()
    evaluated=[]
    for p in assets.values():
        for o in list(p.children_recursive):
            if o.type not in {'MESH','CURVE','FONT'}:continue
            me=bpy.data.meshes.new_from_object(o.evaluated_get(dg),preserve_all_data_layers=True,depsgraph=dg)
            evaluated.append((o,me))
    for o,me in evaluated:
        if o.type=='MESH':o.data=me;o.modifiers.clear()
        else:
            new=bpy.data.objects.new(o.name+' mesh',me);bpy.context.collection.objects.link(new)
            new.parent=o.parent;new.matrix_basis=o.matrix_basis.copy()
            bpy.data.objects.remove(o,do_unlink=True)

print('GEOMETRY_CREATED',len(scene.objects),flush=True)
convert_geometry()
for cutter in cutters:bpy.data.objects.remove(cutter,do_unlink=True)
print('GEOMETRY_APPLIED',flush=True)
# Consolidate static meshes by material and parent while retaining moving roots.
for p in assets.values():
    groups={}
    for o in list(p.children_recursive):
        if o.type!='MESH':continue
        key=(o.parent,tuple(m.name if m else '' for m in o.data.materials))
        groups.setdefault(key,[]).append(o)
    for (parent,mats),objects in groups.items():
        if len(objects)<2:continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join();bpy.context.object.name=parent.name+' / '+(mats[0] if mats else 'geometry')

manifest={'units':'metres','blender_up':'Z','gltf_up':'Y','front':'Blender -Y / glTF +Z','assets':{}}
def bounds(p):
    bpy.context.view_layer.update()
    pts=[o.matrix_world@Vector(c) for o in descendants(p) if o.type=='MESH' for c in o.bound_box]
    lo=Vector(tuple(min(v[i] for v in pts) for i in range(3)));hi=Vector(tuple(max(v[i] for v in pts) for i in range(3)))
    return lo,hi
for name,p in assets.items():
    print('EXPORT',name,flush=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in descendants(p):o.select_set(True)
    path=OUT/'models'/(name+'.glb')
    bpy.ops.export_scene.gltf(filepath=str(path),use_selection=True,export_format='GLB',export_apply=True,export_yup=True)
    meshes=[o for o in descendants(p) if o.type=='MESH'];tris=0
    for o in meshes:o.data.calc_loop_triangles();tris+=len(o.data.loop_triangles)
    lo,hi=bounds(p)
    manifest['assets'][name]={'root':p.name,'file':'models/'+path.name,'bytes':path.stat().st_size,'triangles':tris,'mesh_objects':len(meshes),'dimensions_m':list(hi-lo),'moving_roots':[o.name for o in descendants(p) if o.type=='EMPTY' and o!=p]}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))

# Assembled review retains rack-left / workstation-right and the existing inventory.
server.location=(0,-.15,1.22)
switch.location=(0,-.27,1.09)
nas.location=(0,-.08,.785)
tray.location=(0,-.36,.6)
storage.location=(0,-.16,.36)
ups.location=(0,-.2,.12)
mother.location=(-.045,-.25,.622);mother.rotation_euler.z=-math.pi/2
cooler.location=(0,-.23,.637)
gpu.location=(-.09,-.27,.69);gpu.rotation_euler=(math.pi/2,0,-math.pi/2)
hdd.location=(-.145,-.535,.621)
sata.location=(-.024,-.541,.621)
nvme.location=(.072,-.24,.627)
ram.location=(-.011,-.309,.631)
psu.location=(.13,-.535,.615)
desk.location=(1.05,0,0)
monitor.location=(1.05,.11,.758)
keyboard.location=(1.02,-.17,.758)
mouse.location=(1.3,-.18,.758)
external.location=(1.5,-.1,.758)
door.rotation_euler.z=math.radians(-100)

floor=material('Studio floor',(.027,.033,.038),.08,.55)
box('Studio floor',(0,0,-.065),(200,200,.06),floor,r=0)
scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.12,.14,.17,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.view_settings.view_transform='AgX';scene.view_settings.exposure=0
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
for name,pos,power,size in [('Key',(-1.5,-3,3.4),420,3),('Fill',(3,-1.5,2.7),240,2.5),('Rim',(.5,2,3),550,2)]:
    bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;aim(o,(.5,0,.7))
bpy.ops.object.camera_add(location=(3,-5,2.9));cam=bpy.context.object;cam.name='Assembly camera';cam.data.type='ORTHO';cam.data.ortho_scale=2.9;aim(cam,(.55,0,.72));scene.camera=cam
scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'previews'/'assembly.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hardware-collection.blend'))
bpy.ops.render.render(write_still=True)

# Deliver a populated chassis alongside the independent component exports.
chassis_parts=[tray,mother,cooler,gpu,hdd,sata,nvme,ram,psu]
bpy.ops.object.select_all(action='DESELECT')
for p in chassis_parts:
    for o in descendants(p):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'populated-chassis.glb'),use_selection=True,export_format='GLB',export_apply=True,export_yup=True)
for p in assets.values():
    for o in descendants(p):o.hide_render=p not in chassis_parts
cam.location=(.8,-1.65,1.5);aim(cam,(0,-.36,.67));cam.data.ortho_scale=.76
scene.render.resolution_x=1500;scene.render.resolution_y=1200
scene.render.filepath=str(OUT/'previews'/'populated-chassis.png')
bpy.ops.render.render(write_still=True)

# Individual angle views make model issues visible instead of hiding them in the rack.
saved={p:(p.location.copy(),p.scale.copy(),p.rotation_euler.copy()) for p in assets.values()}
for name,p in assets.items():
    if '--chassis-only' in sys.argv and name!='service-tray':continue
    for other in assets.values():
        for o in descendants(other):o.hide_render=other!=p
    p.location=(0,0,0);p.scale=(1,1,1);p.rotation_euler=(0,0,0)
    lo,hi=bounds(p)
    p.location.z=-.035-lo.z
    lo,hi=bounds(p);center=(lo+hi)/2;extent=max(hi-lo)
    cam.location=center+Vector((extent*1.3,-extent*2.3,extent*1.5));aim(cam,center)
    cam.data.ortho_scale=max(extent*1.55,.05)
    scene.render.resolution_x=1100;scene.render.resolution_y=900;scene.cycles.samples=40
    scene.render.filepath=str(OUT/'previews'/(name+'.png'))
    bpy.ops.render.render(write_still=True)
    p.location,p.scale,p.rotation_euler=saved[p]
print('COLLECTION_COMPLETE',len(assets),sum(a['bytes'] for a in manifest['assets'].values()))
