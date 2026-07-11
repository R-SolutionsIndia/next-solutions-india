const componentData = {
    "MainDisplay": {
        label: "PRIMARY_INTERFACE",
        title: "ASUS ProArt PA32UCG-K",
        desc: "Dual 32-inch 4K HDR reference monitors. Rendering live telemetry with quantum-dot technology. Factory pre-calibrated for Delta E < 1 color accuracy.",
        m1: { lbl: "REFRESH_RATE", val: "120 Hz" },
        m2: { lbl: "LUMINANCE", val: "1600 nits" }
    },
    "NASBox": {
        label: "STORAGE_ARRAY",
        title: "WD My Cloud Pro PR2100",
        desc: "High-density network attached storage powered by Western Digital Red Pro drives. Configured in RAID 1 for maximum mirroring redundancy and throughput in a compact 2-bay form factor.",
        m1: { lbl: "CAPACITY", val: "36 TB" },
        m2: { lbl: "THROUGHPUT", val: "10 GbE" }
    },
    "ComputeNode": {
        label: "PROCESSING_UNIT",
        title: "Lenovo ThinkStation P8",
        desc: "Liquid-cooled workstation featuring AMD Ryzen Threadripper PRO. Housing dual NVIDIA RTX 6000 Ada Generation GPUs for predictive AI modeling.",
        m1: { lbl: "CUDA_CORES", val: "36,352" },
        m2: { lbl: "THERMAL", val: "42°C" }
    },
    "Peripherals": {
        label: "INPUT_&_STORAGE",
        title: "Logitech MX Master 3S & Lexar SSD",
        desc: "Low-latency wireless input system with tactile mechanical keys. Accompanied by a Lexar Professional SL600 portable SSD for high-speed edge computing data dumps.",
        m1: { lbl: "SENSOR", val: "8000 DPI" },
        m2: { lbl: "TRANSFER", val: "2000 MB/s" }
    },
    "NetworkSwitch": {
        label: "EDGE_COMPUTE_NODE",
        title: "HP Z2 Mini G9 Workstation",
        desc: "High-performance mini workstation configured with an Intel Core i9 processor, professional NVIDIA graphics, and advanced thermal cooling to execute local database instances and edge micro-services.",
        m1: { lbl: "CPU_CORES", val: "24 Cores" },
        m2: { lbl: "GPU_VRAM", val: "12 GB" }
    }
};

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0b0d, 0.002);
scene.background = new THREE.Color(0x0a0b0d);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const defaultCamPos = { x: 0, y: 35, z: 70 };
camera.position.set(defaultCamPos.x, defaultCamPos.y, defaultCamPos.z);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 20;
controls.maxDistance = 150;
controls.target.set(0, 5, 0);
controls.enableZoom = false;
controls.enablePan = false;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2.5);
spotLight.position.set(0, 60, 20);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

const redLight = new THREE.PointLight(0xE63B2E, 2, 50);
redLight.position.set(-20, 10, -10);
scene.add(redLight);

const matDarkMetal = new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.8,
    roughness: 0.2,
});

const matMatteBlack = new THREE.MeshStandardMaterial({
    color: 0x020202,
    metalness: 0.1,
    roughness: 0.8,
});

const matSleekWhite = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    metalness: 0.15,
    roughness: 0.35,
});

const matSleekSilver = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.85,
    roughness: 0.2,
});

const matScreen = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x2255ff,
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1
});

const textureLoader = new THREE.TextureLoader();

function createBrandMaterial(imagePath) {
    const texture = textureLoader.load(imagePath, undefined, undefined, (err) => {
        console.warn(`Failed to load logo: ${imagePath}.`);
    });
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.FrontSide
    });
}

const interactables = [];
const worldGroup = new THREE.Group();
scene.add(worldGroup);

const deskGroup = new THREE.Group();
worldGroup.add(deskGroup);

// 1. Desk Surface
const matWood = new THREE.MeshStandardMaterial({
    color: 0x3d2314, // Rich dark walnut wood
    roughness: 0.8,
    metalness: 0.05
});
const deskGeo = new THREE.BoxGeometry(100, 2, 40);
const desk = new THREE.Mesh(deskGeo, matWood);
desk.position.y = 1;
desk.receiveShadow = true;
desk.castShadow = true;
deskGroup.add(desk);

// 1.5 Environment Details
const deskMatGeo = new THREE.BoxGeometry(45, 0.05, 18);
const deskMatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.1 });
const deskMat = new THREE.Mesh(deskMatGeo, deskMatMat);
deskMat.position.set(0, 2.025, 6);
deskMat.receiveShadow = true;
deskGroup.add(deskMat);

// RGB lighting removed

const mugGroup = new THREE.Group();
mugGroup.position.set(16, 2.01, 2); // Top-right safe corner of the desk mat
const mugBodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16);
const mugMaterial = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.3 });
const mugBody = new THREE.Mesh(mugBodyGeo, mugMaterial);
mugBody.position.y = 1.25;
mugBody.castShadow = true;
mugGroup.add(mugBody);
const mugHandleGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
const mugHandle = new THREE.Mesh(mugHandleGeo, mugMaterial);
mugHandle.position.set(1.2, 1.25, 0);
mugHandle.rotation.y = Math.PI / 2;
mugHandle.castShadow = true;
mugGroup.add(mugHandle);
deskGroup.add(mugGroup);

const phoneGroup = new THREE.Group();
phoneGroup.position.set(-15, 2.05, 12); // Neatly aligned left of the keyboard
phoneGroup.rotation.y = 0.15; // Slanted slightly for natural look
const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 6), matMatteBlack);
phoneBody.castShadow = true;
phoneGroup.add(phoneBody);
const phoneScreen = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 5.8), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x112244, emissiveIntensity: 0.8 }));
phoneGroup.add(phoneScreen);
deskGroup.add(phoneGroup);

// 2. Main Display (Monitors)
const displayGroup = new THREE.Group();
displayGroup.position.set(0, 11, -5);
displayGroup.userData = { id: "MainDisplay", camOffset: {x: 0, y: 15, z: 28}, lookAt: {x: 0, y: 11, z: -5} };

const standGroup = new THREE.Group();

const standBase = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 10), matMatteBlack);
standBase.position.set(0, -8.75, -2);
standBase.castShadow = true;
standGroup.add(standBase);

const standPillar = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 9, 16), matDarkMetal);
standPillar.position.set(0, -4.5, -2);
standPillar.castShadow = true;
standGroup.add(standPillar);

const standArms = new THREE.Mesh(new THREE.BoxGeometry(32, 1.5, 1.5), matDarkMetal);
standArms.position.set(0, 0, -1.5);
standArms.castShadow = true;
standGroup.add(standArms);

displayGroup.add(standGroup);

const asusMat = createBrandMaterial('./assets/asus.png');

// Left Monitor Frame & Screen
const frame1 = new THREE.Mesh(new THREE.BoxGeometry(25, 15, 0.8), matMatteBlack);
frame1.position.set(-13, 0, 1);
frame1.rotation.y = 0.15;
frame1.castShadow = true;

const screen1 = new THREE.Mesh(new THREE.BoxGeometry(24.2, 14.2, 0.1), matScreen);
screen1.position.set(0, 0, 0.41); // Slightly in front of the frame
frame1.add(screen1);

const asusLogo1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), asusMat);
asusLogo1.position.set(0, -6, 0.47);
frame1.add(asusLogo1);
displayGroup.add(frame1);

// Right Monitor Frame & Screen
const frame2 = new THREE.Mesh(new THREE.BoxGeometry(25, 15, 0.8), matMatteBlack);
frame2.position.set(13, 0, 1);
frame2.rotation.y = -0.15;
frame2.castShadow = true;

const screen2 = new THREE.Mesh(new THREE.BoxGeometry(24.2, 14.2, 0.1), matScreen);
screen2.position.set(0, 0, 0.41);
frame2.add(screen2);

const asusLogo2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), asusMat);
asusLogo2.position.set(0, -6, 0.47);
frame2.add(asusLogo2);
displayGroup.add(frame2);

deskGroup.add(displayGroup);
interactables.push(frame1, frame2, standGroup);

// 3. Compute Node (Lenovo ThinkStation P8 - High Fidelity Horizontal Workstation)
function createHoneycombTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, 256, 128);
    
    // Draw honeycomb (hexagon) grid
    ctx.strokeStyle = '#1e1f22';
    ctx.lineWidth = 1.5;
    const hexRadius = 6;
    const xSpacing = hexRadius * Math.sqrt(3);
    const ySpacing = hexRadius * 1.5;
    
    for (let y = -hexRadius; y < 128 + hexRadius; y += ySpacing) {
        let odd = Math.floor(y / ySpacing) % 2 === 0;
        for (let x = -xSpacing; x < 256 + xSpacing; x += xSpacing) {
            const cx = x + (odd ? xSpacing / 2 : 0);
            const cy = y;
            
            ctx.beginPath();
            for (let side = 0; side < 6; side++) {
                const angle = (side * Math.PI) / 3;
                const px = cx + hexRadius * Math.cos(angle);
                const py = cy + hexRadius * Math.sin(angle);
                if (side === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.2 });
}

function createThinkStationTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 128, 32);
    
    // Text: ThinkStation
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('ThinkStation', 5, 22);
    
    // Red dot on the 'i' of Think (approx x=21)
    ctx.fillStyle = '#d61c1c';
    ctx.beginPath();
    ctx.arc(21, 10, 2, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

function createLenovoLogoTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 32);
    
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('Lenovo', 32, 20);
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture });
}

function createP8BadgeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 64, 32);
    
    // Draw vertical red bar
    ctx.fillStyle = '#d61c1c';
    ctx.fillRect(5, 4, 3, 24);
    
    // Draw "P8" in red
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#d61c1c';
    ctx.fillText('P8', 14, 21);
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

const computeNode = new THREE.Group();
const pw = 16.5; // Sized down width
const ph = 7.5;  // Sized down height
const pd = 18.0; // Sized down depth
computeNode.position.set(40, 2.0 + ph/2, -2); // Sitting on desk at y = 5.75
computeNode.userData = { id: "ComputeNode", camOffset: {x: 52, y: 14, z: 20}, lookAt: {x: 40, y: 2.0 + ph/2, z: -2} };

// Outer shell chassis (black/dark-grey metal)
const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1f2022, metalness: 0.7, roughness: 0.4 });
const chassis = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), chassisMat);
chassis.castShadow = true;
chassis.receiveShadow = true;
computeNode.add(chassis);

// Red inner frame collar on the front face (Z = pd/2)
const redFrameMat = new THREE.MeshStandardMaterial({ color: 0xd61c1c, metalness: 0.8, roughness: 0.2 });

const frameTop = new THREE.Mesh(new THREE.BoxGeometry(pw - 0.6, 0.3, 0.25), redFrameMat);
frameTop.position.set(0, ph/2 - 0.5, pd/2 + 0.02);
computeNode.add(frameTop);

const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(pw - 0.6, 0.3, 0.25), redFrameMat);
frameBottom.position.set(0, -ph/2 + 0.5, pd/2 + 0.02);
computeNode.add(frameBottom);

const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, ph - 0.6, 0.25), redFrameMat);
frameLeft.position.set(-pw/2 + 0.5, 0, pd/2 + 0.02);
computeNode.add(frameLeft);

const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, ph - 0.6, 0.25), redFrameMat);
frameRight.position.set(pw/2 - 0.5, 0, pd/2 + 0.02);
computeNode.add(frameRight);

// Recessed honeycomb grille
const p8GrilleMat = createHoneycombTexture();
const p8Grille = new THREE.Mesh(new THREE.BoxGeometry(pw - 1.4, ph - 1.4, 0.2), p8GrilleMat);
p8Grille.position.set(0, 0, pd/2 - 0.05);
computeNode.add(p8Grille);

// ThinkStation badge (horizontal on the left side of the grille)
const thinkMat = createThinkStationTexture();
const thinkBadge = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.9), thinkMat);
thinkBadge.position.set(-pw/4, ph/4, pd/2 + 0.08);
computeNode.add(thinkBadge);

// Lenovo Logo Badge on the top rim (middle-right)
const lenovoLogoMat = createLenovoLogoTexture();
const lenovoBadge = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), lenovoLogoMat);
lenovoBadge.position.set(pw/4, ph/2 - 0.5, pd/2 + 0.18);
computeNode.add(lenovoBadge);

// Bottom horizontal I/O strip
const ioStripMat = new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.8 });
const ioStrip = new THREE.Mesh(new THREE.BoxGeometry(pw - 1.4, 1.0, 0.25), ioStripMat);
ioStrip.position.set(0, -ph/2 + 1.1, pd/2 + 0.06);
computeNode.add(ioStrip);

// "P8" badge on the left of I/O strip
const p8Mat = createP8BadgeTexture();
const p8Badge = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.9), p8Mat);
p8Badge.position.set(-pw/2.5, -ph/2 + 1.1, pd/2 + 0.21);
computeNode.add(p8Badge);

// Front Ports details (glowing power button, audio jack, USBs)
const p8PowerLED = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.11, 16), 
    new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide })
);
p8PowerLED.position.set(pw/2.8, -ph/2 + 1.1, pd/2 + 0.21);
computeNode.add(p8PowerLED);

// USB ports (silver slits)
for(let i=0; i<3; i++) {
    const usb = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.10, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 })
    );
    usb.position.set(pw/6 + (i * 0.9), -ph/2 + 1.1, pd/2 + 0.21);
    computeNode.add(usb);
}

// Side Handle Cutout (Right Side)
const handleRecess = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 3.5, 9.0),
    new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9 })
);
handleRecess.position.set(pw/2 + 0.01, 0, 0);
computeNode.add(handleRecess);

// Red inner handle bracket
const handleBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 3.3, 8.8),
    new THREE.MeshStandardMaterial({ color: 0xd61c1c, metalness: 0.8, roughness: 0.2 })
);
handleBracket.position.set(pw/2 - 0.02, 0, 0);
computeNode.add(handleBracket);

// Black grab bar
const grabBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.4, 7.5),
    new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.7 })
);
grabBar.position.set(pw/2 - 0.15, 0, 0);
computeNode.add(grabBar);

deskGroup.add(computeNode);
interactables.push(chassis);

// 4. NAS Box (WD My Cloud PR2100 - High Fidelity 2-Bay Model)
function createWdBrandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 128, 128);
    
    // WD Logo badge (silver-grey rounded rectangle drawn manually for browser compatibility)
    ctx.fillStyle = '#222226';
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(70, 10);
    ctx.quadraticCurveTo(76, 10, 76, 16);
    ctx.lineTo(76, 42);
    ctx.quadraticCurveTo(76, 48, 70, 48);
    ctx.lineTo(10, 48);
    ctx.quadraticCurveTo(4, 48, 4, 42);
    ctx.lineTo(4, 16);
    ctx.quadraticCurveTo(4, 10, 10, 10);
    ctx.closePath();
    ctx.fill();
    
    // White WD text in badge
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('WD', 40, 36);
    
    // "My Cloud" below badge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#dddddd';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('My Cloud', 5, 70);
    
    // "PR2100" below My Cloud
    ctx.fillStyle = '#999999';
    ctx.font = '11px sans-serif';
    ctx.fillText('PR2100', 5, 88);
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

function createGrilleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Dark grey background
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 64, 128);
    
    // Perforated hole pattern
    ctx.fillStyle = '#060606';
    const rows = 16;
    const cols = 6;
    const r = 2.0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const xPos = 6 + x * 10 + (y % 2) * 5;
            const yPos = 6 + y * 8;
            ctx.beginPath();
            ctx.arc(xPos, yPos, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.1 });
}

function createNasSideTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Dark matte steel background
    ctx.fillStyle = '#0f0f11';
    ctx.fillRect(0, 0, 256, 256);
    
    // Very subtle recessed rectangular indentation
    ctx.strokeStyle = '#08080a'; // Soft top-left shadow
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 226);
    ctx.lineTo(30, 30);
    ctx.lineTo(226, 30);
    ctx.stroke();
    
    ctx.strokeStyle = '#18181f'; // Soft bottom-right highlight
    ctx.beginPath();
    ctx.moveTo(30, 226);
    ctx.lineTo(226, 226);
    ctx.lineTo(226, 30);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0.15 });
}

function createCopyButtonMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Dark button background
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 64, 64);
    
    // Draw cyan glowing copy/download icon
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw basket (bracket) at bottom
    ctx.beginPath();
    ctx.moveTo(16, 42);
    ctx.lineTo(16, 50);
    ctx.lineTo(48, 50);
    ctx.lineTo(48, 42);
    ctx.stroke();
    
    // Draw arrow pointing down
    ctx.beginPath();
    ctx.moveTo(32, 14);
    ctx.lineTo(32, 38);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(22, 28);
    ctx.lineTo(32, 38);
    ctx.lineTo(42, 28);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture });
}

const nasGroup = new THREE.Group();
nasGroup.position.set(-35, 8, -5); // Position remains aligned with desk elements
nasGroup.userData = { id: "NASBox", camOffset: {x: -44, y: 15, z: 20}, lookAt: {x: -35, y: 8, z: -5} };

// Main black powder-coated metal cover with rounded vertical corners
const nasShape = new THREE.Shape();
const w = 8.0; // Narrower width for 2-bay NAS
const d = 18.0; // Deeper chassis
const r = 0.5; // corner radius
const x = -w/2;
const zShape = -d/2;

nasShape.moveTo(x + r, zShape);
nasShape.lineTo(x + w - r, zShape);
nasShape.quadraticCurveTo(x + w, zShape, x + w, zShape + r);
nasShape.lineTo(x + w, zShape + d - r);
nasShape.quadraticCurveTo(x + w, zShape + d, x + w - r, zShape + d);
nasShape.lineTo(x + r, zShape + d);
nasShape.quadraticCurveTo(x, zShape + d, x, zShape + d - r);
nasShape.lineTo(x, zShape + r);
nasShape.quadraticCurveTo(x, zShape, x + r, zShape);

const nasExtrudeSettings = { depth: 13.7, bevelEnabled: false }; // Height is 13.7
const nasBodyGeo = new THREE.ExtrudeGeometry(nasShape, nasExtrudeSettings);

// Apply a multi-material array: [sideMat, capMat]
const nasSideMat = createNasSideTexture();
const nasBodyMaterials = [
    nasSideMat, // side face
    new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.2, roughness: 0.65 }) // front/back faces
];

const nasBody = new THREE.Mesh(nasBodyGeo, nasBodyMaterials);
nasBody.rotation.x = -Math.PI / 2;
nasBody.position.set(0, -6.85, 0); // Centered vertically, front at Z = 9.0
nasBody.castShadow = true;
nasBody.receiveShadow = true;
nasGroup.add(nasBody);

// Front Bezel plate (Slightly larger rounded rectangle collar wrapping around the chassis front)
const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.6, metalness: 0.08 });
const bezelShape = new THREE.Shape();
const bw = 8.3; // Bezel width (slightly wider than chassis)
const bh = 14.0; // Bezel height
const br = 0.6;
const bx = -bw/2;
const by = -bh/2;

bezelShape.moveTo(bx + br, by);
bezelShape.lineTo(bx + bw - br, by);
bezelShape.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
bezelShape.lineTo(bx + bw, by + bh - br);
bezelShape.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
bezelShape.lineTo(bx + br, by + bh);
bezelShape.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
bezelShape.lineTo(bx, by + br);
bezelShape.quadraticCurveTo(bx, by, bx + br, by);

const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, { depth: 0.4, bevelEnabled: false }); // 0.4 depth collar
const bezel = new THREE.Mesh(bezelGeo, bezelMat);
bezel.position.set(0, 0, 8.8); // Extrudes from 8.8 to 9.2, creating a collar sticking out on front
bezel.castShadow = true;
nasGroup.add(bezel);

// Front Left Glossy Black Panel Strip
const glossyMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.15, metalness: 0.8 });
const glossyStrip = new THREE.Mesh(new THREE.BoxGeometry(2.5, 13.4, 0.05), glossyMat);
glossyStrip.position.set(-2.6, 0, 9.22);
nasGroup.add(glossyStrip);

// WD Brand / Logo Badge
const brandMat = createWdBrandTexture();
const brandBadge = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), brandMat);
brandBadge.position.set(-2.6, 4.0, 9.25);
nasGroup.add(brandBadge);

// Power Button
const powerBtnOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), 
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.2 })
);
powerBtnOuter.rotation.x = Math.PI / 2;
powerBtnOuter.position.set(-2.6, 1.0, 9.25);
nasGroup.add(powerBtnOuter);

const powerLED = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.25, 16), 
    new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide })
);
powerLED.position.set(-2.6, 1.0, 9.31);
nasGroup.add(powerLED);

// USB copy button
const copyBtnMat = createCopyButtonMaterial();
const copyBtn = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.1), copyBtnMat);
copyBtn.position.set(-2.6, -3.8, 9.25);
nasGroup.add(copyBtn);

// USB port (blue USB 3.0)
const usbPortRim = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.5, 0.1), 
    new THREE.MeshStandardMaterial({ color: 0x88888b, roughness: 0.2, metalness: 0.9 })
);
usbPortRim.position.set(-2.6, -5.0, 9.25);
nasGroup.add(usbPortRim);

const usbPortInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.25, 0.12), 
    new THREE.MeshStandardMaterial({ color: 0x0055ff, roughness: 0.2, metalness: 0.5 })
);
usbPortInner.position.set(-2.6, -5.0, 9.27);
nasGroup.add(usbPortInner);

// Recessed drive bay area on the right
const bayRecess = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 11.6, 0.3), 
    new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 })
);
bayRecess.position.set(1.3, 0, 9.05);
nasGroup.add(bayRecess);

// 2 Vertical Drive Bays side-by-side
const grilleMat = createGrilleTexture();
const handleMat = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.6, metalness: 0.2 });

for(let i=0; i<2; i++) {
    const xBay = 1.3 - 1.1 + (i * 2.2); // Centers bays at 0.2 and 2.4 relative to bezel center
    
    // Backplate
    const bayBack = new THREE.Mesh(new THREE.BoxGeometry(2.0, 11.4, 0.4), handleMat);
    bayBack.position.set(xBay, 0, 9.08);
    bayBack.castShadow = true;
    nasGroup.add(bayBack);
    
    // Handle latch (top half)
    const handle = new THREE.Mesh(new THREE.BoxGeometry(1.9, 5.4, 0.2), handleMat);
    handle.position.set(xBay, 2.8, 9.20);
    handle.castShadow = true;
    nasGroup.add(handle);
    
    // Tiny pull lever texture on top of handle
    const lever = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 1.7, 0.08), 
        new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.7 })
    );
    lever.position.set(xBay, 4.2, 9.31);
    nasGroup.add(lever);
    
    // Perforated Grille (bottom half)
    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.9, 5.4, 0.15), grilleMat);
    grille.position.set(xBay, -2.8, 9.20);
    grille.castShadow = true;
    nasGroup.add(grille);
    
    // Status LED bar below each bay (Drive 1 & 2 indicators)
    const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.12, 0.1), 
        new THREE.MeshBasicMaterial({ color: 0x00aaff })
    );
    led.position.set(xBay, -6.4, 9.22);
    nasGroup.add(led);
}

deskGroup.add(nasGroup);
interactables.push(nasBody);

// 5. Peripherals (Keyboard/Mouse/SSD)
const periphGroup = new THREE.Group();
periphGroup.position.set(0, 2.05, 12);
periphGroup.userData = { id: "Peripherals", camOffset: {x: 0, y: 15, z: 25}, lookAt: {x: 0, y: 2.5, z: 12} };

// Realistic Keyboard Base (Slight slope)
const keyboardBase = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 6), matMatteBlack);
keyboardBase.rotation.x = 0.05; // Slight slope
keyboardBase.position.set(-2, 0.25, 0); // Position relative to periphGroup
keyboardBase.castShadow = true;

// Key block representing keys
const keys = new THREE.Mesh(new THREE.BoxGeometry(17, 0.2, 5), matDarkMetal);
keys.position.set(0, 0.3, 0);
keyboardBase.add(keys);

const logiMat = createBrandMaterial('./assets/logitech.png');
const logiLogo = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.8), logiMat);
logiLogo.rotation.x = -Math.PI / 2;
logiLogo.position.set(0, 0.41, 1.8);
keyboardBase.add(logiLogo);

periphGroup.add(keyboardBase);

// Realistic Ergonomic Mouse (Wired Symmetrical Office Mouse)
const mouseGroup = new THREE.Group();
mouseGroup.position.set(10, 0.05, 0); // Position relative to periphGroup
mouseGroup.rotation.y = -0.05; // Angled very slightly inwards for a natural look

const mouseBodyGeo = new THREE.SphereGeometry(1, 32, 32);
const pos = mouseBodyGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i); // ranges from -1 to 1

    // 1. Z-axis: Scale to length of 4 units
    z = z * 2.0;

    // 2. Normalize Z to [0, 1] (0 is front, 1 is back)
    let zn = (z + 2) / 4;

    // 3. Height (Y) Profile: Peak at zn = 0.55, sloping down to front and back
    let heightFactor = 0.1 + 0.9 * Math.sin(zn * Math.PI * 0.9);
    if (y > 0) {
        y = y * heightFactor * 1.35;
    } else {
        y = 0; // Flat bottom
    }

    // 4. Width (X) Profile: Symmetrical, wider in the back-middle, tapering towards front
    let widthFactor = 0.75 + 0.45 * Math.sin(zn * Math.PI * 0.85);
    x = x * widthFactor * 1.25;

    pos.setXYZ(i, x, y, z);
}
mouseBodyGeo.computeVertexNormals();

const mouseBody = new THREE.Mesh(mouseBodyGeo, matMatteBlack);
mouseBody.position.set(0, 0.1, 0); 
mouseBody.castShadow = true;
mouseBody.receiveShadow = true;
mouseGroup.add(mouseBody);

// Left/Right click separator line (gap)
const dividerMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });
const clickDivider = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 1.8), dividerMat);
clickDivider.position.set(0, 0.85, -1.1); // Embedded slightly along center profile
mouseGroup.add(clickDivider);

// Transverse curved seam dividing click buttons from palm rest
const horizontalGroove = new THREE.Mesh(
    new THREE.TorusGeometry(1.0, 0.015, 8, 32, Math.PI), 
    dividerMat
);
horizontalGroove.rotation.x = Math.PI / 2; // Lie flat in X-Z plane
horizontalGroove.rotation.z = Math.PI;     // Curve backwards
horizontalGroove.position.set(0, 1.29, -0.2); // Sits right on the curved top surface
horizontalGroove.scale.set(1.0, 0.25, 1.0); // Flatten the curve slightly
mouseGroup.add(horizontalGroove);

// Scroll Wheel Slot
const slotMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 1.0 });
const wheelSlot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.8), slotMat);
wheelSlot.position.set(0, 0.92, -1.0);
mouseGroup.add(wheelSlot);

// Scroll Wheel (Dark Metal)
const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 24), matDarkMetal);
wheel.rotation.z = Math.PI / 2;
wheel.position.set(0, 0.98, -1.0);
wheel.castShadow = true;
mouseGroup.add(wheel);

// Cable Relief (joint at the front)
const reliefMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
const relief = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 12), reliefMat);
relief.rotation.x = Math.PI / 2;
relief.position.set(0, 0.15, -2.1);
relief.castShadow = true;
mouseGroup.add(relief);

periphGroup.add(mouseGroup);

// Cable running from mouse to back of the desk (Black cable)
const cablePoints = [
    new THREE.Vector3(10, 2.20, 9.8),     // Relief outlet
    new THREE.Vector3(9.8, 2.14, 8.8),    // Resting on desk mat
    new THREE.Vector3(7.5, 2.13, 5.0),    // Resting on desk mat
    new THREE.Vector3(2.0, 2.13, 1.0),    // Resting on desk mat
    new THREE.Vector3(-8.0, 2.08, -5.0)   // Resting on wood desk surface (center y=2.08)
];
const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
const cableGeo = new THREE.TubeGeometry(cableCurve, 32, 0.08, 8, false); // 0.16 thickness cable
const cableMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.7, metalness: 0.1 });
const cable = new THREE.Mesh(cableGeo, cableMat);
cable.castShadow = true;
cable.receiveShadow = true;
deskGroup.add(cable);

// Lexar SSD
const ssd = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 4), matDarkMetal);
ssd.position.set(-15, 0.15, -6); // Aligned vertically with smartphone
ssd.castShadow = true;

const lexarMat = createBrandMaterial('./assets/lexar.png');
const lexarLogo = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), lexarMat);
lexarLogo.rotation.x = -Math.PI / 2;
lexarLogo.rotation.z = -Math.PI / 2;
lexarLogo.position.set(0, 0.16, 0);
ssd.add(lexarLogo);
periphGroup.add(ssd);

deskGroup.add(periphGroup);
interactables.push(keyboardBase, mouseGroup, ssd);

// Desk Lamp (Moved to right to balance empty space and PC)
const lampGroup = new THREE.Group();
lampGroup.position.set(26, 2.01, -12);

const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.4, 32), matMatteBlack);
lampBase.position.y = 0.2;
lampBase.castShadow = true;
lampGroup.add(lampBase);

const lampArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 16), matDarkMetal);
lampArm1.position.set(0, 4.5, 0);
lampArm1.rotation.x = -0.3;
lampArm1.castShadow = true;
lampGroup.add(lampArm1);

const lampArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 16), matDarkMetal);
lampArm2.position.set(0, 11, 3);
lampArm2.rotation.x = 0.8;
lampArm2.castShadow = true;
lampGroup.add(lampArm2);

const lampHead = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.8, 4, 32), matMatteBlack);
lampHead.position.set(0, 14, 7);
lampHead.rotation.x = -0.6;
lampHead.castShadow = true;
lampGroup.add(lampHead);

const lampLight = new THREE.SpotLight(0xffeedd, 1.5);
lampLight.position.set(0, 13.5, 7);
lampLight.target.position.set(0, 0, 7);
lampLight.angle = Math.PI / 4;
lampLight.penumbra = 0.4;
lampLight.castShadow = true;
lampGroup.add(lampLight);
lampGroup.add(lampLight.target);

const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({color: 0xffeedd}));
bulb.position.set(0, -1, 0);
lampHead.add(bulb);

deskGroup.add(lampGroup);

// 6. Network Gateway (Ubiquiti UniFi Dream Machine SE)
// 6. Edge Compute Node (HP Z2 Mini G9 Workstation)
function createHpZ2FrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#151518';
    ctx.fillRect(0, 0, 256, 128);
    
    // Slanted ventilation grille lines
    ctx.strokeStyle = '#0a0a0c';
    ctx.lineWidth = 3;
    for (let x = -50; x < 300; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 30, 128);
        ctx.stroke();
    }
    
    // Stylized silver "Z" workstation logo in the center
    ctx.strokeStyle = '#d0d0d5';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(110, 44);
    ctx.lineTo(146, 44);
    ctx.lineTo(110, 84);
    ctx.lineTo(146, 84);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0.25 });
}

const switchNode = new THREE.Mesh(
    new THREE.BoxGeometry(8, 2.5, 8), 
    new THREE.MeshStandardMaterial({ color: 0x1f2022, metalness: 0.5, roughness: 0.6 }) // Matte dark charcoal
);
switchNode.position.set(-35, 3.25, 10); // Resting flat on the desk mat
switchNode.castShadow = true;
switchNode.userData = { id: "NetworkSwitch", camOffset: {x: -43, y: 8, z: 18}, lookAt: {x: -35, y: 3.25, z: 10} };

// Front ventilation face
const frontGrilleMat = createHpZ2FrontTexture();
const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.1), frontGrilleMat);
frontFace.position.set(0, 0, 4.01); // Positioned flush on the front face of chassis
switchNode.add(frontFace);

// Front Ports (Power Button, USB, Jack)
const powerBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 })
);
powerBtn.position.set(2.8, -0.6, 4.02);
switchNode.add(powerBtn);

const hpPowerLED = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
hpPowerLED.position.set(2.8, -0.6, 4.05);
switchNode.add(hpPowerLED);

// USB Slot
const usbSlot = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.12, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 })
);
usbSlot.position.set(2.0, -0.6, 4.02);
switchNode.add(usbSlot);

deskGroup.add(switchNode);
interactables.push(switchNode);


// --- Interaction Logic ---
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
let hoveredObject = null;
let activeComponent = null;

interactables.forEach(mesh => {
    let parent = mesh;
    while(parent && !parent.userData.id) {
        parent = parent.parent;
    }
    if(parent) mesh.userData.parentGroup = parent;
});

window.addEventListener('mousemove', (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObjects(interactables, true);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        
        let obj = intersects[0].object;
        let target = obj;
        
        // Find the root parent that has the userData.id (the group)
        while(target && target.parent && !target.userData.id && target !== scene) {
            if (target.userData.parentGroup) {
                target = target.userData.parentGroup;
                break;
            }
            target = target.parent;
        }
        
        if (target.userData && target.userData.id) {
            if(hoveredObject !== target && !activeComponent) {
                if(hoveredObject) gsap.to(hoveredObject.position, { y: hoveredObject.userData.origY || hoveredObject.position.y, duration: 0.3 });
                hoveredObject = target;
                if(hoveredObject.userData.origY === undefined) hoveredObject.userData.origY = hoveredObject.position.y;
                gsap.to(hoveredObject.position, { y: hoveredObject.userData.origY + 0.5, duration: 0.3, ease: "back.out(1.5)" });
            }
        }
    } else {
        document.body.style.cursor = 'default';
        if(hoveredObject && !activeComponent) {
            gsap.to(hoveredObject.position, { y: hoveredObject.userData.origY, duration: 0.3 });
            hoveredObject = null;
        }
    }
});

window.addEventListener('click', () => {
    if (hoveredObject && !activeComponent) {
        focusOnComponent(hoveredObject);
    }
});

function focusOnComponent(group) {
    activeComponent = group;
    controls.enabled = false;
    
    const targetPos = group.userData.camOffset;
    const lookAtTarget = group.userData.lookAt;
    const compId = group.userData.id;

    gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z)
    });

    gsap.to(controls.target, {
        x: lookAtTarget.x,
        y: lookAtTarget.y,
        z: lookAtTarget.z,
        duration: 1.5,
        ease: "power3.inOut"
    });

    const data = componentData[compId];
    document.getElementById('c-label').innerText = data.label;
    document.getElementById('c-title').innerText = data.title;
    document.getElementById('c-desc').innerText = data.desc;
    document.getElementById('c-m1-lbl').innerText = data.m1.lbl;
    document.getElementById('c-m1-val').innerText = data.m1.val;
    document.getElementById('c-m2-lbl').innerText = data.m2.lbl;
    document.getElementById('c-m2-val').innerText = data.m2.val;

    gsap.to('#detail-card', {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out"
    });
}

document.getElementById('btn-back').addEventListener('click', () => {
    gsap.to('#detail-card', {
        x: "120%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.in"
    });

    if(activeComponent) {
        gsap.to(activeComponent.position, { y: activeComponent.userData.origY, duration: 0.5 });
    }

    gsap.to(camera.position, {
        x: defaultCamPos.x,
        y: defaultCamPos.y,
        z: defaultCamPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => camera.lookAt(0, 5, 0),
        onComplete: () => {
            activeComponent = null;
            hoveredObject = null;
            controls.enabled = true;
        }
    });

    gsap.to(controls.target, {
        x: 0, y: 5, z: 0,
        duration: 1.5,
        ease: "power3.inOut"
    });
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    controls.update();

    if (!activeComponent) {
        deskGroup.position.y = Math.sin(time) * 0.5;
    }

    // RGB animation removed

    switchNode.children.forEach(child => {
        if(child.userData.isNetworkLed) {
            if (child.userData.isAmber) {
                child.material.color.setHex(Math.random() > 0.8 ? 0xffaa00 : 0x331100);
            } else {
                child.material.color.setHex(Math.random() > 0.8 ? 0x00ff66 : 0x002200);
            }
        }
    });

    screen1.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.1;
    screen2.material.emissiveIntensity = 0.5 + Math.cos(time * 2.5) * 0.1;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Scroll Morph Animation ---
gsap.registerPlugin(ScrollTrigger);

gsap.to(worldGroup.position, {
    y: -30,
    z: -80,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".scroll-buffer",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

gsap.to(worldGroup.rotation, {
    x: 0.6,
    y: -0.3,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".scroll-buffer",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

gsap.to(scene.fog, {
    density: 0.04, // Thickens fog to fade models out completely
    ease: "power2.in",
    scrollTrigger: {
        trigger: ".scroll-buffer",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

window.onload = () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 1000);
        }
    }, 500);
    animate();
};