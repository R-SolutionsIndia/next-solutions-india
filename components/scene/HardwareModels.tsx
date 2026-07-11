"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from "three";
import type { ProductTarget } from "@/lib/scene-store";

type GroupProps = ThreeElements["group"];

const cyan = "#7fd7ff";
const graphite = "#171b20";
const edge = "#8b929a";

function ProductLabel({
  brand,
  model,
  detail,
  position,
  rotation = [0, 0, 0],
  size = [0.24, 0.11],
  accent = "#79d8ff",
  vertical = false,
}: {
  brand: string;
  model: string;
  detail: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  accent?: string;
  vertical?: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = vertical ? 320 : 768;
    canvas.height = vertical ? 768 : 320;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#0b0e11";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (vertical) {
      context.translate(0, 768);
      context.rotate(-Math.PI / 2);
    }
    context.fillStyle = accent;
    context.fillRect(0, 0, 24, 320);
    context.fillStyle = "#f7fbfd";
    context.font = "700 72px Arial";
    context.fillText(brand, 62, 108);
    context.fillStyle = "#b8c6cd";
    context.font = "600 38px Arial";
    context.fillText(model, 64, 178);
    context.fillStyle = "#71838c";
    context.font = "500 29px Arial";
    context.fillText(detail, 64, 242);
    context.strokeStyle = "#33434b";
    context.lineWidth = 3;
    context.strokeRect(40, 24, 700, 272);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.anisotropy = 4;
    return nextTexture;
  }, [accent, brand, detail, model, vertical]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Fan({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.015, 10, 28]} />
        <meshStandardMaterial color="#555d64" metalness={0.75} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.022, 20]} />
        <meshStandardMaterial color="#b6c0c7" metalness={0.82} roughness={0.2} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((blade) => (
        <mesh key={blade} rotation={[0, 0, (blade / 6) * Math.PI * 2]} position={[0, 0, 0.006]}>
          <boxGeometry args={[0.082, 0.025, 0.008]} />
          <meshStandardMaterial color="#30373d" metalness={0.45} roughness={0.34} />
        </mesh>
      ))}
      <pointLight color={cyan} intensity={0.18} distance={0.7} />
    </group>
  );
}

function GpuFan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.085, 0.013, 10, 28]} />
        <meshStandardMaterial color="#6f7a82" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.026, 18]} />
        <meshStandardMaterial color="#b7c2c8" metalness={0.82} roughness={0.18} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((blade) => (
        <mesh key={blade} rotation={[0, 0, (blade / 6) * Math.PI * 2]}>
          <boxGeometry args={[0.065, 0.02, 0.009]} />
          <meshStandardMaterial color="#293138" metalness={0.48} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

export function MonitorModel({ variant = 0, ...props }: GroupProps & { variant?: number }) {
  const accent = variant === 0 ? "#75d7ff" : "#bb86ff";
  return (
    <group {...props}>
      <RoundedBox args={[1.16, 0.68, 0.055]} radius={0.026} smoothness={4} castShadow>
        <meshStandardMaterial color="#24292f" metalness={0.72} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[1.09, 0.61]} />
        <meshStandardMaterial color="#071018" emissive="#0a2a3d" emissiveIntensity={0.75} roughness={0.18} />
      </mesh>
      <mesh position={[-0.36, 0.14, 0.036]}>
        <planeGeometry args={[0.25, 0.22]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.52} />
      </mesh>
      {[0, 1, 2, 3].map((row) => (
        <mesh key={row} position={[0.18, 0.21 - row * 0.095, 0.038]}>
          <planeGeometry args={[0.52 - row * 0.05, 0.022]} />
          <meshStandardMaterial color={row === 0 ? accent : "#45606c"} emissive={accent} emissiveIntensity={row === 0 ? 0.45 : 0.08} />
        </mesh>
      ))}
      <mesh position={[0.02, -0.18, 0.038]}>
        <planeGeometry args={[0.82, 0.12]} />
        <meshStandardMaterial color="#101e27" emissive="#164052" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, -0.47, -0.015]} castShadow>
        <boxGeometry args={[0.055, 0.28, 0.055]} />
        <meshStandardMaterial color="#555c63" metalness={0.88} roughness={0.18} />
      </mesh>
      <RoundedBox args={[0.43, 0.03, 0.25]} radius={0.018} smoothness={3} position={[0, -0.62, 0.04]} castShadow>
        <meshStandardMaterial color="#292f34" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <pointLight position={[0, 0, 0.3]} color={accent} intensity={0.28} distance={1.7} />
    </group>
  );
}

export function KeyboardModel(props: GroupProps) {
  const rows = [14, 14, 13, 12];
  return (
    <group {...props}>
      <RoundedBox args={[1.16, 0.065, 0.39]} radius={0.028} smoothness={4} castShadow>
        <meshStandardMaterial color="#23282d" metalness={0.58} roughness={0.3} />
      </RoundedBox>
      {rows.flatMap((count, row) =>
        Array.from({ length: count }, (_, column) => {
          const keyWidth = row === 3 && column === 5 ? 0.22 : 0.056;
          const x = -0.5 + column * 0.074 + (row === 3 && column > 5 ? 0.16 : 0);
          if (x > 0.52) return null;
          return (
            <RoundedBox
              key={`${row}-${column}`}
              args={[keyWidth, 0.024, 0.052]}
              radius={0.006}
              smoothness={2}
              position={[x, 0.045, -0.125 + row * 0.082]}
            >
              <meshStandardMaterial
                color={column % 5 === 0 ? "#53626b" : "#343a40"}
                emissive={column % 5 === 0 ? cyan : "#000000"}
                emissiveIntensity={column % 5 === 0 ? 0.28 : 0}
                roughness={0.34}
              />
            </RoundedBox>
          );
        }),
      )}
      <mesh position={[0, 0.07, 0.19]}>
        <boxGeometry args={[0.98, 0.008, 0.012]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export function MouseModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.2, 0.105, 0.3]} radius={0.085} smoothness={6} castShadow>
        <meshStandardMaterial color="#2a3035" metalness={0.44} roughness={0.26} />
      </RoundedBox>
      <mesh position={[-0.046, 0.058, -0.056]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.073, 0.012, 0.13]} />
        <meshStandardMaterial color="#454d54" metalness={0.42} roughness={0.28} />
      </mesh>
      <mesh position={[0.046, 0.058, -0.056]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.073, 0.012, 0.13]} />
        <meshStandardMaterial color="#454d54" metalness={0.42} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.071, -0.035]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.026, 16]} />
        <meshStandardMaterial color="#a8b5bd" metalness={0.8} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.025, 0.145]}>
        <boxGeometry args={[0.008, 0.012, 0.12]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function ExternalSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.32, 0.07, 0.24]} radius={0.03} smoothness={5} castShadow>
        <meshStandardMaterial color="#59626a" metalness={0.76} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, 0.12]} />
        <meshStandardMaterial color="#dce3e7" metalness={0.18} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.039, 0.022]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.13, 0.012]} />
        <meshStandardMaterial color="#34454f" />
      </mesh>
      <mesh position={[0.163, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.09, 0.022]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      <mesh position={[-0.14, 0.04, 0.09]}>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={1.2} />
      </mesh>
      <ProductLabel
        brand="SAMSUNG"
        model="PORTABLE SSD"
        detail="USB-C · 1 TB"
        position={[0, 0.041, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[0.23, 0.1]}
      />
    </group>
  );
}

export function MotherboardModel(props: GroupProps) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.68, 0.72, 0.025]} />
        <meshStandardMaterial color="#1e3935" metalness={0.28} roughness={0.48} />
      </mesh>
      {[[-0.25, 0.27], [0.26, 0.25], [-0.27, -0.24], [0.25, -0.26]].map(([x, y], index) => (
        <group key={index} position={[x, y, 0.018]}>
          <mesh>
            <boxGeometry args={[0.13, 0.1, 0.026]} />
            <meshStandardMaterial color={index % 2 ? "#a9b1b5" : "#59636b"} metalness={0.75} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.08, 0.05, 0.006]} />
            <meshStandardMaterial color="#11171a" />
          </mesh>
        </group>
      ))}
      {[-0.25, -0.12, 0.01, 0.14, 0.27].map((x) => (
        <mesh key={x} position={[x, -0.06, 0.022]}>
          <boxGeometry args={[0.085, 0.012, 0.01]} />
          <meshStandardMaterial color="#b7a56b" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function CpuCoolerModel(props: GroupProps) {
  return (
    <group {...props}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 28]} />
        <meshStandardMaterial color="#444d54" metalness={0.72} roughness={0.24} />
      </mesh>
      <Fan position={[0, 0.07, 0]} scale={1.18} />
      <mesh position={[0, 0.083, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.018, 20]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function RamModel(props: GroupProps) {
  return (
    <group {...props}>
      {[-0.07, 0.07].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.028, 0.31, 0.1]} />
            <meshStandardMaterial color="#4b555e" metalness={0.72} roughness={0.25} />
          </mesh>
          <mesh position={[0.015, 0.125, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.06, 0.035, 0.008]} />
            <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.72} />
          </mesh>
          {[-0.1, -0.035, 0.035, 0.1].map((y) => (
            <mesh key={y} position={[-0.016, y, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.07, 0.03, 0.008]} />
              <meshStandardMaterial color="#d1b16a" metalness={0.65} roughness={0.25} />
            </mesh>
          ))}
          <ProductLabel
            brand="CRUCIAL"
            model="DDR5"
            detail="16 GB · 5600"
            position={[0.015, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            size={[0.078, 0.22]}
            accent="#70a8ff"
            vertical
          />
        </group>
      ))}
    </group>
  );
}

export function GpuModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.72, 0.24, 0.16]} radius={0.035} smoothness={4} castShadow>
        <meshStandardMaterial color="#353c42" metalness={0.72} roughness={0.23} />
      </RoundedBox>
      {[-0.23, 0, 0.23].map((x) => (
        <GpuFan key={x} position={[x, 0, 0.09]} />
      ))}
      <mesh position={[0, 0.125, 0]}>
        <boxGeometry args={[0.56, 0.012, 0.08]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.62} />
      </mesh>
      <mesh position={[-0.32, -0.132, 0]}>
        <boxGeometry args={[0.42, 0.025, 0.08]} />
        <meshStandardMaterial color="#c5a968" metalness={0.65} roughness={0.24} />
      </mesh>
      <ProductLabel
        brand="ZOTAC GAMING"
        model="GEFORCE RTX"
        detail="12 GB · PCIe 4.0"
        position={[0, 0.105, 0.092]}
        size={[0.27, 0.085]}
        accent="#a98bff"
      />
    </group>
  );
}

export function PowerSupplyModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.55, 0.28, 0.42]} radius={0.025} smoothness={3} castShadow>
        <meshStandardMaterial color="#343a3f" metalness={0.82} roughness={0.28} />
      </RoundedBox>
      <Fan position={[0, 0.145, 0]} scale={1.15} />
      <mesh position={[0, 0.02, 0.212]}>
        <planeGeometry args={[0.34, 0.12]} />
        <meshStandardMaterial color="#d9d9d2" roughness={0.55} />
      </mesh>
      <ProductLabel
        brand="NEXT"
        model="750W PSU"
        detail="80 PLUS GOLD"
        position={[0.276, -0.03, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[0.25, 0.1]}
      />
    </group>
  );
}

export function HddModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.36, 0.055, 0.5]} radius={0.018} smoothness={3} castShadow>
        <meshStandardMaterial color="#7d858b" metalness={0.8} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.125, 32]} />
        <meshStandardMaterial color="#b7bec2" metalness={0.68} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial color="#4d555b" metalness={0.85} roughness={0.18} />
      </mesh>
      <ProductLabel
        brand="WD BLUE"
        model="HARD DRIVE"
        detail="2 TB · SATA"
        position={[0, 0.036, 0.16]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[0.27, 0.1]}
        accent="#4aa3ff"
      />
    </group>
  );
}

export function SataSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.35, 0.045, 0.25]} radius={0.018} smoothness={3} castShadow>
        <meshStandardMaterial color="#d8dde0" metalness={0.68} roughness={0.23} />
      </RoundedBox>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 0.15]} />
        <meshStandardMaterial color="#24323a" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.027, 0.025]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.13, 0.018]} />
        <meshStandardMaterial color={cyan} emissive={cyan} emissiveIntensity={0.25} />
      </mesh>
      <group position={[0.11, -0.004, -0.129]}>
        <mesh>
          <boxGeometry args={[0.075, 0.018, 0.018]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[0.09, 0.018, 0.018]} />
          <meshStandardMaterial color="#bda35c" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      {[[-0.145, -0.095], [0.145, -0.095], [-0.145, 0.095], [0.145, 0.095]].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, -0.024, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.005, 12]} />
          <meshStandardMaterial color="#42484c" metalness={0.75} />
        </mesh>
      ))}
      <ProductLabel
        brand="SAMSUNG"
        model="SATA SSD"
        detail="1 TB · 2.5 INCH"
        position={[0, 0.029, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[0.25, 0.13]}
      />
    </group>
  );
}

export function NvmeSSDModel(props: GroupProps) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.31, 0.012]} />
        <meshStandardMaterial color="#17473e" metalness={0.28} roughness={0.48} />
      </mesh>
      {[0.085, 0.015, -0.06].map((y) => (
        <mesh key={y} position={[0, y, 0.009]}>
          <boxGeometry args={[0.055, 0.045, 0.012]} />
          <meshStandardMaterial color="#151a1d" metalness={0.4} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0, -0.145, 0.01]}>
        <boxGeometry args={[0.062, 0.018, 0.008]} />
        <meshStandardMaterial color="#c8ad64" metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.145, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.008, 14]} />
        <meshStandardMaterial color="#aab2b6" metalness={0.8} roughness={0.2} />
      </mesh>
      <ProductLabel
        brand="WD_BLACK"
        model="NVMe SSD"
        detail="1 TB · PCIe 4.0"
        position={[0, 0.012, 0.017]}
        size={[0.065, 0.2]}
        accent="#f3f4f4"
      />
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
