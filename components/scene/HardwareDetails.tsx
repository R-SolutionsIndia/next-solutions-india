"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  ExtrudeGeometry,
  LinearFilter,
  Object3D,
  Shape,
  SRGBColorSpace,
  type InstancedMesh,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Vec3 = [number, number, number];
export type HardwarePart = { position: Vec3; scale: Vec3; rotation?: Vec3 };

/** Repeated manufactured details share one geometry, material and draw call. */
export function HardwareParts({
  parts,
  color,
  metalness = 0,
  roughness = 0.65,
  rounded = false,
  cylindrical = false,
}: {
  parts: HardwarePart[];
  color: string;
  metalness?: number;
  roughness?: number;
  rounded?: boolean;
  cylindrical?: boolean;
}) {
  const instance = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => cylindrical
    ? new CylinderGeometry(0.5, 0.5, 1, 12)
    : rounded
      ? new RoundedBoxGeometry(1, 1, 1, 2, 0.08)
      : new BoxGeometry(1, 1, 1), [cylindrical, rounded]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => {
    if (!instance.current) return;
    const transform = new Object3D();
    parts.forEach((part, index) => {
      transform.position.set(...part.position);
      transform.scale.set(...part.scale);
      transform.rotation.set(...(part.rotation ?? [0, 0, 0]));
      transform.updateMatrix();
      instance.current!.setMatrixAt(index, transform.matrix);
    });
    instance.current.instanceMatrix.needsUpdate = true;
    instance.current.computeBoundingSphere();
  }, [parts]);

  return (
    <instancedMesh ref={instance} args={[geometry, undefined, parts.length]} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </instancedMesh>
  );
}

/** Screw axes face +Z. Rotate the whole set for a top or side panel. */
export function Fasteners({ positions, radius = 0.009 }: { positions: Vec3[]; radius?: number }) {
  return (
    <group>
      <HardwareParts color="#8b9091" metalness={0.86} roughness={0.35} cylindrical
        parts={positions.map((position) => ({ position, scale: [radius * 2, radius * 0.45, radius * 2], rotation: [Math.PI / 2, 0, 0] }))} />
      <HardwareParts color="#242829" roughness={0.8}
        parts={positions.map(([x, y, z]) => ({ position: [x, y, z + radius * 0.24], scale: [radius * 1.1, radius * 0.22, radius * 0.1], rotation: [0, 0, Math.PI / 4] }))} />
    </group>
  );
}

export function HardwareLabel({
  brand,
  model,
  detail,
  position,
  rotation = [0, 0, 0],
  size = [0.24, 0.11],
  accent = "#525b58",
  vertical = false,
}: {
  brand: string;
  model: string;
  detail: string;
  position: Vec3;
  rotation?: Vec3;
  size?: [number, number];
  accent?: string;
  vertical?: boolean;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = vertical ? 320 : 768;
    canvas.height = vertical ? 768 : 320;
    const context = canvas.getContext("2d");
    if (!context) return null;
    if (vertical) {
      context.translate(0, 768);
      context.rotate(-Math.PI / 2);
    }
    context.fillStyle = "#e0e2df";
    context.fillRect(0, 0, 768, 320);
    context.fillStyle = accent;
    context.fillRect(0, 0, 768, 9);
    context.fillStyle = "#252927";
    context.font = "700 49px Arial, sans-serif";
    context.fillText(brand, 35, 78, 688);
    context.font = "500 30px Arial, sans-serif";
    context.fillText(model, 36, 125, 680);
    context.font = "400 24px Arial, sans-serif";
    context.fillText(detail, 36, 165, 680);
    // A compact identification pattern reads as a real product sticker at hero distance.
    for (let bar = 0; bar < 78; bar += 1) {
      context.fillRect(36 + bar * 6, 208, bar % 3 === 0 ? 3 : 1.5, 46);
    }
    context.font = "400 17px Arial, sans-serif";
    context.fillText("COMPONENT IDENTIFICATION", 36, 285);
    context.strokeStyle = "#a2aaa4";
    context.strokeRect(620, 214, 100, 39);
    context.font = "500 17px Arial, sans-serif";
    context.fillText("RoHS", 643, 240);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.anisotropy = 4;
    return result;
  }, [accent, brand, detail, model, vertical]);
  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={texture} metalness={0} roughness={0.8} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}

/** Curved impeller blades, recessed into a matte black fan housing. Faces +Z. */
export function AxialFan({ radius = 0.1 }: { radius?: number }) {
  const blade = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.2, -0.07);
    shape.bezierCurveTo(0.43, -0.35, 0.78, -0.37, 0.91, -0.16);
    shape.bezierCurveTo(0.8, -0.02, 0.6, 0.12, 0.31, 0.19);
    shape.quadraticCurveTo(0.16, 0.16, 0.2, -0.07);
    const result = new ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1, curveSegments: 8, steps: 1 });
    result.scale(radius, radius, radius);
    return result;
  }, [radius]);
  useEffect(() => () => blade.dispose(), [blade]);

  const blades = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!blades.current) return;
    const transform = new Object3D();
    for (let index = 0; index < 9; index += 1) {
      transform.rotation.z = index * Math.PI * 2 / 9;
      transform.updateMatrix();
      blades.current.setMatrixAt(index, transform.matrix);
    }
    blades.current.instanceMatrix.needsUpdate = true;
    blades.current.computeBoundingSphere();
  }, [blade]);

  return (
    <group>
      <mesh position={[0, 0, -radius * 0.04]}>
        <circleGeometry args={[radius, 40]} />
        <meshStandardMaterial color="#0b0d0e" roughness={0.9} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.96, radius * 0.05, 8, 40]} />
        <meshStandardMaterial color="#34383a" metalness={0.18} roughness={0.6} />
      </mesh>
      <instancedMesh ref={blades} args={[blade, undefined, 9]}>
        <meshStandardMaterial color="#101416" metalness={0.02} roughness={0.82} />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, radius * 0.045]}>
        <cylinderGeometry args={[radius * 0.2, radius * 0.23, radius * 0.12, 24]} />
        <meshStandardMaterial color="#3f4547" metalness={0.24} roughness={0.52} />
      </mesh>
      <mesh position={[0, 0, radius * 0.109]}>
        <circleGeometry args={[radius * 0.09, 20]} />
        <meshStandardMaterial color="#b6bcba" metalness={0.5} roughness={0.42} />
      </mesh>
    </group>
  );
}
