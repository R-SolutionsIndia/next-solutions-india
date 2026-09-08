"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import { forwardRef, useMemo, type ReactNode, type Ref } from "react";
import { Euler, Quaternion, type Group, type Mesh } from "three";
import manifest from "./hardware-assets.json";
import { useSceneStore } from "@/lib/scene-store";

type Vec3 = [number, number, number];
type AssetId = keyof typeof manifest.assets;
type GroupProps = ThreeElements["group"];
export type ModelSelectHandler = (event: ThreeEvent<MouseEvent>) => void;
export type ComputeComponentId = "sata-ssd" | "nvme-ssd" | "ram" | "gpu" | "hdd";
export type OperatorEquipmentId = "primary-monitor" | "keyboard" | "mouse" | "external-ssd";
export type ComputeComponentRefs = Partial<Record<ComputeComponentId, Ref<Group>>>;
export type OperatorEquipmentRefs = Partial<Record<OperatorEquipmentId, Ref<Group>>>;
type Transform = { position: Vec3; rotation: Vec3; scale: number };

// One metre scale for every asset preserves the approved physical proportions.
const S = 2.15;
const RACK_BASE = -1.6;
export const DEMO_RACK_LOCAL_Y = {
  topServer: 1.22 * S + RACK_BASE,
  networkSwitch: 1.09 * S + RACK_BASE,
  nas: .785 * S + RACK_BASE,
  serviceTray: .6 * S + RACK_BASE,
  storageArray: .36 * S + RACK_BASE,
  ups: .12 * S + RACK_BASE,
};

function installedTransform(id: keyof typeof manifest.chassis): Transform {
  const installed = manifest.chassis[id];
  const tray = manifest.chassis["service-tray"].position;
  const rotation = new Euler().setFromQuaternion(new Quaternion(...installed.quaternion));
  return {
    position: installed.position.map((n, i) => (n - tray[i]) * S) as Vec3,
    rotation: [rotation.x, rotation.y, rotation.z],
    scale: 1,
  };
}

export const COMPUTE_TRAY_COMPONENT_TRANSFORMS: Record<ComputeComponentId, Transform> = {
  "sata-ssd": installedTransform("sata-ssd"),
  "nvme-ssd": installedTransform("nvme-ssd"),
  ram: installedTransform("ram"),
  gpu: installedTransform("gpu"),
  hdd: installedTransform("hdd"),
};

export const OPERATOR_EQUIPMENT_TRANSFORMS: Record<OperatorEquipmentId, Transform> = {
  "primary-monitor": { position: [0, 1.108 * S, -.11 * S], rotation: [0, 0, 0], scale: 1 },
  keyboard: { position: [-.03 * S, .758 * S, .17 * S], rotation: [0, 0, 0], scale: 1 },
  mouse: { position: [.25 * S, .758 * S, .18 * S], rotation: [0, 0, 0], scale: 1 },
  "external-ssd": { position: [.45 * S, .758 * S, .1 * S], rotation: [0, 0, 0], scale: 1 },
};

function HardwareAsset({ id, offset = [0, 0, 0], hideDoor = false }: {
  id: AssetId; offset?: Vec3; hideDoor?: boolean;
}) {
  // Meshopt is bundled locally; no external decoder or texture requests.
  const { scene } = useGLTF(manifest.assets[id].url, false, true);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if ((object as Mesh).isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
      if (hideDoor && object.name === "RACK_DOOR_HINGE") object.visible = false;
    });
    return clone;
  }, [scene, hideDoor]);
  return <group scale={S}><primitive object={model} position={offset} dispose={null} /></group>;
}

type SelectableProps = Omit<GroupProps, "onClick"> & { onSelect?: ModelSelectHandler };
function assetComponent(id: AssetId) {
  return forwardRef<Group, SelectableProps>(function BlenderModel({ onSelect, ...props }, ref) {
    return <group {...props} ref={ref} onClick={onSelect}><HardwareAsset id={id} /></group>;
  });
}
export const NasApplianceModel = assetComponent("nas");
export const NetworkSwitchModel = assetComponent("network-switch");
export const RackServerUnit = assetComponent("server");
export const RackStorageArrayModel = assetComponent("storage-array");
export const UpsModel = assetComponent("ups");

export function DemoRackFrame({ children, onSelect }: { children: ReactNode; onSelect?: ModelSelectHandler }) {
  return <group onClick={onSelect}>
    <group position={[0, RACK_BASE, 0]}><HardwareAsset id="rack" hideDoor /></group>
    {children}
  </group>;
}

export const ComputeServiceTray = forwardRef<Group, SelectableProps & {
  componentRefs: ComputeComponentRefs;
  interactive: boolean;
  onComponentSelect: (component: ComputeComponentId, event: ThreeEvent<MouseEvent>) => void;
}>(function ComputeServiceTray({ componentRefs, interactive, onComponentSelect, onSelect, ...props }, ref) {
  return <group {...props} ref={ref} onClick={onSelect}>
    <HardwareAsset id="service-tray" />
    {(["motherboard", "cpu-cooler", "power-supply"] as const).map(id => {
      const transform = installedTransform(id);
      return <group key={id} {...transform}><HardwareAsset id={id} /></group>;
    })}
    {(Object.keys(COMPUTE_TRAY_COMPONENT_TRANSFORMS) as ComputeComponentId[]).map(id => (
      <group key={id} ref={componentRefs[id]} {...COMPUTE_TRAY_COMPONENT_TRANSFORMS[id]}
        onClick={interactive ? event => onComponentSelect(id, event) : undefined}>
        <HardwareAsset id={id} />
      </group>
    ))}
  </group>;
});

export const OperatorWorkstation = forwardRef<Group, SelectableProps & {
  equipmentRefs: OperatorEquipmentRefs;
  interactive: boolean;
  onEquipmentSelect: (equipment: OperatorEquipmentId, event: ThreeEvent<MouseEvent>) => void;
}>(function OperatorWorkstation({ equipmentRefs, interactive, onEquipmentSelect, onSelect, ...props }, ref) {
  const focus = useSceneStore(state => state.focus);
  const inspecting = focus === "monitor" || focus === "keyboard" || focus === "mouse" || focus === "external-ssd";
  return <group {...props} ref={ref} onClick={onSelect}>
    <group visible={!inspecting}><HardwareAsset id="workstation-desk" /></group>
    {(Object.keys(OPERATOR_EQUIPMENT_TRANSFORMS) as OperatorEquipmentId[]).map(id => (
      <group key={id} ref={equipmentRefs[id]} {...OPERATOR_EQUIPMENT_TRANSFORMS[id]}
        visible={!inspecting || focus === (id === "primary-monitor" ? "monitor" : id)}
        onClick={interactive ? event => onEquipmentSelect(id, event) : undefined}>
        <HardwareAsset id={id === "primary-monitor" ? "monitor" : id}
          offset={id === "primary-monitor" ? [0, -.35, 0] : [0, 0, 0]} />
      </group>
    ))}
  </group>;
});

// Start every small, compressed request together instead of a Suspense waterfall.
for (const asset of Object.values(manifest.assets)) useGLTF.preload(asset.url, false, true);
