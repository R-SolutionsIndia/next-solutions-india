"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { MathUtils, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useSceneStore, type ProductTarget } from "@/lib/scene-store";

import { CameraRig } from "./CameraRig";
import {
  ExternalSSDModel,
  KeyboardModel,
  MonitorModel,
  MouseModel,
  TowerCaseModel,
  TowerInternalsModel,
} from "./HardwareModels";
import styles from "./GamingHero.module.css";

const INTERNAL_TARGETS = new Set([
  "tower",
  "sata-ssd",
  "nvme-ssd",
  "ram",
  "gpu",
  "hdd",
]);

function Hotspot({
  label,
  position,
  onSelect,
}: {
  label: string;
  position: [number, number, number];
  onSelect: () => void;
}) {
  return (
    <Html
      className={styles.hotspot}
      position={position}
      center
      distanceFactor={4.7}
      zIndexRange={[4, 0]}
    >
      <button
        className={styles.hotspotButton}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        type="button"
      >
        {label}
      </button>
    </Html>
  );
}

function Room() {
  return (
    <group>
      <mesh position={[0.3, 1.35, -1.18]} receiveShadow>
        <boxGeometry args={[6.2, 3.1, 0.08]} />
        <meshStandardMaterial color="#080b0e" metalness={0.08} roughness={0.72} />
      </mesh>
      <mesh position={[0.8, 2.45, -0.86]} rotation={[0.04, 0, -0.04]}>
        <boxGeometry args={[3.1, 0.035, 0.08]} />
        <meshStandardMaterial color="#e8f6ff" emissive="#bde9ff" emissiveIntensity={3.2} />
      </mesh>
      <pointLight position={[0.8, 2.24, -0.45]} color="#bde9ff" intensity={5.5} distance={4.5} />
      <mesh position={[0.55, -0.07, 0]} receiveShadow>
        <boxGeometry args={[5.15, 0.14, 2.2]} />
        <meshStandardMaterial color="#24272a" metalness={0.36} roughness={0.42} />
      </mesh>
      <mesh position={[0.55, -0.147, 0.87]}>
        <boxGeometry args={[5.18, 0.025, 0.05]} />
        <meshStandardMaterial color="#656b70" metalness={0.7} roughness={0.24} />
      </mesh>
      {[-1.42, 2.35].map((x) => (
        <group key={x} position={[x, -0.76, -0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 1.38, 0.1]} />
            <meshStandardMaterial color="#25292c" metalness={0.72} roughness={0.28} />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry args={[0.42, 0.06, 0.5]} />
            <meshStandardMaterial color="#181b1e" metalness={0.64} roughness={0.34} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Setup() {
  const focus = useSceneStore((state) => state.focus);
  const reducedMotion = useSceneStore((state) => state.reducedMotion);
  const focusTower = useSceneStore((state) => state.focusTower);
  const inspectProduct = useSceneStore((state) => state.inspectProduct);
  const towerOpen = INTERNAL_TARGETS.has(focus);
  const showOverviewHotspots = focus === "overview";
  const activeProduct = focus === "overview" || focus === "tower" ? null : focus;
  const monitorGroup = useRef<Group>(null);
  const keyboardGroup = useRef<Group>(null);
  const mouseGroup = useRef<Group>(null);
  const externalSsdGroup = useRef<Group>(null);
  const deskProgress = useRef({ monitor: 0, keyboard: 0, mouse: 0, externalSsd: 0 });

  const inspect = (target: ProductTarget) => inspectProduct(target);

  useFrame((_, delta) => {
    const progress = deskProgress.current;
    progress.monitor = reducedMotion
      ? Number(focus === "monitor")
      : MathUtils.damp(progress.monitor, Number(focus === "monitor"), 4.6, delta);
    progress.keyboard = reducedMotion
      ? Number(focus === "keyboard")
      : MathUtils.damp(progress.keyboard, Number(focus === "keyboard"), 4.6, delta);
    progress.mouse = reducedMotion
      ? Number(focus === "mouse")
      : MathUtils.damp(progress.mouse, Number(focus === "mouse"), 4.6, delta);
    progress.externalSsd = reducedMotion
      ? Number(focus === "external-ssd")
      : MathUtils.damp(progress.externalSsd, Number(focus === "external-ssd"), 4.6, delta);

    if (monitorGroup.current) {
      const value = progress.monitor;
      monitorGroup.current.position.set(value * 0.16, value * 0.1, value * 0.38);
      monitorGroup.current.rotation.set(value * -0.03, value * -0.08, 0);
      monitorGroup.current.scale.setScalar(1 + value * 0.07);
    }

    if (keyboardGroup.current) {
      const value = progress.keyboard;
      keyboardGroup.current.position.set(
        0.28 + value * 0.26,
        0.025 + value * 0.18,
        0.55 + value * 0.48,
      );
      keyboardGroup.current.rotation.set(value * -0.12, -0.035 + value * -0.13, value * 0.035);
      keyboardGroup.current.scale.setScalar(1 + value * 0.2);
    }

    if (mouseGroup.current) {
      const value = progress.mouse;
      mouseGroup.current.position.set(
        1.18 + value * 0.2,
        0.055 + value * 0.18,
        0.74 + value * 0.48,
      );
      mouseGroup.current.rotation.set(value * -0.14, -0.08 + value * -0.14, value * 0.05);
      mouseGroup.current.scale.setScalar(1 + value * 0.32);
    }

    if (externalSsdGroup.current) {
      const value = progress.externalSsd;
      externalSsdGroup.current.position.set(
        1.63 + value * 0.2,
        0.025 + value * 0.18,
        0.66 + value * 0.5,
      );
      externalSsdGroup.current.rotation.set(value * -0.18, -0.12 + value * -0.2, value * 0.05);
      externalSsdGroup.current.scale.setScalar(1 + value * 0.4);
    }
  });

  return (
    <group>
      <Room />

      <group ref={monitorGroup} onClick={() => inspect("monitor")}>
        <MonitorModel position={[-0.42, 0.82, -0.42]} scale={1.1} rotation={[0, 0.035, 0]} />
        <MonitorModel position={[0.86, 0.82, -0.42]} scale={1.1} rotation={[0, -0.035, 0]} variant={1} />
      </group>

      <group
        ref={keyboardGroup}
        position={[0.28, 0.025, 0.55]}
        rotation={[0, -0.035, 0]}
        onClick={() => inspect("keyboard")}
      >
        <KeyboardModel scale={1.18} />
      </group>
      <group
        ref={mouseGroup}
        position={[1.18, 0.055, 0.74]}
        rotation={[0, -0.08, 0]}
        onClick={() => inspect("mouse")}
      >
        <MouseModel scale={1.18} />
      </group>
      <group
        ref={externalSsdGroup}
        position={[1.63, 0.025, 0.66]}
        rotation={[0, -0.12, 0]}
        onClick={() => inspect("external-ssd")}
      >
        <ExternalSSDModel scale={1.08} />
      </group>

      <group
        position={[2.14, 0.82, -0.14]}
        scale={1.15}
        onClick={showOverviewHotspots ? focusTower : undefined}
      >
        <TowerCaseModel panelOpen={towerOpen ? 1 : 0} reducedMotion={reducedMotion} />
        <TowerInternalsModel
          onSelect={inspect}
          activeProduct={activeProduct}
          ssdExtract={focus === "sata-ssd" ? 1 : 0}
          reducedMotion={reducedMotion}
        />
      </group>

      {showOverviewHotspots ? (
        <>
          <Hotspot label="Monitors" position={[0.28, 1.62, -0.12]} onSelect={() => inspect("monitor")} />
          <Hotspot label="Tower" position={[2.83, 1.74, 0.04]} onSelect={focusTower} />
          <Hotspot label="Keyboard" position={[0.18, 0.36, 0.56]} onSelect={() => inspect("keyboard")} />
          <Hotspot label="Mouse" position={[1.15, 0.22, 1.3]} onSelect={() => inspect("mouse")} />
          <Hotspot label="External SSD" position={[1.91, 0.34, 0.8]} onSelect={() => inspect("external-ssd")} />
        </>
      ) : null}

      <RoundedBox args={[1.6, 0.018, 0.76]} radius={0.035} smoothness={3} position={[0.4, 0.008, 0.58]} receiveShadow>
        <meshStandardMaterial color="#111419" roughness={0.62} />
      </RoundedBox>
      <ContactShadows position={[0.72, 0.005, 0.12]} scale={5.7} opacity={0.5} blur={2.2} far={3.4} />
    </group>
  );
}

export default function GamingCanvas() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <Canvas
      className={styles.canvas}
      camera={{ position: [4.2, 2.2, 5.1], fov: 43, near: 0.1, far: 40 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      shadows="basic"
    >
      <color attach="background" args={["#020304"]} />
      <fog attach="fog" args={["#020304", 6.5, 13]} />
      <ambientLight intensity={0.85} />
      <hemisphereLight color="#c7e8f4" groundColor="#151116" intensity={1.05} />
      <spotLight
        position={[1.6, 4.2, 3.2]}
        color="#eaf8ff"
        intensity={52}
        angle={0.5}
        penumbra={0.75}
        castShadow
      />
      <spotLight position={[-2.5, 2.5, 2.8]} color="#8fcce9" intensity={20} angle={0.55} penumbra={0.9} />
      <pointLight position={[2.8, 1.45, 1.25]} color="#c5eaff" intensity={7} distance={4.5} />
      <pointLight position={[0.3, 1.25, 2.2]} color="#d7eff8" intensity={8} distance={4.2} />
      <pointLight position={[2.25, 1, 0.9]} color="#a8dcf3" intensity={10} distance={3} />
      <Suspense fallback={null}>
        <Setup />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        enablePan={false}
        minDistance={4}
        maxDistance={9.2}
        minAzimuthAngle={-0.18}
        maxAzimuthAngle={0.34}
        minPolarAngle={1.02}
        maxPolarAngle={1.42}
        target={[0.35, 0.58, -0.02]}
      />
      <CameraRig controlsRef={controlsRef} />
    </Canvas>
  );
}
