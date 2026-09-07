"use client";

import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo, useRef, type RefObject } from "react";
import { MathUtils, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useSceneStore, type ProductTarget, type SceneTarget } from "@/lib/scene-store";

import { CameraRig } from "./CameraRig";
import {
  COMPUTE_TRAY_COMPONENT_TRANSFORMS,
  ComputeServiceTray,
  DEMO_RACK_LOCAL_Y,
  DemoRackFrame,
  NasApplianceModel,
  NetworkSwitchModel,
  OPERATOR_EQUIPMENT_TRANSFORMS,
  OperatorWorkstation,
  RackServerUnit,
  RackStorageArrayModel,
  UpsModel,
  type ComputeComponentId,
  type ComputeComponentRefs,
  type ModelSelectHandler,
  type OperatorEquipmentId,
  type OperatorEquipmentRefs,
} from "./DataCenterModels";
import styles from "./GamingHero.module.css";
import { CAMERA_PRESETS } from "./scene-data";

const COMPUTE_COMPONENTS: readonly ComputeComponentId[] = [
  "sata-ssd",
  "nvme-ssd",
  "ram",
  "gpu",
  "hdd",
];

const OPERATOR_EQUIPMENT: readonly OperatorEquipmentId[] = [
  "primary-monitor",
  "keyboard",
  "mouse",
  "external-ssd",
];

const EQUIPMENT_TO_PRODUCT: Record<OperatorEquipmentId, ProductTarget> = {
  "primary-monitor": "monitor",
  keyboard: "keyboard",
  mouse: "mouse",
  "external-ssd": "external-ssd",
};

const COMPUTE_PRESENT_SCALE: Record<ComputeComponentId, number> = {
  "sata-ssd": 5.2,
  "nvme-ssd": 8.4,
  ram: 5,
  gpu: 3.6,
  hdd: 4.2,
};

const COMPUTE_PRESENT_LOCAL_X: Record<ComputeComponentId, number> = {
  "sata-ssd": -1.58,
  "nvme-ssd": -1.55,
  ram: -1.6,
  gpu: -1.58,
  hdd: -1.52,
};

const COMPUTE_PRESENT_ROTATION: Record<
  ComputeComponentId,
  [number, number, number]
> = {
  "sata-ssd": [1.16, 0.34, -0.08],
  "nvme-ssd": [1.18, 0.3, -0.06],
  ram: [-1.14, 0.34, -0.05],
  gpu: [-0.08, 0.34, 0.025],
  hdd: [1.12, 0.34, -0.08],
};

const OPERATOR_PRESENT_TRANSFORMS: Record<
  OperatorEquipmentId,
  { x: number; y: number; z: number; scale: number }
> = {
  "primary-monitor": { x: -1.35, y: 1.74, z: 1.18, scale: 1.2 },
  keyboard: { x: -1.25, y: 1.28, z: 1.28, scale: 1.3 },
  mouse: { x: -1.08, y: 1.3, z: 1.34, scale: 2 },
  "external-ssd": { x: -1, y: 1.26, z: 1.28, scale: 2.55 },
};
const OPERATOR_PRESENT_ROTATIONS: Record<
  OperatorEquipmentId,
  [number, number, number]
> = {
  "primary-monitor": [-0.08, -0.24, 0.04],
  keyboard: [0.48, -0.34, 0.04],
  mouse: [0.55, -0.35, 0.02],
  "external-ssd": [0.52, -0.4, 0.04],
};

const RACK_POSITION: [number, number, number] = [1.25, 1.69, -0.15];
const RACK_SCALE: [number, number, number] = [1.08, 1.02, 1.08];
const WORKSTATION_POSITION: [number, number, number] = [3.85, 0, 0.16];
const WORKSTATION_SCALE = 0.92;
const OVERVIEW_RACK_OFFSET_X = 1.3;
const OVERVIEW_WORKSTATION_OFFSET_X = 0.7;
const OPERATOR_INSPECTION_RACK_OFFSET: [number, number] = [-1.65, -0.52];
const RACK_INSPECTION_WORKSTATION_OFFSET: [number, number] = [1.45, -0.38];
const PARKED_RACK_DOOR_OPEN = Math.PI / 2 / 2.72;

function isComputeComponent(target: SceneTarget): target is ComputeComponentId {
  return COMPUTE_COMPONENTS.includes(target as ComputeComponentId);
}

function DataCenterSetup() {
  const focus = useSceneStore((state) => state.focus);
  const reducedMotion = useSceneStore((state) => state.reducedMotion);
  const focusRack = useSceneStore((state) => state.focusRack);
  const focusWorkstation = useSceneStore((state) => state.focusWorkstation);
  const inspectProduct = useSceneStore((state) => state.inspectProduct);

  const inspectionLighting = useMemo(() => {
    if (focus === "overview" || focus === "rack") return null;

    const [x, y, z] = CAMERA_PRESETS[focus].target;
    const enclosure = focus === "nas" || focus === "network-switch";
    const workstationSetup = focus === "workstation";

    return {
      key: [x + 1.25, y + 1.05, z + 2.35] as [number, number, number],
      fill: [x - 1.4, y + 0.12, z + 1.55] as [number, number, number],
      rim: [x + 0.25, y + 1.3, z - 0.85] as [number, number, number],
      keyIntensity: enclosure ? 15 : workstationSetup ? 12 : 12,
      fillIntensity: enclosure ? 8 : workstationSetup ? 6 : 6,
    };
  }, [focus]);

  const trayRef = useRef<Group>(null);
  const rackRootRef = useRef<Group>(null);
  const workstationRootRef = useRef<Group>(null);
  const nasRef = useRef<Group>(null);
  const networkRef = useRef<Group>(null);
  const sataRef = useRef<Group>(null);
  const nvmeRef = useRef<Group>(null);
  const ramRef = useRef<Group>(null);
  const gpuRef = useRef<Group>(null);
  const hddRef = useRef<Group>(null);
  const primaryMonitorRef = useRef<Group>(null);
  const keyboardRef = useRef<Group>(null);
  const mouseRef = useRef<Group>(null);
  const externalSsdRef = useRef<Group>(null);

  const componentRefs = useMemo<ComputeComponentRefs>(
    () => ({
      "sata-ssd": sataRef,
      "nvme-ssd": nvmeRef,
      ram: ramRef,
      gpu: gpuRef,
      hdd: hddRef,
    }),
    [],
  );

  const equipmentRefs = useMemo<OperatorEquipmentRefs>(
    () => ({
      "primary-monitor": primaryMonitorRef,
      keyboard: keyboardRef,
      mouse: mouseRef,
      "external-ssd": externalSsdRef,
    }),
    [],
  );

  const componentProgress = useRef<Record<ComputeComponentId, number>>({
    "sata-ssd": 0,
    "nvme-ssd": 0,
    ram: 0,
    gpu: 0,
    hdd: 0,
  });
  const equipmentProgress = useRef<Record<OperatorEquipmentId, number>>({
    "primary-monitor": 0,
    keyboard: 0,
    mouse: 0,
    "external-ssd": 0,
  });
  const rackUnitProgress = useRef({ nas: 0, network: 0, tray: 0 });
  const overviewLayoutProgress = useRef(1);
  const operatorInspectionProgress = useRef(0);
  const rackInspectionProgress = useRef(0);
  const selectedOperatorEquipment = useRef<OperatorEquipmentId | null>(null);

  const activeComponent = isComputeComponent(focus) ? focus : null;
  const operatorInspection =
    focus === "workstation" ||
    OPERATOR_EQUIPMENT.some((equipment) => EQUIPMENT_TO_PRODUCT[equipment] === focus);
  const rackInspection =
    focus === "nas" || focus === "network-switch" || activeComponent !== null;
  const rackDeployed = focus === "rack" || activeComponent !== null;

  const handleRackSelect: ModelSelectHandler = (event) => {
    event.stopPropagation();
    focusRack();
  };

  const handleWorkstationSelect: ModelSelectHandler = (event) => {
    event.stopPropagation();
    focusWorkstation();
  };

  const handleProductSelect =
    (target: ProductTarget) => (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      inspectProduct(target);
    };

  useFrame((_, delta) => {
    overviewLayoutProgress.current = reducedMotion
      ? Number(focus === "overview")
      : MathUtils.damp(
          overviewLayoutProgress.current,
          Number(focus === "overview"),
          3.8,
          delta,
        );
    operatorInspectionProgress.current = reducedMotion
      ? Number(operatorInspection)
      : MathUtils.damp(
          operatorInspectionProgress.current,
          Number(operatorInspection),
          4.8,
          delta,
        );
    rackInspectionProgress.current = reducedMotion
      ? Number(rackInspection)
      : MathUtils.damp(
          rackInspectionProgress.current,
          Number(rackInspection),
          4.8,
          delta,
        );

    if (rackRootRef.current) {
      rackRootRef.current.position.set(
        RACK_POSITION[0] +
          overviewLayoutProgress.current * OVERVIEW_RACK_OFFSET_X +
          operatorInspectionProgress.current * OPERATOR_INSPECTION_RACK_OFFSET[0],
        RACK_POSITION[1],
        RACK_POSITION[2] +
          operatorInspectionProgress.current * OPERATOR_INSPECTION_RACK_OFFSET[1],
      );
    }

    if (workstationRootRef.current) {
      workstationRootRef.current.position.set(
        WORKSTATION_POSITION[0] +
          overviewLayoutProgress.current * OVERVIEW_WORKSTATION_OFFSET_X +
          rackInspectionProgress.current * RACK_INSPECTION_WORKSTATION_OFFSET[0],
        WORKSTATION_POSITION[1],
        WORKSTATION_POSITION[2] +
          rackInspectionProgress.current * RACK_INSPECTION_WORKSTATION_OFFSET[1],
      );
    }

    const rackProgress = rackUnitProgress.current;
    const trayTarget = Number(rackDeployed);
    rackProgress.tray = reducedMotion
      ? trayTarget
      : MathUtils.damp(rackProgress.tray, trayTarget, 4.4, delta);
    rackProgress.nas = reducedMotion
      ? Number(focus === "nas")
      : MathUtils.damp(rackProgress.nas, Number(focus === "nas"), 4.8, delta);
    rackProgress.network = reducedMotion
      ? Number(focus === "network-switch")
      : MathUtils.damp(
          rackProgress.network,
          Number(focus === "network-switch"),
          4.8,
          delta,
        );

    if (trayRef.current) {
      trayRef.current.position.set(
        0,
        DEMO_RACK_LOCAL_Y.serviceTray,
        0.02 + rackProgress.tray * 1.16,
      );
    }

    if (nasRef.current) {
      const release = MathUtils.smoothstep(rackProgress.nas, 0, 0.24);
      const clear = MathUtils.smoothstep(rackProgress.nas, 0.24, 0.7);
      const present = MathUtils.smoothstep(rackProgress.nas, 0.7, 1);
      nasRef.current.position.set(
        present * -1.62,
        DEMO_RACK_LOCAL_Y.nas + release * 0.08 + present * 0.08,
        0.26 + clear * 1.34 + present * 0.16,
      );
      nasRef.current.rotation.set(-present * 0.04, -present * 0.2, present * 0.03);
      nasRef.current.scale.setScalar(1 + present * 0.24);
    }

    if (networkRef.current) {
      const release = MathUtils.smoothstep(rackProgress.network, 0, 0.24);
      const clear = MathUtils.smoothstep(rackProgress.network, 0.24, 0.7);
      const present = MathUtils.smoothstep(rackProgress.network, 0.7, 1);
      networkRef.current.position.set(
        present * -1.64,
        DEMO_RACK_LOCAL_Y.networkSwitch + release * 0.08 + present * 0.08,
        0.28 + clear * 1.3 + present * 0.16,
      );
      networkRef.current.rotation.set(0, -present * 0.16, 0);
      networkRef.current.scale.setScalar(1 + present * 0.32);
    }

    for (const component of COMPUTE_COMPONENTS) {
      const target = Number(focus === component);
      componentProgress.current[component] = reducedMotion
        ? target
        : MathUtils.damp(componentProgress.current[component], target, 5.2, delta);

      const group = (componentRefs[component] as RefObject<Group | null> | undefined)?.current;
      if (!group) continue;

      const progress = componentProgress.current[component];
      const base = COMPUTE_TRAY_COMPONENT_TRANSFORMS[component];
      const release = MathUtils.smoothstep(progress, 0, 0.24);
      const clear = MathUtils.smoothstep(progress, 0.24, 0.7);
      const present = MathUtils.smoothstep(progress, 0.7, 1);
      const forwardClear = component === "gpu" || component === "ram" ? 0.9 : 0.72;
      const presentX = COMPUTE_PRESENT_LOCAL_X[component];
      const presentRotation = COMPUTE_PRESENT_ROTATION[component];

      group.position.set(
        base.position[0] + present * (presentX - base.position[0]),
        base.position[1] + release * 0.2 + present * 0.08,
        base.position[2] + clear * forwardClear + present * 0.28,
      );
      group.rotation.set(
        MathUtils.lerp(base.rotation[0], presentRotation[0], present),
        MathUtils.lerp(base.rotation[1], presentRotation[1], present),
        MathUtils.lerp(base.rotation[2], presentRotation[2], present),
      );
      group.scale.setScalar(
        base.scale * (1 + present * (COMPUTE_PRESENT_SCALE[component] - 1)),
      );
    }

    const fallbackSelectedEquipment: OperatorEquipmentId | null =
      focus === "monitor"
        ? "primary-monitor"
        : focus === "keyboard" || focus === "mouse" || focus === "external-ssd"
          ? focus
          : null;
    const selectedEquipment =
      focus === "monitor" && selectedOperatorEquipment.current === "primary-monitor"
        ? selectedOperatorEquipment.current
        : fallbackSelectedEquipment;

    for (const equipment of OPERATOR_EQUIPMENT) {
      const target = Number(selectedEquipment === equipment);
      equipmentProgress.current[equipment] = reducedMotion
        ? target
        : MathUtils.damp(equipmentProgress.current[equipment], target, 4.8, delta);

      const group = (equipmentRefs[equipment] as RefObject<Group | null> | undefined)?.current;
      if (!group) continue;

      const progress = equipmentProgress.current[equipment];
      const base = OPERATOR_EQUIPMENT_TRANSFORMS[equipment];
      const release = MathUtils.smoothstep(progress, 0, 0.24);
      const clear = MathUtils.smoothstep(progress, 0.24, 0.7);
      const present = MathUtils.smoothstep(progress, 0.7, 1);
      const staged = OPERATOR_PRESENT_TRANSFORMS[equipment];
      const stagedRotation = OPERATOR_PRESENT_ROTATIONS[equipment];

      group.position.set(
        base.position[0] + present * (staged.x - base.position[0]),
        base.position[1] + release * (staged.y - base.position[1]),
        base.position[2] + clear * (staged.z - base.position[2]),
      );
      group.rotation.set(
        MathUtils.lerp(base.rotation[0], stagedRotation[0], present),
        MathUtils.lerp(base.rotation[1], stagedRotation[1], present),
        MathUtils.lerp(base.rotation[2], stagedRotation[2], present),
      );
      group.scale.setScalar(base.scale + present * (staged.scale - base.scale));
    }
  });

  return (
    <group>
      {inspectionLighting ? (
        <>
          <pointLight
            color="#f1f9fd"
            decay={2}
            distance={5.4}
            intensity={inspectionLighting.keyIntensity}
            position={inspectionLighting.key}
          />
          <pointLight
            color="#d8e2da"
            decay={2}
            distance={4.6}
            intensity={inspectionLighting.fillIntensity}
            position={inspectionLighting.fill}
          />
          <pointLight
            color="#ffffff"
            decay={2}
            distance={4}
            intensity={13}
            position={inspectionLighting.rim}
          />
        </>
      ) : null}

      <mesh visible={focus === "overview" || focus === "rack" || focus === "workstation"} rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.04, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color="#090b0c" />
      </mesh>

      <group
        ref={rackRootRef}
        position={RACK_POSITION}
        rotation={[0, -0.055, 0]}
        scale={RACK_SCALE}
      >
        <DemoRackFrame
          doorOpen={PARKED_RACK_DOOR_OPEN}
          showDoor={false}
          label="NEXT SOLUTIONS // RACK 01"
          showCables={focus !== "network-switch"}
          onSelect={handleRackSelect}
        >
          <RackServerUnit
            position={[0, DEMO_RACK_LOCAL_Y.topServer, 0.12]}
            unitHeight={0.27}
            label="2U COMPUTE NODE"
            interactive={false}
          />
          <NetworkSwitchModel
            ref={networkRef}
            position={[0, DEMO_RACK_LOCAL_Y.networkSwitch, 0.28]}
            portCount={24}
            label="NS-24 MANAGED"
            onSelect={handleProductSelect("network-switch")}
          />
          <mesh position={[0, DEMO_RACK_LOCAL_Y.nas - 0.3, 0.03]} castShadow>
            <boxGeometry args={[1.12, 0.055, 1.08]} />
            <meshStandardMaterial
              color="#222a30"
              metalness={0.72}
              roughness={0.36}
            />
          </mesh>
          <ComputeServiceTray
            ref={trayRef}
            position={[0, DEMO_RACK_LOCAL_Y.serviceTray, 0.02]}
            componentRefs={componentRefs}
            selectedComponent={activeComponent}
            interactive={focus === "rack"}
            onSelect={handleRackSelect}
            onComponentSelect={(component, event) => {
              event.stopPropagation();
              inspectProduct(component);
            }}
          />
          <NasApplianceModel
            ref={nasRef}
            position={[0, DEMO_RACK_LOCAL_Y.nas, 0.26]}
            label="4-BAY NETWORK STORAGE"
            onSelect={handleProductSelect("nas")}
          />
          <RackStorageArrayModel
            position={[0, DEMO_RACK_LOCAL_Y.storageArray, 0.17]}
            label="12-BAY STORAGE ARRAY"
            interactive={false}
          />
          <UpsModel
            position={[0, DEMO_RACK_LOCAL_Y.ups, 0.18]}
            label="RACK UPS // 3KVA"
            interactive={false}
          />
        </DemoRackFrame>


      </group>

      <OperatorWorkstation
        ref={workstationRootRef}
        position={WORKSTATION_POSITION}
        scale={WORKSTATION_SCALE}
        equipmentRefs={equipmentRefs}
        interactive={focus === "workstation"}
        onSelect={handleWorkstationSelect}
        onEquipmentSelect={(equipment, event) => {
          event.stopPropagation();
          selectedOperatorEquipment.current = equipment;
          inspectProduct(EQUIPMENT_TO_PRODUCT[equipment]);
        }}
      />




    </group>
  );
}

export default function GamingCanvas({ active = true, onUnavailable }: { active?: boolean; onUnavailable?: () => void }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const overview = useSceneStore((state) => state.focus === "overview");

  return (
    <Canvas
      className={styles.canvas}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => {
        if (onUnavailable) gl.domElement.addEventListener("webglcontextlost", onUnavailable, { once: true });
      }}
      camera={{ position: [5.3, 3.05, 7.2], fov: 37, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      shadows
    >
      <color attach="background" args={["#101214"]} />
      <fog attach="fog" args={["#101214", 15, 32]} />
      <ambientLight intensity={0.65} />
      <hemisphereLight color="#f0f3ee" groundColor="#141714" intensity={0.9} />
      <directionalLight position={[2, 7, 5]} color="#fff9ef" intensity={4.2} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.001} />
      <directionalLight position={[-3, 3, -2]} color="#e4eae7" intensity={2} />
      <spotLight position={[6, 5, 1]} color="#ffffff" intensity={45} angle={0.7} penumbra={1} />
      <Environment resolution={256} frames={1} environmentIntensity={1.4}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={2} color="#e7ede8" position={[-5, 2, 3]} rotation={[0, Math.PI / 2, 0]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[5, 3, -4]} rotation={[0, Math.PI, 0]} scale={[2, 6, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <DataCenterSetup />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        enablePan={false}
        enableZoom={false}
        minDistance={overview ? 5 : 0}
        maxDistance={overview ? 13 : Infinity}
        minAzimuthAngle={overview ? 0.12 : -Infinity}
        maxAzimuthAngle={overview ? 0.65 : Infinity}
        minPolarAngle={overview ? 1.02 : 0}
        maxPolarAngle={overview ? 1.4 : Math.PI}
        target={[1.55, 1.48, -0.08]}
      />
      <CameraRig controlsRef={controlsRef} />
    </Canvas>
  );
}
