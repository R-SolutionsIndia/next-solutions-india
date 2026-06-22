        // Data for components
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

        // --- Three.js Setup ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xF5F3EE, 0.015);
        scene.background = new THREE.Color(0xF5F3EE);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Initial Camera Position
        const defaultCamPos = { x: 0, y: 30, z: 60 };
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
        controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
        controls.minDistance = 20;
        controls.maxDistance = 150;
        controls.target.set(0, 5, 0);
        controls.enableZoom = false; // Disable zoom to allow vertical page scroll
        controls.enablePan = false;

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
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

        // --- Materials ---
        const matDarkMetal = new THREE.MeshStandardMaterial({
            color: 0x999999,
            metalness: 0.6,
            roughness: 0.3,
        });

        const matMatteBlack = new THREE.MeshStandardMaterial({
            color: 0xeaeaea,
            metalness: 0.1,
            roughness: 0.8,
        });

        const matScreen = new THREE.MeshStandardMaterial({
            color: 0x050505,
            emissive: 0x2255ff,
            emissiveIntensity: 0.3,
            metalness: 0.9,
            roughness: 0.1
        });

        // --- Object Construction ---
        const textureLoader = new THREE.TextureLoader();

        // Helper for loading real PNG logos
        function createBrandMaterial(imagePath) {
            const texture = textureLoader.load(imagePath, undefined, undefined, (err) => {
                console.warn(`Failed to load logo: ${imagePath}. Please ensure the PNG exists in the assets folder.`);
            });
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            return new THREE.MeshBasicMaterial({ 
                map: texture,
                transparent: true,
                side: THREE.FrontSide
            });
        }

        const interactables = [];
        const deskGroup = new THREE.Group();
        scene.add(deskGroup);

        // 1. Desk Surface
        const deskGeo = new THREE.BoxGeometry(80, 2, 40);
        const desk = new THREE.Mesh(deskGeo, matDarkMetal);
        desk.position.y = 1;
        desk.receiveShadow = true;
        desk.castShadow = true;
        deskGroup.add(desk);

        // 2. Main Display (Monitors)
        const displayGroup = new THREE.Group();
        displayGroup.position.set(0, 8, -5);
        displayGroup.userData = { id: "MainDisplay", camOffset: {x: 0, y: 12, z: 25}, lookAt: {x: 0, y: 8, z: -5} };
        
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 2, 8, 16), matDarkMetal);
        stand.position.y = -4;
        stand.castShadow = true;
        displayGroup.add(stand);

        const asusMat = createBrandMaterial('./assets/asus.png');

        const screen1 = new THREE.Mesh(new THREE.BoxGeometry(24, 14, 0.5), matScreen);
        screen1.position.set(-12.5, 0, 1);
        screen1.rotation.y = 0.15;
        screen1.castShadow = true;

        const asusLogo1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), asusMat);
        asusLogo1.position.set(0, -6, 0.26); // Slightly above screen face
        screen1.add(asusLogo1);
        displayGroup.add(screen1);

        const screen2 = new THREE.Mesh(new THREE.BoxGeometry(24, 14, 0.5), matScreen);
        screen2.position.set(12.5, 0, 1);
        screen2.rotation.y = -0.15;
        screen2.castShadow = true;

        const asusLogo2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), asusMat);
        asusLogo2.position.set(0, -6, 0.26);
        screen2.add(asusLogo2);
        displayGroup.add(screen2);
        
        deskGroup.add(displayGroup);
        interactables.push(screen1, screen2, stand);

        // 3. Compute Node (Lenovo ThinkStation P8 - High Fidelity Horizontal Workstation)
        const computeNode = new THREE.Group();
        const pw = 16.5; // Sized down width
        const ph = 7.5;  // Sized down height
        const pd = 18.0; // Sized down depth
        computeNode.position.set(30, 2.0 + ph/2, -2);
        computeNode.userData = { id: "ComputeNode", camOffset: {x: 45, y: 14, z: 20}, lookAt: {x: 30, y: 2.0 + ph/2, z: -2} };

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

        // Recessed honeycomb grille (simplified canvas draw for engine.js)
        const grilleCanvas = document.createElement('canvas');
        grilleCanvas.width = 128;
        grilleCanvas.height = 64;
        const grilleCtx = grilleCanvas.getContext('2d');
        grilleCtx.fillStyle = '#0a0a0c';
        grilleCtx.fillRect(0, 0, 128, 64);
        grilleCtx.strokeStyle = '#1e1f22';
        grilleCtx.lineWidth = 1;
        for(let i=0; i<128; i+=6) {
            grilleCtx.beginPath();
            grilleCtx.moveTo(i, 0); grilleCtx.lineTo(i, 64);
            grilleCtx.stroke();
            grilleCtx.beginPath();
            grilleCtx.moveTo(0, i/2); grilleCtx.lineTo(128, i/2);
            grilleCtx.stroke();
        }
        const grilleMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(grilleCanvas), roughness: 0.7 });
        const grille = new THREE.Mesh(new THREE.BoxGeometry(pw - 1.4, ph - 1.4, 0.2), grilleMat);
        grille.position.set(0, 0, pd/2 - 0.05);
        computeNode.add(grille);

        // ThinkStation badge on grille
        const thinkCanvas = document.createElement('canvas');
        thinkCanvas.width = 128;
        thinkCanvas.height = 32;
        const thinkCtx = thinkCanvas.getContext('2d');
        thinkCtx.font = 'bold 15px sans-serif';
        thinkCtx.fillStyle = '#ffffff';
        thinkCtx.fillText('ThinkStation', 5, 22);
        thinkCtx.fillStyle = '#d61c1c';
        thinkCtx.beginPath(); thinkCtx.arc(21, 10, 2, 0, Math.PI * 2); thinkCtx.fill();

        const thinkBadge = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(thinkCanvas), transparent: true }));
        thinkBadge.position.set(-pw/4, ph/4, pd/2 + 0.08);
        computeNode.add(thinkBadge);

        // Lenovo Logo Badge
        const lenovoCanvas = document.createElement('canvas');
        lenovoCanvas.width = 64;
        lenovoCanvas.height = 32;
        const lenovoCtx = lenovoCanvas.getContext('2d');
        lenovoCtx.fillStyle = '#ffffff';
        lenovoCtx.fillRect(0, 0, 64, 32);
        lenovoCtx.font = 'bold 12px sans-serif';
        lenovoCtx.fillStyle = '#000000';
        lenovoCtx.fillText('Lenovo', 10, 20);

        const lenovoBadge = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lenovoCanvas) }));
        lenovoBadge.position.set(pw/4, ph/2 - 0.5, pd/2 + 0.18);
        computeNode.add(lenovoBadge);

        // Bottom horizontal I/O strip
        const ioStrip = new THREE.Mesh(new THREE.BoxGeometry(pw - 1.4, 1.0, 0.25), new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.8 }));
        ioStrip.position.set(0, -ph/2 + 1.1, pd/2 + 0.06);
        computeNode.add(ioStrip);

        // "P8" badge on I/O strip
        const p8Canvas = document.createElement('canvas');
        p8Canvas.width = 64;
        p8Canvas.height = 32;
        const p8Ctx = p8Canvas.getContext('2d');
        p8Ctx.fillStyle = '#d61c1c';
        p8Ctx.fillRect(5, 4, 3, 24);
        p8Ctx.font = 'bold 14px sans-serif';
        p8Ctx.fillText('P8', 14, 21);

        const p8Badge = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(p8Canvas), transparent: true }));
        p8Badge.position.set(-pw/2.5, -ph/2 + 1.1, pd/2 + 0.21);
        computeNode.add(p8Badge);

        // Side Handle Cutout (Right Side)
        const handleRecess = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 9.0), new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9 }));
        handleRecess.position.set(pw/2 + 0.01, 0, 0);
        computeNode.add(handleRecess);

        const handleBracket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.3, 8.8), new THREE.MeshStandardMaterial({ color: 0xd61c1c, metalness: 0.8, roughness: 0.2 }));
        handleBracket.position.set(pw/2 - 0.02, 0, 0);
        computeNode.add(handleBracket);

        deskGroup.add(computeNode);
        interactables.push(chassis);

        // 4. NAS Box (2-Bay PR2100)
        const nasGroup = new THREE.Group();
        nasGroup.position.set(-30, 8, -5);
        nasGroup.userData = { id: "NASBox", camOffset: {x: -45, y: 15, z: 20}, lookAt: {x: -30, y: 8, z: -5} };
        
        const nasBody = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 18), new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.2, roughness: 0.65 }));
        nasBody.castShadow = true;

        // WD Logo and Brand texts on front
        const wdBrandCanvas = document.createElement('canvas');
        wdBrandCanvas.width = 128;
        wdBrandCanvas.height = 128;
        const wdCtx = wdBrandCanvas.getContext('2d');
        wdCtx.fillStyle = '#222226';
        wdCtx.beginPath();
        wdCtx.moveTo(10, 10); wdCtx.lineTo(70, 10);
        wdCtx.quadraticCurveTo(76, 10, 76, 16); wdCtx.lineTo(76, 42);
        wdCtx.quadraticCurveTo(76, 48, 70, 48); wdCtx.lineTo(10, 48);
        wdCtx.quadraticCurveTo(4, 48, 4, 42); wdCtx.lineTo(4, 16);
        wdCtx.quadraticCurveTo(4, 10, 10, 10);
        wdCtx.fill();
        wdCtx.font = 'bold 20px sans-serif';
        wdCtx.fillStyle = '#ffffff';
        wdCtx.textAlign = 'center';
        wdCtx.fillText('WD', 40, 36);
        wdCtx.textAlign = 'left';
        wdCtx.fillStyle = '#dddddd';
        wdCtx.font = 'bold 15px sans-serif';
        wdCtx.fillText('My Cloud', 5, 70);
        wdCtx.fillStyle = '#999999';
        wdCtx.font = '11px sans-serif';
        wdCtx.fillText('PR2100', 5, 88);

        const wdMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wdBrandCanvas), transparent: true });
        const wdLogo = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), wdMat);
        wdLogo.position.set(-1.8, 3.5, 9.01);
        nasBody.add(wdLogo);

        // Power button
        const powerLED = new THREE.Mesh(
            new THREE.RingGeometry(0.18, 0.25, 16), 
            new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide })
        );
        powerLED.position.set(-1.8, 0.5, 9.02);
        nasBody.add(powerLED);

        nasGroup.add(nasBody);

        // 2 NAS Drive bays
        const bayMat = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.6 });
        for(let i=0; i<2; i++) {
            const xBay = 0.5 - 0.5 + (i * 2.2);
            const bay = new THREE.Mesh(new THREE.BoxGeometry(1.9, 11, 0.5), bayMat);
            bay.position.set(xBay, 0, 9.0);
            nasGroup.add(bay);
            // LED
            const led = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.1), new THREE.MeshBasicMaterial({color: 0x00aaff}));
            led.position.set(xBay, -5.8, 9.2);
            nasGroup.add(led);
        }
        deskGroup.add(nasGroup);
        interactables.push(nasBody);

        // 5. Peripherals (Keyboard/Mouse/SSD)
        const periphGroup = new THREE.Group();
        periphGroup.position.set(0, 2.5, 12);
        periphGroup.userData = { id: "Peripherals", camOffset: {x: 0, y: 15, z: 25}, lookAt: {x: 0, y: 2.5, z: 12} };

        const keyboard = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 6), matMatteBlack);
        keyboard.castShadow = true;

        const logiMat = createBrandMaterial('./assets/logitech.png');
        const logiLogo = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), logiMat);
        logiLogo.rotation.x = -Math.PI / 2;
        logiLogo.position.set(0, 0.26, 2);
        keyboard.add(logiLogo);

        periphGroup.add(keyboard);

        const mouse = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 5), matMatteBlack);
        mouse.position.set(14, 0.25, 0);
        mouse.castShadow = true;
        periphGroup.add(mouse);

        // Add Lexar SSD
        const ssd = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 4), matDarkMetal);
        ssd.position.set(20, 0.15, 0);
        ssd.castShadow = true;
        
        const lexarMat = createBrandMaterial('./assets/lexar.png');
        const lexarLogo = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), lexarMat);
        lexarLogo.rotation.x = -Math.PI / 2;
        lexarLogo.rotation.z = -Math.PI / 2;
        lexarLogo.position.set(0, 0.16, 0);
        ssd.add(lexarLogo);

        periphGroup.add(ssd);

        deskGroup.add(periphGroup);
        interactables.push(keyboard, mouse, ssd);

        // 6. Edge Compute Node (HP Z2 Mini G9 Workstation)
        const switchNode = new THREE.Mesh(
            new THREE.BoxGeometry(8, 2.5, 8), 
            new THREE.MeshStandardMaterial({ color: 0x1f2022, metalness: 0.5, roughness: 0.6 }) // Matte dark charcoal
        );
        switchNode.position.set(-25, 3.25, 10);
        switchNode.castShadow = true;
        switchNode.userData = { id: "NetworkSwitch", camOffset: {x: -33, y: 8, z: 18}, lookAt: {x: -25, y: 3.25, z: 10} };

        // Front ventilation face (simplified canvas draw for engine.js)
        const frontGrilleCanvas = document.createElement('canvas');
        frontGrilleCanvas.width = 256;
        frontGrilleCanvas.height = 128;
        const grilleCtx = frontGrilleCanvas.getContext('2d');
        grilleCtx.fillStyle = '#151518';
        grilleCtx.fillRect(0, 0, 256, 128);
        grilleCtx.strokeStyle = '#0a0a0c';
        grilleCtx.lineWidth = 3;
        for (let x = -50; x < 300; x += 10) {
            grilleCtx.beginPath();
            grilleCtx.moveTo(x, 0); grilleCtx.lineTo(x - 30, 128);
            grilleCtx.stroke();
        }
        grilleCtx.strokeStyle = '#d0d0d5';
        grilleCtx.lineWidth = 10;
        grilleCtx.lineCap = 'round';
        grilleCtx.lineJoin = 'round';
        grilleCtx.beginPath();
        grilleCtx.moveTo(110, 44); grilleCtx.lineTo(146, 44);
        grilleCtx.lineTo(110, 84); grilleCtx.lineTo(146, 84);
        grilleCtx.stroke();

        const frontGrilleMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(frontGrilleCanvas), roughness: 0.65 });
        const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.1), frontGrilleMat);
        frontFace.position.set(0, 0, 4.01);
        switchNode.add(frontFace);

        // Front Ports
        const powerBtn = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        powerBtn.position.set(2.8, -0.6, 4.02);
        switchNode.add(powerBtn);

        const powerLED = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        powerLED.position.set(2.8, -0.6, 4.05);
        switchNode.add(powerLED);

        deskGroup.add(switchNode);
        interactables.push(switchNode);


        // --- Interaction Logic ---
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        let hoveredObject = null;
        let activeComponent = null;

        // Populate parent references for interactables so clicking a child triggers the group
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
            const intersects = raycaster.intersectObjects(interactables);

            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
                const target = intersects[0].object.userData.parentGroup || intersects[0].object;
                
                if(hoveredObject !== target && !activeComponent) {
                    if(hoveredObject) gsap.to(hoveredObject.position, { y: hoveredObject.userData.origY || hoveredObject.position.y, duration: 0.3 });
                    hoveredObject = target;
                    if(hoveredObject.userData.origY === undefined) hoveredObject.userData.origY = hoveredObject.position.y;
                    gsap.to(hoveredObject.position, { y: hoveredObject.userData.origY + 0.5, duration: 0.3, ease: "back.out(1.5)" });
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
            controls.enabled = false; // Disable orbit while focused
            
            const targetPos = group.userData.camOffset;
            const lookAtTarget = group.userData.lookAt;
            const compId = group.userData.id;

            // Animate Camera
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

            // Populate & Show UI
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
            // Hide UI
            gsap.to('#detail-card', {
                x: "120%",
                opacity: 0,
                duration: 0.5,
                ease: "power3.in"
            });

            // Reset Object Position
            if(activeComponent) {
                gsap.to(activeComponent.position, { y: activeComponent.userData.origY, duration: 0.5 });
            }

            // Animate Camera Back
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

        // --- Render Loop ---
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            controls.update();

            // Subtle desk floating animation if not focused
            if (!activeComponent) {
                deskGroup.position.y = Math.sin(time) * 0.5;
            }

            // Blink network LEDs
            switchNode.children.forEach(child => {
                if(child.userData.isNetworkLed) {
                    if (child.userData.isAmber) {
                        child.material.color.setHex(Math.random() > 0.8 ? 0xffaa00 : 0x331100);
                    } else {
                        child.material.color.setHex(Math.random() > 0.8 ? 0x00ff66 : 0x002200);
                    }
                }
            });

            // Pulse main screens
            screen1.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.1;
            screen2.material.emissiveIntensity = 0.5 + Math.cos(time * 2.5) * 0.1;

            renderer.render(scene, camera);
        }

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Remove Loader
        window.onload = () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 1000);
            }, 500);
            animate();
        };

