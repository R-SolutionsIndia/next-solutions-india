"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, LinearFilter, MathUtils, Path, Shape, SRGBColorSpace, type Group } from "three";
import type { ProductTarget } from "@/lib/scene-store";
import { AxialFan, Fasteners, HardwareLabel as ProductLabel, HardwareParts, type HardwarePart, type Vec3 } from "./HardwareDetails";

type GroupProps = ThreeElements["group"];
const cyan = "#a5cbb9";
const graphite = "#202424";
const edge = "#89918e";
const pcb = "#183d31";
const gold = "#b7a46b";

function Fan({ position = [0, 0, 0], scale = 1 }: { position?: Vec3; scale?: number }) {
  return <group position={position} scale={scale}><AxialFan radius={0.12} /></group>;
}

export function MonitorModel({ variant = 0, wide = false, ...props }: GroupProps & { variant?: number; wide?: boolean }) {
  const width = wide ? 1.68 : 1.16;
  const height = wide ? 0.82 : 0.68;
  const screenWidth = width - 0.048;
  const screenHeight = height - 0.067;
  const screenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = wide ? 920 : 1080;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const backdrop = context.createLinearGradient(0, 0, 1600, canvas.height);
    backdrop.addColorStop(0, "#191e20");
    backdrop.addColorStop(0.48, "#0d1113");
    backdrop.addColorStop(1, "#252c30");
    context.fillStyle = backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < 12; index += 1) {
      const offset = index * 135;
      const ribbon = context.createLinearGradient(600 + offset * 0.3, 0, 1350, canvas.height);
      ribbon.addColorStop(0, index % 3 === 0 ? "#4b555b" : "#343d42");
      ribbon.addColorStop(0.42, "#21292e");
      ribbon.addColorStop(1, "#0b1013");
      context.beginPath();
      context.moveTo(1550 + offset, -80);
      context.bezierCurveTo(1220 + offset * 0.78, 170, 610 + offset * 0.62, 600, 390 + offset * 0.57, canvas.height + 100);
      context.lineTo(450 + offset * 0.57, canvas.height + 100);
      context.bezierCurveTo(700 + offset * 0.62, 560, 1300 + offset * 0.78, 180, 1610 + offset, -80);
      context.closePath();
      context.fillStyle = ribbon;
      context.fill();
      context.strokeStyle = "rgba(178, 191, 196, 0.16)";
      context.lineWidth = 1.2;
      context.stroke();
    }
    context.fillStyle = "#e4e9e6";
    context.font = "400 34px Arial, sans-serif";
    context.fillText("NEXT", 98, 170);
    context.fillText("SOLUTIONS", 98, 213);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = 8;
    return texture;
  }, [wide]);
  useEffect(() => () => screenTexture?.dispose(), [screenTexture]);

  return (
    <group {...props}>
      <RoundedBox args={[width, height, 0.056]} radius={0.009} smoothness={3} castShadow>
        <meshStandardMaterial color={variant === 0 ? "#222627" : "#343939"} metalness={0.26} roughness={0.52} />
      </RoundedBox>
      <RoundedBox args={[width - 0.01, height - 0.01, 0.015]} radius={0.007} smoothness={2} position={[0, 0, 0.028]}>
        <meshStandardMaterial color="#111516" roughness={0.68} />
      </RoundedBox>
      <mesh position={[0, 0.009, 0.036]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial map={screenTexture} color={screenTexture ? "#c5ccc9" : "#151c20"} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.009, 0.037]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshPhysicalMaterial color="#d6dfdc" metalness={0} opacity={0.025} roughness={0.23} transparent />
      </mesh>
      <HardwareParts color="#b7c0bc" roughness={0.6} parts={Array.from({ length: 4 }, (_, index) => ({ position: [width / 2 - 0.075 - index * 0.023, -height / 2 + 0.018, 0.037] as Vec3, scale: [0.004, 0.002, 0.001] as Vec3 }))} />
      <mesh position={[width / 2 - 0.035, -height / 2 + 0.018, 0.037]}>
        <circleGeometry args={[0.0027, 10]} /><meshStandardMaterial color="#a8cf98" emissive="#a8cf98" emissiveIntensity={0.25} />
      </mesh>
      <RoundedBox args={[0.42, 0.27, 0.04]} radius={0.018} smoothness={3} position={[0, -0.05, -0.044]} castShadow>
        <meshStandardMaterial color="#272d2e" roughness={0.62} metalness={0.14} />
      </RoundedBox>
      <HardwareParts color="#0b0e0f" roughness={0.9} parts={Array.from({ length: 24 }, (_, index) => ({ position: [-0.175 + index * 0.0152, 0.095, -0.031] as Vec3, scale: [0.004, 0.046, 0.004] as Vec3 }))} />
      <HardwareParts color="#101414" roughness={0.75} parts={[{ position: [-0.14, -0.186, -0.05] as Vec3, scale: [0.034, 0.009, 0.018] as Vec3 }, { position: [-0.08, -0.186, -0.05] as Vec3, scale: [0.027, 0.009, 0.018] as Vec3 }]} />
      <group position={[0, -height / 2 - 0.183, -0.026]}>
        <RoundedBox args={[0.094, 0.355, 0.048]} radius={0.008} smoothness={3} castShadow>
          <meshStandardMaterial color="#717976" metalness={0.84} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[0.03, 0.128, 0.003]} radius={0.014} smoothness={4} position={[0, -0.015, 0.025]}>
          <meshStandardMaterial color="#111717" roughness={0.85} />
        </RoundedBox>
      </group>
      <mesh position={[0, -height / 2 + 0.062, -0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.036, 0.036, 0.17, 24]} /><meshStandardMaterial color="#4b5452" metalness={0.72} roughness={0.36} />
      </mesh>
      <RoundedBox args={[wide ? 0.49 : 0.43, 0.023, 0.28]} radius={0.012} smoothness={3} position={[0, -height / 2 - 0.376, 0.024]} castShadow>
        <meshStandardMaterial color="#4d5653" metalness={0.75} roughness={0.37} />
      </RoundedBox>
      <RoundedBox args={[wide ? 0.46 : 0.4, 0.007, 0.255]} radius={0.01} smoothness={2} position={[0, -height / 2 - 0.389, 0.024]}>
        <meshStandardMaterial color="#151a18" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

type KeySpec = { label: string; units: number; x: number; z: number };
const KEY_PITCH = 0.066;
const KEY_ROWS: Array<Array<string | [string, number]>> = [
  ["Esc", ["", 0.5], "F1", "F2", "F3", "F4", ["", 0.25], "F5", "F6", "F7", "F8", ["", 0.25], "F9", "F10", "F11", "F12", "Del"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", ["Backspace", 2], "Home"],
  [["Tab", 1.5], "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", ["\\", 1.5], "PgUp"],
  [["Caps", 1.75], "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", ["Enter", 2.25], "PgDn"],
  [["Shift", 2.25], "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", ["Shift", 1.75], "↑", "End"],
  [["Ctrl", 1.25], ["Win", 1.25], ["Alt", 1.25], ["", 6.25], "Alt", "Fn", "Ctrl", "←", "↓", "→"],
];
const KEY_LAYOUT: KeySpec[] = KEY_ROWS.flatMap((row, rowIndex) => {
  let cursor = -0.538;
  return row.map((value) => {
    const [label, units] = typeof value === "string" ? [value, 1] : value;
    const key = { label, units, x: cursor + units * KEY_PITCH / 2, z: -0.148 + rowIndex * 0.058 };
    cursor += units * KEY_PITCH;
    return key;
  }).filter((key) => key.label !== "" || key.units > 2);
});

export function KeyboardModel(props: GroupProps) {
  const legends = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 2320;
    canvas.height = 780;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#aab3ae";
    context.textAlign = "center";
    context.textBaseline = "middle";
    KEY_LAYOUT.forEach((key) => {
      context.font = `${key.label.length > 2 ? 15 : 22}px Arial, sans-serif`;
      context.fillText(key.label, (key.x / 1.16 + 0.5) * canvas.width, (key.z / 0.39 + 0.5) * canvas.height);
    });
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);
  useEffect(() => () => legends?.dispose(), [legends]);
  return (
    <group {...props}>
      <RoundedBox args={[1.16, 0.046, 0.39]} radius={0.012} smoothness={3} position={[0, -0.007, 0]} castShadow>
        <meshStandardMaterial color="#282e2c" metalness={0.38} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[1.139, 0.012, 0.368]} radius={0.008} smoothness={2} position={[0, 0.018, 0]}>
        <meshStandardMaterial color="#101513" roughness={0.85} />
      </RoundedBox>
      <HardwareParts rounded color="#333a36" roughness={0.64} parts={KEY_LAYOUT.map((key) => ({ position: [key.x, 0.038, key.z] as Vec3, scale: [key.units * KEY_PITCH - 0.009, 0.031, 0.047] as Vec3 }))} />
      <HardwareParts rounded color="#424a44" roughness={0.58} parts={KEY_LAYOUT.filter((key) => key.label === "Esc" || key.label === "Enter").map((key) => ({ position: [key.x, 0.039, key.z] as Vec3, scale: [key.units * KEY_PITCH - 0.009, 0.031, 0.047] as Vec3 }))} />
      <mesh position={[0, 0.0552, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.16, 0.39]} /><meshStandardMaterial map={legends} transparent depthWrite={false} roughness={0.8} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <HardwareParts color="#111714" roughness={0.9} parts={[-0.43, 0.43].map((x) => ({ position: [x, -0.033, -0.11] as Vec3, scale: [0.11, 0.015, 0.057] as Vec3 }))} />
      <mesh position={[0.536, 0.025, -0.176]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.0024, 10]} /><meshStandardMaterial color="#a3c28e" emissive="#a3c28e" emissiveIntensity={0.35} />
      </mesh>
      <RoundedBox args={[0.048, 0.012, 0.006]} radius={0.005} smoothness={2} position={[-0.395, -0.003, -0.198]}>
        <meshStandardMaterial color="#0b100d" metalness={0.5} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

export function MouseModel(props: GroupProps) {
  const shell = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0.166);
    shape.bezierCurveTo(-0.067, 0.166, -0.09, 0.115, -0.095, 0.037);
    shape.bezierCurveTo(-0.1, -0.062, -0.095, -0.155, 0, -0.168);
    shape.bezierCurveTo(0.092, -0.155, 0.1, -0.063, 0.095, 0.037);
    shape.bezierCurveTo(0.09, 0.115, 0.067, 0.166, 0, 0.166);
    return shape;
  }, []);
  return (
    <group {...props}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[shell, { depth: 0.035, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 24, steps: 1 }]} />
        <meshStandardMaterial color="#111714" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.047, 0.015]} scale={[0.103, 0.073, 0.158]} castShadow>
        <sphereGeometry args={[1, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d3530" metalness={0.05} roughness={0.63} />
      </mesh>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.076, 0.016, 0.118]} radius={0.012} smoothness={4} position={[side * 0.043, 0.099, -0.071]} rotation={[0.22, 0, side * -0.08]} castShadow>
          <meshStandardMaterial color="#303933" roughness={0.61} metalness={0.06} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.021, 0.004, 0.06]} radius={0.009} smoothness={3} position={[0, 0.107, -0.064]}>
        <meshStandardMaterial color="#090e0b" roughness={0.86} />
      </RoundedBox>
      <mesh position={[0, 0.113, -0.067]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.019, 0.019, 0.015, 28]} /><meshStandardMaterial color="#121813" roughness={0.95} />
      </mesh>
      <HardwareParts color="#464e47" metalness={0.25} roughness={0.58} parts={Array.from({ length: 13 }, (_, index) => ({ position: [0, 0.113 + Math.cos(index / 13 * Math.PI * 2) * 0.0192, -0.067 + Math.sin(index / 13 * Math.PI * 2) * 0.0192] as Vec3, scale: [0.014, 0.0012, 0.0025] as Vec3, rotation: [index / 13 * Math.PI * 2, 0, 0] as Vec3 }))} />
      <HardwareParts rounded color="#1b231d" roughness={0.78} parts={[{ position: [-0.098, 0.055, -0.012] as Vec3, scale: [0.008, 0.018, 0.038] as Vec3 }, { position: [-0.098, 0.055, 0.035] as Vec3, scale: [0.008, 0.018, 0.033] as Vec3 }]} />
      <HardwareParts color="#848f86" metalness={0.3} roughness={0.55} parts={[{ position: [-0.006, 0.116, 0.056] as Vec3, scale: [0.002, 0.001, 0.021] as Vec3 }, { position: [0.006, 0.116, 0.056] as Vec3, scale: [0.002, 0.001, 0.021] as Vec3 }, { position: [0, 0.116, 0.056] as Vec3, scale: [0.002, 0.001, 0.024] as Vec3, rotation: [0, -0.52, 0] as Vec3 }]} />
    </group>
  );
}

export function ExternalSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.32, 0.061, 0.22]} radius={0.018} smoothness={4} castShadow>
        <meshStandardMaterial color="#414b45" metalness={0.64} roughness={0.42} />
      </RoundedBox>
      <RoundedBox args={[0.316, 0.055, 0.218]} radius={0.017} smoothness={3} position={[0, -0.003, 0]}>
        <meshStandardMaterial color="#202922" roughness={0.82} />
      </RoundedBox>
      <HardwareParts rounded color="#3a453d" roughness={0.75} parts={Array.from({ length: 9 }, (_, index) => ({ position: [0, 0.028, -0.08 + index * 0.02] as Vec3, scale: [0.275, 0.007, 0.009] as Vec3 }))} />
      <RoundedBox args={[0.004, 0.022, 0.043]} radius={0.009} smoothness={3} position={[0.159, -0.002, 0]}>
        <meshStandardMaterial color="#979f98" metalness={0.86} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.005, 0.014, 0.033]} radius={0.006} smoothness={3} position={[0.162, -0.002, 0]}>
        <meshStandardMaterial color="#0b120c" roughness={0.85} />
      </RoundedBox>
      <mesh position={[0.163, -0.001, 0.062]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.002, 10]} /><meshStandardMaterial color="#b1cf9b" emissive="#b1cf9b" emissiveIntensity={0.4} />
      </mesh>
      <ProductLabel brand="SAMSUNG T7" model="SHIELD SSD" detail="1 TB · USB 3.2" position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[0.152, 0.067]} />
    </group>
  );
}

export function MotherboardModel(props: GroupProps) {
  const traces: HardwarePart[] = Array.from({ length: 13 }, (_, index) => ({ position: [-0.165 + index * 0.018, -0.1 - index * 0.009, 0.015] as Vec3, scale: [0.002, 0.21 + index * 0.015, 0.001] as Vec3 }));
  return (
    <group {...props}>
      <RoundedBox args={[0.68, 0.72, 0.012]} radius={0.006} smoothness={2} castShadow><meshStandardMaterial color={pcb} metalness={0.13} roughness={0.66} /></RoundedBox>
      <HardwareParts color="#3d6552" metalness={0.28} roughness={0.6} parts={traces} />
      <RoundedBox args={[0.22, 0.22, 0.018]} radius={0.008} smoothness={2} position={[-0.055, 0.095, 0.015]}><meshStandardMaterial color="#33383b" metalness={0.15} roughness={0.7} /></RoundedBox>
      <RoundedBox args={[0.157, 0.15, 0.016]} radius={0.005} smoothness={2} position={[-0.055, 0.095, 0.032]}><meshStandardMaterial color="#a2aaa3" metalness={0.88} roughness={0.32} /></RoundedBox>
      <HardwareParts color="#777f77" metalness={0.8} roughness={0.36} rounded parts={Array.from({ length: 13 }, (_, index) => ({ position: [-0.056 + index * 0.014, 0.28, 0.033] as Vec3, scale: [0.006, 0.095, 0.046] as Vec3 }))} />
      <HardwareParts color="#101c14" roughness={0.78} parts={[-0.22, -0.28].map((y) => ({ position: [-0.045, y, 0.02] as Vec3, scale: [0.39, 0.021, 0.033] as Vec3 })).concat([0.18, 0.226, 0.272].map((x) => ({ position: [x, 0.11, 0.02] as Vec3, scale: [0.017, 0.35, 0.028] as Vec3 })))} />
      <HardwareParts color="#858e86" metalness={0.78} roughness={0.36} cylindrical parts={Array.from({ length: 8 }, (_, index) => ({ position: [-0.205, -0.06 + index * 0.047, 0.029] as Vec3, scale: [0.018, 0.034, 0.018] as Vec3, rotation: [Math.PI / 2, 0, 0] as Vec3 }))} />
      <HardwareParts color="#a8afa9" metalness={0.82} roughness={0.35} parts={[-0.19, -0.035, 0.115, 0.255].map((y) => ({ position: [-0.294, y, 0.039] as Vec3, scale: [0.078, 0.103, 0.066] as Vec3 }))} />
      <HardwareParts color="#121e16" roughness={0.85} parts={[-0.19, -0.035, 0.115, 0.255].map((y) => ({ position: [-0.335, y, 0.04] as Vec3, scale: [0.005, 0.076, 0.038] as Vec3 }))} />
      <HardwareParts color="#242f26" roughness={0.72} parts={Array.from({ length: 14 }, (_, index) => ({ position: [0.08 + index % 4 * 0.053, -0.08 - Math.floor(index / 4) * 0.046, 0.013] as Vec3, scale: [0.028, 0.021, 0.012] as Vec3 }))} />
      <Fasteners radius={0.01} positions={[[-0.315, 0.334, 0.009], [0.315, 0.334, 0.009], [-0.315, -0.334, 0.009], [0.315, -0.334, 0.009], [0.05, -0.334, 0.009]]} />
    </group>
  );
}

export function CpuCoolerModel(props: GroupProps) {
  return (
    <group {...props}>
      <HardwareParts color="#8d968d" metalness={0.88} roughness={0.36} parts={Array.from({ length: 18 }, (_, index) => ({ position: [-0.134 + index * 0.0158, 0, 0] as Vec3, scale: [0.004, 0.104, 0.268] as Vec3 }))} />
      <RoundedBox args={[0.31, 0.018, 0.31]} radius={0.02} smoothness={3} position={[0, 0.057, 0]}><meshStandardMaterial color="#202a22" roughness={0.72} /></RoundedBox>
      <group position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}><AxialFan radius={0.14} /></group>
      <mesh position={[0, -0.062, 0]}><cylinderGeometry args={[0.061, 0.061, 0.012, 24]} /><meshStandardMaterial color="#947957" metalness={0.9} roughness={0.4} /></mesh>
    </group>
  );
}

export function RamModel(props: GroupProps) {
  return (
    <group {...props}>
      {[-0.07, 0.07].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <RoundedBox args={[0.007, 0.31, 0.074]} radius={0.002} smoothness={2} castShadow><meshStandardMaterial color={pcb} metalness={0.12} roughness={0.7} /></RoundedBox>
          <HardwareParts color="#17221a" roughness={0.75} parts={[-1, 1].flatMap((side) => Array.from({ length: 8 }, (_, index) => ({ position: [side * 0.007, -0.126 + index * 0.036, 0.004] as Vec3, scale: [0.009, 0.025, 0.038] as Vec3 })))} />
          <HardwareParts color={gold} metalness={0.82} roughness={0.38} parts={[-1, 1].flatMap((side) => Array.from({ length: 42 }, (_, index) => ({ position: [side * 0.004, -0.146 + index * 0.007, -0.0315] as Vec3, scale: [0.001, 0.004, 0.011] as Vec3 })).filter((_, index) => index !== 18 && index !== 19))} />
          <HardwareParts color="#758b76" roughness={0.65} parts={Array.from({ length: 7 }, (_, index) => ({ position: [0.004, -0.112 + index * 0.036, 0.028] as Vec3, scale: [0.004, 0.007, 0.005] as Vec3 }))} />
          <ProductLabel brand="CRUCIAL" model="DDR4 UDIMM" detail="16 GB · 2666" position={[0.012, 0.006, 0.006]} rotation={[0, Math.PI / 2, 0]} size={[0.044, 0.133]} vertical />
        </group>
      ))}
    </group>
  );
}

export function GpuModel(props: GroupProps) {
  const shroud = useMemo(() => {
    const outline = new Shape();
    outline.moveTo(-0.348, -0.12);
    outline.lineTo(0.348, -0.12);
    outline.quadraticCurveTo(0.36, -0.12, 0.36, -0.108);
    outline.lineTo(0.36, 0.108);
    outline.quadraticCurveTo(0.36, 0.12, 0.348, 0.12);
    outline.lineTo(-0.348, 0.12);
    outline.quadraticCurveTo(-0.36, 0.12, -0.36, 0.108);
    outline.lineTo(-0.36, -0.108);
    outline.quadraticCurveTo(-0.36, -0.12, -0.348, -0.12);
    for (const x of [-0.233, 0, 0.233]) {
      const opening = new Path();
      opening.absarc(x, 0, 0.101, 0, Math.PI * 2, true);
      outline.holes.push(opening);
    }
    return outline;
  }, []);
  return (
    <group {...props}>
      <RoundedBox args={[0.7, 0.214, 0.018]} radius={0.006} smoothness={2} position={[0, 0, -0.072]} castShadow><meshStandardMaterial color="#383e40" metalness={0.82} roughness={0.39} /></RoundedBox>
      <mesh position={[0, -0.022, -0.057]}><boxGeometry args={[0.665, 0.185, 0.006]} /><meshStandardMaterial color="#213e2b" roughness={0.7} /></mesh>
      <HardwareParts color="#899294" metalness={0.89} roughness={0.4} parts={Array.from({ length: 43 }, (_, index) => ({ position: [-0.315 + index * 0.015, 0, -0.006] as Vec3, scale: [0.003, 0.192, 0.093] as Vec3 }))} />
      <mesh position={[0, 0, 0.04]} castShadow>
        <extrudeGeometry args={[shroud, { depth: 0.045, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 24, steps: 1 }]} />
        <meshStandardMaterial color="#171c1f" metalness={0.22} roughness={0.62} />
      </mesh>
      {[-0.233, 0, 0.233].map((x) => <group key={x} position={[x, 0, 0.09]}><AxialFan radius={0.096} /></group>)}
      <HardwareParts color="#636b6e" metalness={0.72} roughness={0.43} parts={[{ position: [0, 0.107, 0.09] as Vec3, scale: [0.636, 0.01, 0.008] as Vec3 }, { position: [0, -0.107, 0.09] as Vec3, scale: [0.636, 0.01, 0.008] as Vec3 }]} />
      <mesh position={[-0.153, -0.126, -0.044]}><boxGeometry args={[0.326, 0.027, 0.006]} /><meshStandardMaterial color={pcb} roughness={0.7} /></mesh>
      <HardwareParts color={gold} metalness={0.85} roughness={0.34} parts={Array.from({ length: 39 }, (_, index) => ({ position: [-0.308 + index * 0.008, -0.128, -0.04] as Vec3, scale: [0.005, 0.022, 0.002] as Vec3 })).filter((_, index) => index !== 9 && index !== 10)} />
      <RoundedBox args={[0.016, 0.267, 0.166]} radius={0.003} smoothness={2} position={[-0.37, -0.003, 0]}><meshStandardMaterial color="#929b9e" metalness={0.9} roughness={0.35} /></RoundedBox>
      <HardwareParts color="#172017" metalness={0.12} roughness={0.8} parts={Array.from({ length: 9 }, (_, index) => ({ position: [-0.379, -0.075 + index * 0.019, 0.028] as Vec3, scale: [0.002, 0.007, 0.079] as Vec3 }))} />
      <HardwareParts color="#0e180f" roughness={0.8} parts={[-0.075, -0.005, 0.065].map((y) => ({ position: [-0.379, y, -0.042] as Vec3, scale: [0.002, 0.035, 0.025] as Vec3 }))} />
      <RoundedBox args={[0.072, 0.019, 0.036]} radius={0.004} smoothness={2} position={[0.21, 0.119, -0.035]}><meshStandardMaterial color="#0d180e" roughness={0.82} /></RoundedBox>
      <Fasteners radius={0.006} positions={[[-0.343, -0.102, 0.09], [0.343, -0.102, 0.09], [-0.343, 0.102, 0.09], [0.343, 0.102, 0.09]]} />
      <ProductLabel brand="ZOTAC GAMING" model="RTX 4070 SUPER" detail="12 GB · GDDR6X" position={[0.05, 0.121, -0.026]} rotation={[-Math.PI / 2, 0, 0]} size={[0.22, 0.055]} />
    </group>
  );
}

export function PowerSupplyModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.55, 0.28, 0.42]} radius={0.009} smoothness={2} castShadow><meshStandardMaterial color="#303638" metalness={0.5} roughness={0.56} /></RoundedBox>
      <group position={[0, 0.143, 0]} rotation={[-Math.PI / 2, 0, 0]}><AxialFan radius={0.16} /></group>
      <HardwareParts color="#657260" metalness={0.8} roughness={0.44} parts={Array.from({ length: 11 }, (_, index) => ({ position: [-0.151 + index * 0.0302, 0.165, 0] as Vec3, scale: [0.003, 0.002, Math.sqrt(Math.max(0, 0.027 - (-0.151 + index * 0.0302) ** 2)) * 2] as Vec3 }))} />
      <HardwareParts color="#111e12" roughness={0.9} parts={Array.from({ length: 18 }, (_, index) => ({ position: [-0.237 + index * 0.022, 0.037, 0.212] as Vec3, scale: [0.009, 0.112, 0.002] as Vec3 }))} />
      <RoundedBox args={[0.089, 0.06, 0.018]} radius={0.008} smoothness={2} position={[-0.165, -0.073, 0.216]}><meshStandardMaterial color="#0a150b" roughness={0.8} /></RoundedBox>
      <mesh position={[-0.058, -0.072, 0.217]}><boxGeometry args={[0.026, 0.042, 0.014]} /><meshStandardMaterial color="#172317" roughness={0.8} /></mesh>
      <Fasteners radius={0.007} positions={[[-0.252, -0.116, 0.212], [0.252, -0.116, 0.212], [-0.252, 0.116, 0.212], [0.252, 0.116, 0.212]]} />
      <ProductLabel brand="NEXT" model="750W PSU" detail="80 PLUS GOLD" position={[0.276, -0.012, 0]} rotation={[0, Math.PI / 2, 0]} size={[0.26, 0.13]} />
    </group>
  );
}

function SataConnector({ position = [0, 0, 0] }: { position?: Vec3 }) {
  return (
    <group position={position}>
      <HardwareParts color="#152117" roughness={0.8} parts={[{ position: [-0.045, 0, 0] as Vec3, scale: [0.116, 0.016, 0.023] as Vec3 }, { position: [0.058, 0, 0] as Vec3, scale: [0.064, 0.016, 0.023] as Vec3 }]} />
      <HardwareParts color={gold} metalness={0.8} roughness={0.36} parts={Array.from({ length: 15 }, (_, index) => ({ position: [-0.096 + index * 0.0069, 0.0085, -0.002] as Vec3, scale: [0.0032, 0.001, 0.012] as Vec3 })).concat(Array.from({ length: 7 }, (_, index) => ({ position: [0.035 + index * 0.007, 0.0085, -0.002] as Vec3, scale: [0.0032, 0.001, 0.012] as Vec3 })))} />
    </group>
  );
}

export function HddModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.36, 0.066, 0.5]} radius={0.007} smoothness={2} castShadow><meshStandardMaterial color="#303638" metalness={0.55} roughness={0.56} /></RoundedBox>
      <RoundedBox args={[0.355, 0.006, 0.489]} radius={0.01} smoothness={3} position={[0, 0.035, 0]}><meshStandardMaterial color="#b1b8bc" metalness={0.86} roughness={0.32} /></RoundedBox>
      <mesh position={[0, 0.039, -0.032]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.127, 0.13, 48]} /><meshStandardMaterial color="#81898c" metalness={0.88} roughness={0.4} /></mesh>
      <mesh position={[0, 0.039, -0.032]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.025, 24]} /><meshStandardMaterial color="#98a1a5" metalness={0.83} roughness={0.4} /></mesh>
      <HardwareParts rounded color="#8b969b" metalness={0.88} roughness={0.35} parts={[-1, 1].map((side) => ({ position: [side * 0.147, 0.039, -0.027] as Vec3, scale: [0.004, 0.002, 0.32] as Vec3 }))} />
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.041, 0]}><Fasteners radius={0.008} positions={[[-0.153, -0.217, 0], [0.153, -0.217, 0], [-0.153, 0.217, 0], [0.153, 0.217, 0], [-0.153, 0, 0], [0.153, 0, 0]]} /></group>
      <mesh position={[0.022, -0.035, 0.105]}><boxGeometry args={[0.268, 0.005, 0.235]} /><meshStandardMaterial color={pcb} roughness={0.7} /></mesh>
      <SataConnector position={[0.046, -0.018, -0.253]} />
      <ProductLabel brand="WD BLUE" model="DESKTOP HARD DRIVE" detail="2 TB · SATA 6 Gb/s" position={[0, 0.041, 0.104]} rotation={[-Math.PI / 2, 0, 0]} size={[0.266, 0.173]} accent="#667e83" />
    </group>
  );
}

export function SataSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.35, 0.032, 0.25]} radius={0.006} smoothness={2} castShadow><meshStandardMaterial color="#4b5357" metalness={0.76} roughness={0.43} /></RoundedBox>
      <RoundedBox args={[0.35, 0.002, 0.25]} radius={0.006} smoothness={2} position={[0, -0.007, 0]}><meshStandardMaterial color="#232b2f" metalness={0.6} roughness={0.6} /></RoundedBox>
      <SataConnector position={[0.037, -0.004, -0.129]} />
      <ProductLabel brand="WD BLUE" model="SA510 SATA SSD" detail="1 TB · 2.5 INCH" position={[0, 0.017, 0.006]} rotation={[-Math.PI / 2, 0, 0]} size={[0.268, 0.168]} accent="#718886" />
      <group position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}><Fasteners radius={0.0055} positions={[[-0.157, -0.105, 0], [0.157, -0.105, 0], [-0.157, 0.105, 0], [0.157, 0.105, 0]]} /></group>
    </group>
  );
}

export function NvmeSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.081, 0.31, 0.005]} radius={0.003} smoothness={2} castShadow><meshStandardMaterial color={pcb} metalness={0.1} roughness={0.7} /></RoundedBox>
      <HardwareParts color="#18271a" roughness={0.74} rounded parts={[{ position: [0, 0.079, 0.008] as Vec3, scale: [0.058, 0.061, 0.01] as Vec3 }, { position: [0, -0.007, 0.008] as Vec3, scale: [0.058, 0.061, 0.01] as Vec3 }, { position: [0, -0.076, 0.007] as Vec3, scale: [0.039, 0.039, 0.008] as Vec3 }]} />
      <HardwareParts color="#a2b299" metalness={0.62} roughness={0.45} parts={[-1, 1].flatMap((side) => Array.from({ length: 13 }, (_, index) => ({ position: [side * 0.034, -0.107 + index * 0.017, 0.004] as Vec3, scale: [0.005, 0.006, 0.004] as Vec3 })))} />
      <HardwareParts color={gold} metalness={0.8} roughness={0.34} parts={Array.from({ length: 18 }, (_, index) => ({ position: [-0.033 + index * 0.0039, -0.146, 0.003] as Vec3, scale: [0.0023, 0.018, 0.001] as Vec3 })).filter((_, index) => index !== 13 && index !== 14)} />
      <mesh position={[0, 0.147, 0.003]}><ringGeometry args={[0.008, 0.012, 20]} /><meshStandardMaterial color="#b4bfaa" metalness={0.86} roughness={0.35} /></mesh>
      <mesh position={[0, 0.147, 0.0035]}><circleGeometry args={[0.0078, 20]} /><meshStandardMaterial color="#0a180b" roughness={0.86} /></mesh>
      <ProductLabel brand="WD_BLACK" model="SN770 NVMe" detail="1 TB · PCIe 4.0" position={[0, 0.032, 0.014]} size={[0.063, 0.171]} accent="#333f33" vertical />
    </group>
  );
}

export type TowerInternalsProps = GroupProps & {
  onSelect?: (target: ProductTarget) => void;
  activeProduct?: ProductTarget | null;
  ssdExtract?: number;
  reducedMotion?: boolean;
};

export function TowerInternalsModel({
  onSelect,
  activeProduct = null,
  ssdExtract = 0,
  reducedMotion = false,
  ...props
}: TowerInternalsProps) {
  const ssdGroup = useRef<Group>(null);
  const nvmeGroup = useRef<Group>(null);
  const ramGroup = useRef<Group>(null);
  const gpuGroup = useRef<Group>(null);
  const hddGroup = useRef<Group>(null);
  const extractProgress = useRef({
    sata: ssdExtract,
    nvme: 0,
    ram: 0,
    gpu: 0,
    hdd: 0,
  });

  useFrame((_, delta) => {
    const targets = {
      sata: activeProduct === "sata-ssd" || ssdExtract > 0 ? 1 : 0,
      nvme: activeProduct === "nvme-ssd" ? 1 : 0,
      ram: activeProduct === "ram" ? 1 : 0,
      gpu: activeProduct === "gpu" ? 1 : 0,
      hdd: activeProduct === "hdd" ? 1 : 0,
    };
    const progress = extractProgress.current;

    for (const key of Object.keys(targets) as Array<keyof typeof targets>) {
      progress[key] = reducedMotion
        ? targets[key]
        : MathUtils.damp(progress[key], targets[key], 4.8, delta);
    }

    const motionStages = (value: number) => ({
      clear: MathUtils.smoothstep(value, 0, 0.58),
      present: MathUtils.smoothstep(value, 0.58, 1),
    });

    if (ssdGroup.current) {
      const value = progress.sata;
      const { clear, present } = motionStages(value);
      ssdGroup.current.position.set(
        -0.08 + clear * 0.83 + present * 0.2,
        0.18 + present * 0.07,
        0.29 + present * 0.12,
      );
      ssdGroup.current.rotation.set(
        present * -0.08,
        present * -0.28,
        -Math.PI / 2 + present * 0.08,
      );
      ssdGroup.current.scale.setScalar(0.8 + present * 0.38);
    }

    if (nvmeGroup.current) {
      const value = progress.nvme;
      const { clear, present } = motionStages(value);
      nvmeGroup.current.position.set(
        -0.19 + clear * 0.94 + present * 0.22,
        0.12 + present * 0.12,
        -0.08 + present * 0.18,
      );
      nvmeGroup.current.rotation.set(
        present * -0.08,
        Math.PI / 2 - present * 0.32,
        present * 0.08,
      );
      nvmeGroup.current.scale.setScalar(1 + present * 1.2);
    }

    if (ramGroup.current) {
      const value = progress.ram;
      const { clear, present } = motionStages(value);
      ramGroup.current.position.set(
        -0.18 + clear * 0.92 + present * 0.2,
        0.4 + present * 0.08,
        0.02 + present * 0.12,
      );
      ramGroup.current.rotation.set(present * -0.08, present * -0.25, present * 0.05);
      ramGroup.current.scale.setScalar(1 + present * 0.5);
    }

    if (gpuGroup.current) {
      const value = progress.gpu;
      const { clear, present } = motionStages(value);
      gpuGroup.current.position.set(
        -0.14 + clear * 0.8 + present * 0.09,
        -0.1 + present * 0.1,
        -0.1 + present * 0.12,
      );
      gpuGroup.current.rotation.set(
        present * -0.05,
        present * -0.2,
        present * 0.04,
      );
      gpuGroup.current.scale.setScalar(1 + present * 0.2);
    }

    if (hddGroup.current) {
      const value = progress.hdd;
      const { clear, present } = motionStages(value);
      hddGroup.current.position.set(
        -0.12 + clear * 0.88 + present * 0.18,
        -0.34 + present * 0.1,
        0.25 + present * 0.14,
      );
      hddGroup.current.rotation.set(
        present * -0.08,
        present * -0.24,
        -Math.PI / 2 + present * 0.08,
      );
      hddGroup.current.scale.setScalar(0.65 + present * 0.35);
    }
  });

  return (
    <group {...props}>
      <MotherboardModel position={[-0.29, 0.2, -0.13]} rotation={[0, Math.PI / 2, 0]} />
      <ProductLabel
        brand="NEXT"
        model="B760 MAINBOARD"
        detail="PCIe 4.0 · DDR5"
        position={[-0.275, 0.49, -0.16]}
        rotation={[0, Math.PI / 2, 0]}
        size={[0.25, 0.085]}
      />
      <group position={[-0.09, -0.35, 0.27]}>
        {[-0.13, 0.13].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.48, 0.025, 0.38]} />
            <meshStandardMaterial color="#343b40" metalness={0.78} roughness={0.27} />
          </mesh>
        ))}
        <mesh position={[-0.22, 0, 0.17]}>
          <boxGeometry args={[0.025, 0.28, 0.025]} />
          <meshStandardMaterial color="#505a62" metalness={0.8} roughness={0.22} />
        </mesh>
      </group>
      <group
        ref={nvmeGroup}
        position={[-0.19, 0.12, -0.08]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={() => onSelect?.("nvme-ssd")}
      >
        <NvmeSSDModel />
      </group>
      <group
        ref={ramGroup}
        position={[-0.18, 0.4, 0.02]}
        onClick={() => onSelect?.("ram")}
      >
        <RamModel />
      </group>
      <CpuCoolerModel position={[-0.17, 0.35, -0.26]} rotation={[0, 0, Math.PI / 2]} />
      <group
        ref={gpuGroup}
        position={[-0.14, -0.1, -0.1]}
        onClick={() => onSelect?.("gpu")}
      >
        <GpuModel rotation={[0, Math.PI / 2, 0]} />
      </group>
      <PowerSupplyModel position={[-0.09, -0.48, -0.12]} scale={0.92} />
      <group
        ref={hddGroup}
        position={[-0.12, -0.34, 0.25]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.65}
        onClick={() => onSelect?.("hdd")}
      >
        <HddModel />
      </group>
      <group
        ref={ssdGroup}
        position={[-0.08, 0.18, 0.29]}
        rotation={[0, 0, -Math.PI / 2]}
        onClick={() => onSelect?.("sata-ssd")}
      >
        <SataSSDModel />
      </group>
    </group>
  );
}

export type TowerCaseProps = GroupProps & {
  panelOpen?: number;
  reducedMotion?: boolean;
};

export function TowerCaseModel({ panelOpen = 0, reducedMotion = false, ...props }: TowerCaseProps) {
  const panelGroup = useRef<Group>(null);
  const openProgress = useRef(panelOpen);

  useFrame((_, delta) => {
    const group = panelGroup.current;
    if (!group) return;

    openProgress.current = reducedMotion
      ? panelOpen
      : MathUtils.damp(openProgress.current, panelOpen, 4.3, delta);
    const progress = openProgress.current;
    group.position.set(0.405 + progress * 0.15, progress * 0.04, progress * 0.85);
    group.rotation.set(0, progress * -0.22, progress * -0.08);
  });

  return (
    <group {...props}>
      <mesh position={[-0.39, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 1.38, 0.82]} />
        <meshStandardMaterial color="#252b30" metalness={0.78} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.39]} castShadow>
        <boxGeometry args={[0.78, 1.38, 0.05]} />
        <meshStandardMaterial color="#20262b" metalness={0.72} roughness={0.28} />
      </mesh>
      {[-0.665, 0.665].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.05, 0.82]} />
          <meshStandardMaterial color="#30373d" metalness={0.8} roughness={0.24} />
        </mesh>
      ))}
      {[-0.36, 0.36].map((z) => (
        <mesh key={z} position={[0.37, 0, z]} castShadow>
          <boxGeometry args={[0.045, 1.38, 0.055]} />
          <meshStandardMaterial color="#5a646c" metalness={0.82} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.395]}>
        <boxGeometry args={[0.7, 1.28, 0.025]} />
        <meshPhysicalMaterial color="#25323a" transparent opacity={0.17} metalness={0.28} roughness={0.16} />
      </mesh>
      <group ref={panelGroup} position={[0.405, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.018, 1.27, 0.72]} />
          <meshPhysicalMaterial
            color="#7b9cab"
            transparent
            opacity={0.16 + (1 - panelOpen) * 0.12}
            transmission={0.15}
            metalness={0.2}
            roughness={0.08}
          />
        </mesh>
        <mesh position={[0.012, 0, 0]}>
          <boxGeometry args={[0.012, 1.28, 0.018]} />
          <meshStandardMaterial color={edge} metalness={0.78} roughness={0.2} />
        </mesh>
      </group>
      {panelOpen < 0.5
        ? [-0.4, 0, 0.4].map((y) => (
            <Fan key={y} position={[0, y, 0.414]} scale={0.86} />
          ))
        : null}
      <mesh position={[0, 0.7, -0.16]}>
        <boxGeometry args={[0.46, 0.012, 0.32]} />
        <meshStandardMaterial color="#586169" metalness={0.72} roughness={0.24} />
      </mesh>
      <ProductLabel
        brand="NEXT"
        model="GAMING SERIES"
        detail="AIRFLOW CHASSIS"
        position={[0.394, 0.55, -0.08]}
        rotation={[0, Math.PI / 2, 0]}
        size={[0.2, 0.065]}
      />
    </group>
  );
}

export { cyan as hardwareAccent, graphite as hardwareGraphite };
