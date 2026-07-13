# Design QA

## Comparison target

- Source visual truth: `/Users/nitya/.codex/generated_images/019f4b3a-57f0-7522-8c19-9164967e376c/exec-c3f15d77-cca6-46bb-acbc-76413d18de49.png`
- Browser-rendered implementation: `/tmp/next-solutions-lighting-audit-02-after.jpg`
- Full-view comparison: `/tmp/next-solutions-lighting-audit-comparison-after.png`
- Focused workstation comparison: `/tmp/next-solutions-lighting-audit-workstation-comparison-after.png`
- Desktop viewport: `1672 × 941`, overview state, dark theme
- Mobile viewport: `390 × 844`, overview state
- Browser: Codex in-app browser

## Full-view comparison evidence

The implementation preserves the reference's first-viewport structure: black header, left-aligned two-line industrial heading and restrained copy, open-front data-centre rack in the visual centre, operator workstation at right, six annotated hardware callouts, black/graphite materials, cool white key light, cyan infrastructure accents, and the next-section preview at the bottom edge.

## Focused region comparison evidence

The focused rack/workstation comparison confirms the same hardware hierarchy as the reference: compute node, managed switch, four-bay NAS, partially deployed service tray, fixed storage array, rack UPS, open cabinet door, cable path, widescreen operations monitor, keyboard, mouse, external SSD, desk frame, and drawer pedestal. A focused comparison was required because the rack faces, tray hardware, workstation dashboard, and cable path were too small to judge reliably in the full-view board.

## Fidelity surfaces

- Fonts and typography: Barlow Condensed now supplies the industrial two-line display treatment; IBM Plex Mono remains the UI/body face. Heading wrapping, optical weight, button type and callout labels match the reference hierarchy.
- Spacing and layout: the rack/workstation group is right-weighted, the title and controls retain clear negative space, the tray is partially open in overview, and the `1672 × 941` viewport exposes the next section at the same vertical rhythm as the source.
- Colors and visual tokens: true black, graphite, cool white and cyan are consistent across the hero, rack, workstation, callouts and drawers. No purple or mixed page theming was introduced.
- Image/model quality: all major reference hardware is represented with recognizable procedural 3D geometry, branded labels, bevels, vents, bays, rack ears, handles, rails, status lights and a high-resolution live-operations monitor texture.
- Copy and content: the visible hero copy matches the accepted source. Product-detail copy remains catalogue-safe and labels the scene as representative rather than making inventory claims.
- Responsiveness and accessibility: the mobile scene stays inside `390 × 844`, the main controls remain visible, the mobile hardware rail is scrollable, drawers retain keyboard focus management and Escape-to-close behavior, and reduced-motion handling remains intact.

## Comparison history

### Pass 1 — blocked

- P1: rack was narrow and skeletal; the open cabinet silhouette and door from the source were missing.
- P1: workstation used two small generic displays and read as a miniature desk.
- P1: rack order differed from the reference and lacked the lower storage array.
- P2: callouts floated away from their hardware and the left scene overlay hid the door.
- P2: the monitor used placeholder-looking emissive rectangles.

Fixes: added a wider enclosed cabinet, open perforated door, top/bottom shell, front rails, reordered equipment, 12-bay array, cyan cable bundle, partially deployed service tray, single widescreen dashboard monitor, desk pedestal, rear cyan task lighting, anchored callouts, tighter overlay fade and condensed display typography.

### Pass 2 — passed

- Post-fix evidence: `/tmp/next-solutions-datacentre-native-clean-comparison.png`
- Focused post-fix evidence: `/tmp/next-solutions-datacentre-hardware-clean-comparison.png`
- No actionable P0, P1 or P2 visual differences remain for this procedural V1.

### Pass 3 — blocked

- Current-run pre-fix evidence: `/tmp/next-solutions-lighting-audit-01-before.png`
- Current-run reference/implementation board: `/tmp/next-solutions-lighting-audit-comparison-before.png`
- P1: the right workstation depended on monitor emission and floor bounce; the desk slab, keyboard, mouse, external SSD, legs and drawer pedestal merged into a near-black silhouette.
- P2: the workstation lacked the reference's broad cool-white key light and cyan rear/edge wash, reducing both object recognition and click-target discoverability.
- P2: graphite surfaces used nearly identical values, so the desktop, modesty panel and pedestal did not separate at the accepted desktop viewport.

Fixes: introduced a workstation-local cool-white key and cyan task fill, moved the scene-level right-side fill onto the desk, lifted only the workstation graphite values, and increased the cyan task-bar emission. The room, ambient racks and page background remain black.

### Pass 4 — passed

- Post-fix full-view evidence: `/tmp/next-solutions-lighting-audit-comparison-after.png`
- Focused post-fix evidence: `/tmp/next-solutions-lighting-audit-workstation-comparison-after.png`
- The keyboard, mouse, external SSD, desk edge, frame and drawer faces now read as separate objects without flattening the overall dark theme.
- No actionable P0, P1 or P2 visual differences remain for the requested lighting/readability scope.

### Pass 5 — component presentation passed

- Reported failure evidence: `/var/folders/85/258mp8d52hq3_m7dlymn4hn40000gn/T/codex-clipboard-66ff1bf3-0c94-45f4-8fbf-94abf7c76dba.png`
- Post-fix component board: `/tmp/next-solutions-tray-pose-contact-sheet.png`
- P1: tray-mounted storage retained a horizontal service pose during inspection, leaving the SATA SSD visible almost entirely as its 7 mm edge.
- Fix: every tray component now interpolates to a hardware-specific camera-facing rotation and inspection scale. SATA SSD, NVMe SSD and HDD expose their labelled face; RAM exposes both labelled modules; GPU exposes its full fan shroud.
- All five inspection poses stay clear of the rack, details drawer and category rail at `1280 × 720`.

### Pass 6 — card and object mapping passed

- Mapping evidence: `/tmp/next-solutions-card-mapping-contact-sheet.png`
- Catalogue-image audit: `/tmp/next-solutions-product-image-audit.png`
- P1: the `Storage` callout pointed at the fixed 12-bay rack array but opened a removable 3.5-inch HDD; the `Server` callout pointed at a server while opening the complete compute tray.
- Fix: removed those unsupported product callouts and their component click zones. The server, fixed storage array and UPS remain as non-interactive structural infrastructure.
- P2: the `Workstation` callout opened only the monitor, and its leader dot landed on the desk. It is now labelled `Display` and anchored to the monitor.
- P2: the `Graphics` leader dot landed on the tray face. It is now anchored to the installed graphics card.
- The four remaining overview mappings are exact: `Display → Operator display`, `Graphics → Graphics cards`, `Network → 24-port network switch`, and `NAS → 4-bay network storage`.
- All twelve marketplace card images were visually audited against their product names and routes; no incorrect catalogue-image mapping was found.

### Pass 7 — focused component lighting passed

- Reported failure evidence: `/var/folders/85/258mp8d52hq3_m7dlymn4hn40000gn/T/codex-clipboard-96d23310-171e-4dc8-a11c-9298a9e6b71d.png`
- Post-fix NAS evidence: `/tmp/next-solutions-lighting-nas-after.jpg`
- Cross-component evidence: `/tmp/next-solutions-lighting-network-after.jpg`, `/tmp/next-solutions-lighting-gpu-after.jpg`, `/tmp/next-solutions-lighting-hdd-after-top.jpg`, `/tmp/next-solutions-lighting-sata-after.jpg`, `/tmp/next-solutions-lighting-nvme-after.jpg`, `/tmp/next-solutions-lighting-memory-after.jpg` and `/tmp/next-solutions-lighting-display-after-top.jpg`.
- P1: fixed overview lighting left the focused NAS front, dark drive bays and some smaller tray components below the legibility threshold.
- Fix: added a focus-aware three-point inspection rig derived from each component's presentation target. A soft neutral key exposes labels and face geometry, a controlled cyan fill separates dark graphite surfaces, and a rear rim preserves enclosure depth.
- The stronger enclosure profile is limited to NAS and network hardware. Overview/rack lighting remains unchanged, and emissive workstation hardware is not washed out.
- All eight checked component classes retain readable fronts, labels and silhouettes against the black data-centre environment.

### Pass 8 — compute component selector passed

- Overview evidence: `/tmp/next-solutions-component-selector-overview.jpg`
- Selector evidence: `/tmp/next-solutions-component-selector-card.jpg`
- Selected-component evidence: `/tmp/next-solutions-component-selector-hdd.jpg`
- Replaced the overview `Graphics` hotspot with a general `Components` hotspot anchored to the complete compute service tray.
- The first click now deploys the tray and opens one grouped selector card containing SATA SSD, M.2 NVMe, Memory, Graphics and Hard drive.
- Product extraction and the details drawer only begin after the user selects a specific component from that card.
- The WebGL fallback and mobile hardware menu use the same `Components` entry and state transition.

### Pass 9 — workstation setup and mouse passed

- Setup evidence: `/tmp/next-solutions-workstation-setup-final-browser.jpg`
- Focused hardware board: `/tmp/next-solutions-workstation-interactions.jpg`
- Focused mouse evidence: `/tmp/next-solutions-workstation-mouse-final.jpg`
- Clean-hover evidence: `/tmp/next-solutions-workstation-hover-clean.jpg`
- Replaced the overview `Display` hotspot with a general `Setup` hotspot. It now moves to a complete workstation view before any individual product is selected.
- The workstation selector exposes Display, Keyboard, Mouse and External SSD, while the same four visible 3D objects remain direct click targets in the zoomed setup view.
- Returning from an individual workstation drawer restores the workstation selector instead of jumping to the data-centre overview.
- Rebuilt the mouse as a tapered, bevelled shell with a familiar top silhouette, click seam, wheel, side grips and restrained status accent; its focused pose now presents the complete top face.
- Keyboard and external SSD focused poses now rotate toward the camera so their keys, vents and labels remain readable.
- Removed the hover wireframe mesh from the shared interactive hitbox. Hover retains only the pointer cursor and no longer draws white/cyan component outlines.

### Pass 10 — full-height hero and mouse scale passed

- Full-height hero evidence: `/tmp/next-solutions-full-height-hero.jpg`
- Reduced focused mouse evidence: `/tmp/next-solutions-mouse-scaled-final.jpg`
- The desktop hero now fills the available viewport below the header instead of stopping at the former 790 px cap.
- Reduced only the focused mouse presentation scale from 2.2 to 2.0; its desk scale, proportions and workstation placement remain unchanged.
- Setup → Mouse still opens the matching details drawer with the complete mouse visible and no framework error overlay.

## Interaction and runtime verification

- Overview → Explore infrastructure → compute tray fully deploys.
- Compute tray → Graphics → GPU releases, clears the cabinet and presents beside the details drawer.
- Compute tray → SATA SSD / M.2 NVMe / Memory / Graphics / Hard drive → each component clears the tray and presents its recognizable primary face beside the matching drawer.
- Overview → Display / Graphics / Network / NAS → each callout points at, extracts and describes the same visible hardware object.
- Overview → Display → widescreen monitor presents beside the operator-display drawer.
- Focused workstation lighting keeps the monitor and adjacent desk geometry legible during presentation.
- Focus-aware inspection lighting keeps the NAS bays, switch ports, GPU fans, HDD/SSD/NVMe/RAM labels and operator display readable without lifting the entire room exposure.
- Overview → Setup → Display / Keyboard / Mouse / External SSD presents the complete workstation first, then extracts the selected object and restores the setup selector on close.
- Overview → Network → switch clears the rack after its cable bundle is removed from the extraction state.
- Drawer Escape closes and restores the parent overview/rack state.
- Page identity, non-blank content, framework-overlay check and drawer DOM states passed.
- Console contains only the upstream Three.js `Clock` deprecation warning; no application error was observed.

## Intentional P3 deviations

- The accepted source is a photorealistic concept render; V1 uses performant procedural React Three Fiber models rather than CAD/photogrammetry assets.
- The cabinet door uses an instanced perforation treatment rather than a high-poly physical cutout mesh.
- The existing production header/logo container is retained instead of replacing it with the concept's larger mock-logo lockup.
- The implemented scene deliberately keeps the user-requested smaller rack/workstation scale, a deeper data-centre background, an ultrawide operations display and a colder cyan edge treatment; the reference is a tighter, brighter studio-like single-rack composition.

final result: passed
