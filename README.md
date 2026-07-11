# Next Solutions V1

A monochrome, gaming-first 3D product explorer and request-price catalog for Next Solutions.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product flow

1. Explore the representative gaming setup.
2. Inspect a product or internal component.
3. Continue into the filtered product catalog.
4. Choose an exact SKU and quantity.
5. Open a prefilled request-price email to `orders@solutionsind.com`.

The 3D scene is an enhancement. Catalog routes and enquiry controls remain usable without WebGL.

## 3D asset strategy

V1 uses proportioned procedural geometry for the representative gaming desk and its internal components. Three.js / React Three Fiber is the real-time renderer; it is not the source of product accuracy.

For exact branded products, replace the representative component with an approved CAD or Blender model exported as an optimized `.glb`:

1. Obtain the manufacturer model or model from dimensioned reference drawings.
2. Correct scale, pivots, materials, and extraction axes in Blender or CAD software.
3. Decimate hidden detail, bake textures, and create desktop/mobile LODs.
4. Export Draco/Meshopt-ready GLB assets and keep the existing scene interaction API.

Do not publish third-party CAD as a product representation without a licence that permits commercial web use.
