# Hardware collection

The existing website composition and component inventory remain the implementation target.
These are editable, unbranded modelling studies, not certified replicas of commercial products.

## Reference direction

- NAS: Synology DS925+ enclosure and tray design: https://www.synology.com/en-us/products/DS925%2B
- HDD: Seagate Exos construction: https://www.seagate.com/in/en/products/enterprise-drives/exos/
- Server: Dell PowerEdge R760 chassis: https://i.dell.com/sites/csdocuments/Product_Docs/en/poweredge-r760-spec-sheet.pdf
- Peripherals: Logitech MX proportions and restrained materials: https://www.logitech.com/en-us/products/keyboards/mx-keys-s.920-011559.html

## Files and reproduction

Run `Blender -b -t 6 -P assets/blender/build_nas.py` for the original NAS.
Then run `Blender -b -t 6 -P assets/blender/build_hardware_v2.py` for the revised study.
The latter reads `nas-prototype.blend` and saves separate assets under `v2/`.

Assets use metres, Blender Z-up and negative Y as the front. glTF converts axes on export.
Each GLB is exported at the origin before moving its root for the review render.
The studio arrangement is a review sheet, not a proposed website layout.

## Complete collection

`collection/hardware-collection.blend` is the assembled editable model library.
`collection/index.html` is the inspection gallery, with a render and GLB download for each model.
`collection/manifest.json` records dimensions, polygon counts, sizes and retained child roots.

The collection contains 20 separately exported assets:
NAS, server, rack storage array, HDD, SATA SSD, NVMe SSD, portable SSD, RAM,
motherboard, CPU cooler, GPU, power supply, 24-port network switch, UPS,
rack cabinet, service tray, monitor, compact keyboard, mouse and workstation desk.
The desk retains the existing right-hand drawer pedestal. The full website lineup remains intact.

The service tray is now an open chassis with folded sidewalls, motherboard standoffs,
drive sleds, an upright supported GPU, seated memory, a fan bank and routed wiring.
The motherboard, RAM and cooler retain their native dimensions in the assembly.
`collection/populated-chassis.glb` contains the complete installed component arrangement
at its assembly coordinates; `collection/previews/populated-chassis.png` is its close-up.

Run the original and v2 builders once if their source blends are absent. Then:

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b -t 6 -P assets/blender/build_collection.py
node assets/blender/verify_collection.mjs
/Applications/Blender.app/Contents/MacOS/Blender -b -P assets/blender/check_roundtrip.py
node assets/blender/create_gallery.mjs
```

The builder applies bevels, curved surfaces and other modifiers, and joins static geometry
by material and parent. Door and drive roots remain separate for translation/rotation.
The rack GLB is exported with its door closed; the assembled Blender review opens the door.
The model library uses standard metallic/roughness materials, without external texture dependencies.
Front-facing sockets, rear connections, material separation, screws, ventilation, fan geometry,
concave key surfaces, curved mouse buttons and circuit-board detailing are included.

These are detailed generic hardware models informed by manufacturer references, not dimensionally
certified replicas of specific SKUs. The assembled render is an inspection scene.

## Website integration

`components/scene/BlenderHardware.tsx` loads the complete collection into the existing
interactive hero. It uses one shared scale for hardware, preserves component selection
and extraction, and reads installed chassis transforms from the Blender assembly.
The current website keeps its open-front rack treatment and original page layout.

After rebuilding Blender exports, run `npm run prepare:hardware`. This optimizes the
20 GLBs with Meshopt, verifies their decoded meshes and retained pivots, and writes
content-addressed files to `public/models/hardware/` plus the generated asset map.
The deployed collection is about 4.7 MiB. Editable Blender files and inspection renders
stay under `assets/` and are not served to visitors. No external decoder is needed.
`public/scene/hardware-studio.webp` provides the updated non-WebGL fallback image.

The Node verifier checks the inventory, GLB structure, finite vertex data, dimensions,
mesh budgets, retained roots and preview coverage. The Blender round-trip check imports each
delivered GLB and checks dimensions and materials. Inspection renders are stored in `collection/previews/`.
