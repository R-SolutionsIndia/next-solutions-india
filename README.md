# Next Solutions V1

A studio-style 3D hardware explorer and request-price catalogue for Next Solutions, with graphite surfaces, sage accents, and a consistent responsive design across the site.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product flow

1. Explore the representative infrastructure rack and workstation.
2. Inspect a product or internal component.
3. Continue into the filtered product catalog.
4. Choose an exact SKU and quantity.
5. Open a prefilled request-price email to `orders@solutionsind.com`.

The 3D scene is an enhancement. Catalog routes and enquiry controls remain usable without WebGL.

## 3D asset strategy

The scene uses procedural geometry for the rack, workstation, NAS, networking equipment, and internal components. Details include port contacts, circuit boards, fasteners, drive bays, fan blades, and labelled keycaps. Studio lighting and physically based materials provide a consistent finish. These are representative models, not exact branded replicas.

`HardwareModels.tsx` and `DataCenterModels.tsx` own model geometry; `HardwareDetails.tsx` contains shared instanced details and textures. `GamingCanvas.tsx` owns lighting and scene assembly, while `CameraRig.tsx` handles responsive framing. Rendering pauses when the hero is offscreen or the tab is hidden. A captured studio poster provides a fallback if WebGL is unavailable.

For exact branded products, replace the representative component with an approved CAD or Blender model exported as an optimized `.glb`:

1. Obtain the manufacturer model or model from dimensioned reference drawings.
2. Correct scale, pivots, materials, and extraction axes in Blender or CAD software.
3. Decimate hidden detail, bake textures, and create desktop/mobile LODs.
4. Export Draco/Meshopt-ready GLB assets and keep the existing scene interaction API.

Do not publish third-party CAD as a product representation without a licence that permits commercial web use.
