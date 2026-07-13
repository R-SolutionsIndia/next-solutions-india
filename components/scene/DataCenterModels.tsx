"use client";

import { RoundedBox } from "@react-three/drei";
import { type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import {
  CatmullRomCurve3,
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  Matrix4,
  SRGBColorSpace,
  Vector3,
  type Group,
  type InstancedMesh,
} from "three";

import {
  ExternalSSDModel,
  GpuModel,
  HddModel,
  KeyboardModel,
  MonitorModel,
  MotherboardModel,
  MouseModel,
  NvmeSSDModel,
  RamModel,
  SataSSDModel,
} from "./HardwareModels";

export const DATA_CENTER_PALETTE = {
  black: "#050709",
  ink: "#0a0d10",
  graphite: "#1b2025",
  graphiteLight: "#303840",
  coolWhite: "#eef8fc",
  mutedWhite: "#9fb0b9",
  cyan: "#72d8ff",
} as const;

export type SceneVector3 = [number, number, number];
type Vec3 = SceneVector3;
type GroupProps = ThreeElements["group"];

export type SceneModelTransform = {
  position: SceneVector3;
  rotation: SceneVector3;
  scale: number;
};

export type DataCenterModelGroupProps = Omit<
  GroupProps,
  | "onClick"
  | "onContextMenu"
  | "onDoubleClick"
  | "onPointerDown"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onPointerMove"
  | "onPointerOver"
  | "onPointerOut"
  | "onPointerUp"
>;

export type ModelSelectHandler = (event: ThreeEvent<MouseEvent>) => void;

export const DEMO_RACK_LOCAL_Y = {
  blankPanel: 1.35,
  topServer: 1.1,
  networkSwitch: 0.79,
  nas: 0.39,
  serviceTray: -0.23,
  storageArray: -0.72,
  ups: -1.19,
} as const;

export const DEMO_RACK_DIMENSIONS: SceneVector3 = [1.42, 3.18, 1.38];
export const COMPUTE_SERVICE_TRAY_DIMENSIONS: SceneVector3 = [1.08, 0.27, 1.18];
export const OPERATOR_WORKSTATION_DIMENSIONS: SceneVector3 = [2.76, 1.92, 1.18];

type EquipmentLabelProps = {
  title: string;
  subtitle?: string;
  position: Vec3;
  rotation?: Vec3;
  size?: [number, number];
  align?: "left" | "center";
};

const FLOOR_X_LINES = Array.from({ length: 15 }, (_, index) => -4.2 + index * 0.6);
const FLOOR_Z_LINES = Array.from({ length: 12 }, (_, index) => -4.5 + index * 0.6);
const RACK_UNIT_MARKERS = Array.from({ length: 32 }, (_, index) => -1.42 + index * 0.0915);
const CABLE_FINGERS = Array.from({ length: 14 }, (_, index) => -0.88 + index * 0.135);
const AMBIENT_SERVER_ROWS = Array.from({ length: 16 }, (_, index) => -0.83 + index * 0.11);

function fitText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startingSize: number,
  minimumSize: number,
) {
  let size = startingSize;
  do {
    context.font = `700 ${size}px Arial, sans-serif`;
    if (context.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size > minimumSize);
  return minimumSize;
}

function EquipmentLabel({
  title,
  subtitle = "NEXT SOLUTIONS",
  position,
  rotation = [0, 0, 0],
  size = [0.34, 0.085],
  align = "left",
}: EquipmentLabelProps) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = DATA_CENTER_PALETTE.ink;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = DATA_CENTER_PALETTE.cyan;
    context.fillRect(0, 0, 20, canvas.height);
    context.strokeStyle = DATA_CENTER_PALETTE.graphiteLight;
    context.lineWidth = 4;
    context.strokeRect(32, 22, 970, 212);

    const titleSize = fitText(context, title, 850, 86, 48);
    context.font = `700 ${titleSize}px Arial, sans-serif`;
    context.fillStyle = DATA_CENTER_PALETTE.coolWhite;
    context.textAlign = align;
    const x = align === "center" ? canvas.width / 2 : 74;
    context.fillText(title, x, 118);

    context.font = "600 38px Arial, sans-serif";
    context.fillStyle = DATA_CENTER_PALETTE.mutedWhite;
    context.letterSpacing = "3px";
    context.fillText(subtitle, x, 186);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    nextTexture.anisotropy = 8;
    return nextTexture;
  }, [align, subtitle, title]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        polygonOffset
        polygonOffsetFactor={-2}
        toneMapped={false}
      />
    </mesh>
  );
}

type InteractiveHitboxProps = {
  size: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  onSelect?: ModelSelectHandler;
  disabled?: boolean;
};

function InteractiveHitbox({
  size,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onSelect,
  disabled = false,
}: InteractiveHitboxProps) {
  const enabled = Boolean(onSelect) && !disabled;

  useEffect(() => () => {
    if (typeof document !== "undefined") document.body.style.cursor = "";
  }, []);

  if (!enabled) return null;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(event);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (typeof document !== "undefined") document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          if (typeof document !== "undefined") document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={DATA_CENTER_PALETTE.cyan}
          colorWrite={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}

function StatusLed({
  position,
  active = true,
  radius = 0.009,
}: {
  position: Vec3;
  active?: boolean;
  radius?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial
        color={active ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.graphiteLight}
        emissive={active ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.black}
        emissiveIntensity={active ? 1.35 : 0}
        roughness={0.35}
      />
    </mesh>
  );
}

function VentBank({
  position,
  columns = 8,
  spacing = 0.025,
  slotSize = [0.014, 0.034, 0.008],
}: {
  position: Vec3;
  columns?: number;
  spacing?: number;
  slotSize?: Vec3;
}) {
  return (
    <group position={position}>
      {Array.from({ length: columns }, (_, index) => (
        <mesh key={index} position={[(index - (columns - 1) / 2) * spacing, 0, 0]}>
          <boxGeometry args={slotSize} />
          <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.84} />
        </mesh>
      ))}
    </group>
  );
}

function PerforationGrid({
  position,
  columns,
  rows,
  spacingX,
  spacingY,
  radius = 0.014,
  color = DATA_CENTER_PALETTE.black,
}: {
  position: Vec3;
  columns: number;
  rows: number;
  spacingX: number;
  spacingY: number;
  radius?: number;
  color?: string;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const matrix = new Matrix4();
    let instance = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        matrix.makeTranslation(
          (column - (columns - 1) / 2) * spacingX,
          (row - (rows - 1) / 2) * spacingY,
          0,
        );
        mesh.setMatrixAt(instance, matrix);
        instance += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [columns, rows, spacingX, spacingY]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, columns * rows]} position={position}>
      <circleGeometry args={[radius, 8]} />
      <meshBasicMaterial
        color={color}
        side={DoubleSide}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function AmbientRack({
  position,
  rotation = [0, 0, 0],
}: {
  position: Vec3;
  rotation?: Vec3;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.78, 2.18, 0.94]} />
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.ink}
          metalness={0.48}
          roughness={0.58}
        />
      </mesh>
      <mesh position={[0, 0, 0.478]}>
        <boxGeometry args={[0.68, 2.06, 0.024]} />
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.graphite}
          metalness={0.45}
          roughness={0.66}
        />
      </mesh>
      {AMBIENT_SERVER_ROWS.map((y, index) => (
        <group key={y} position={[0, y, 0.494]}>
          <mesh>
            <boxGeometry args={[0.61, 0.078, 0.018]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? DATA_CENTER_PALETTE.graphiteLight : DATA_CENTER_PALETTE.black}
              metalness={0.36}
              roughness={0.72}
            />
          </mesh>
          <VentBank position={[-0.14, 0, 0.012]} columns={6} spacing={0.024} slotSize={[0.012, 0.033, 0.006]} />
          {index % 4 === 0 ? (
            <StatusLed position={[0.27, 0, 0.014]} radius={0.006} />
          ) : null}
        </group>
      ))}
      <EquipmentLabel
        title="NEXT"
        subtitle="INFRASTRUCTURE"
        position={[0, 0.99, 0.497]}
        size={[0.28, 0.065]}
        align="center"
      />
    </group>
  );
}

const DEFAULT_AMBIENT_RACKS: readonly {
  position: Vec3;
  rotation?: Vec3;
}[] = [
  { position: [-1.45, 1.1, -2.72] },
  { position: [-0.58, 1.1, -2.72] },
  { position: [0.29, 1.1, -2.72] },
  { position: [3.62, 1.1, -1.72], rotation: [0, -Math.PI / 2, 0] },
];

export type DataCenterEnvironmentProps = DataCenterModelGroupProps & {
  showAmbientRacks?: boolean;
  ambientRacks?: readonly { position: SceneVector3; rotation?: SceneVector3 }[];
  labLabel?: string;
};

export const DataCenterEnvironment = forwardRef<Group, DataCenterEnvironmentProps>(
  function DataCenterEnvironment(
    {
      showAmbientRacks = true,
      ambientRacks = DEFAULT_AMBIENT_RACKS,
      labLabel = "NEXT SOLUTIONS",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <group ref={ref} {...props}>
        <mesh position={[0, -0.1, -1.2]} receiveShadow>
          <boxGeometry args={[9.6, 0.2, 6.7]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.28}
            roughness={0.72}
          />
        </mesh>

        {FLOOR_X_LINES.map((x) => (
          <mesh key={`floor-x-${x}`} position={[x, 0.004, -1.2]} receiveShadow>
            <boxGeometry args={[0.012, 0.008, 6.58]} />
            <meshStandardMaterial color={DATA_CENTER_PALETTE.graphiteLight} roughness={0.75} />
          </mesh>
        ))}
        {FLOOR_Z_LINES.map((z) => (
          <mesh key={`floor-z-${z}`} position={[0, 0.004, z]} receiveShadow>
            <boxGeometry args={[9.48, 0.008, 0.012]} />
            <meshStandardMaterial color={DATA_CENTER_PALETTE.graphiteLight} roughness={0.75} />
          </mesh>
        ))}
        {[-1.2, 1.2].map((x) => (
          <mesh key={`floor-guide-${x}`} position={[x, 0.012, -1.12]}>
            <boxGeometry args={[0.018, 0.012, 5.8]} />
              <meshStandardMaterial
              color={DATA_CENTER_PALETTE.graphiteLight}
              emissive={DATA_CENTER_PALETTE.graphiteLight}
              emissiveIntensity={0.04}
              roughness={0.7}
            />
          </mesh>
        ))}

        <mesh position={[0, 1.55, -3.57]} receiveShadow>
          <boxGeometry args={[9.6, 3.3, 0.14]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            metalness={0.22}
            roughness={0.74}
          />
        </mesh>
        {[-2.75, 0, 2.75].map((x) => (
          <group key={`wall-panel-${x}`}>
            <mesh position={[x, 1.53, -3.49]}>
              <boxGeometry args={[2.56, 2.55, 0.022]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.48}
                roughness={0.64}
              />
            </mesh>
            <PerforationGrid
              position={[x, 1.53, -3.475]}
              columns={20}
              rows={14}
              spacingX={0.115}
              spacingY={0.15}
              radius={0.012}
            />
          </group>
        ))}

        <group position={[0.25, 2.93, -1.55]}>
          <mesh castShadow>
            <boxGeometry args={[4.25, 0.12, 0.72]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.graphite}
              metalness={0.62}
              roughness={0.42}
            />
          </mesh>
          {[-1.55, 0, 1.55].map((x) => (
            <group key={`overhead-light-${x}`} position={[x, -0.071, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.18, 0.42]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.coolWhite}
                  emissive={DATA_CENTER_PALETTE.coolWhite}
                  emissiveIntensity={3.4}
                  roughness={0.22}
                />
              </mesh>
              <pointLight
                color={DATA_CENTER_PALETTE.coolWhite}
                distance={4.3}
                intensity={2.1}
                position={[0, -0.18, 0]}
              />
            </group>
          ))}
        </group>

        <group position={[0, 2.72, -2.63]}>
          {[-1.7, -0.85, 0, 0.85, 1.7].map((x) => (
            <mesh key={`cable-rung-${x}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.055, 0.055, 0.58]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.66}
                roughness={0.38}
              />
            </mesh>
          ))}
          {[-0.27, 0.27].map((z) => (
            <mesh key={`cable-rail-${z}`} position={[0, 0, z]}>
              <boxGeometry args={[3.5, 0.055, 0.055]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.66}
                roughness={0.38}
              />
            </mesh>
          ))}
        </group>

        {showAmbientRacks
          ? ambientRacks.map((rack, index) => (
              <AmbientRack
                key={`ambient-rack-${index}`}
                position={rack.position}
                rotation={rack.rotation}
              />
            ))
          : null}

        <mesh position={[3.56, 2.56, -3.455]}>
          <boxGeometry args={[1.75, 0.5, 0.045]} />
          <meshStandardMaterial
            color="#11181d"
            metalness={0.58}
            roughness={0.44}
          />
        </mesh>
        <EquipmentLabel
          title={labLabel}
          subtitle="EDGE INFRASTRUCTURE LAB"
          position={[3.56, 2.56, -3.428]}
          size={[1.55, 0.34]}
          align="center"
        />

        <group position={[3.02, 2.96, -3.39]}>
          <mesh>
            <boxGeometry args={[2.45, 0.045, 0.045]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.coolWhite}
              emissive={DATA_CENTER_PALETTE.coolWhite}
              emissiveIntensity={2.8}
              roughness={0.22}
            />
          </mesh>
          <pointLight
            color={DATA_CENTER_PALETTE.coolWhite}
            distance={3.6}
            intensity={1.4}
            position={[0, -0.16, 0.22]}
          />
        </group>

        {children}
      </group>
    );
  },
);

DataCenterEnvironment.displayName = "DataCenterEnvironment";

const RACK_CABLE_CURVES = Array.from({ length: 7 }, (_, index) => {
  const offset = (index - 3) * 0.018;
  return new CatmullRomCurve3([
    new Vector3(0.16 + offset, 0.79 + index * 0.002, 0.67),
    new Vector3(0.36 + offset, 0.77 - index * 0.008, 0.72),
    new Vector3(0.52 + offset * 0.45, 0.64 - index * 0.018, 0.54),
    new Vector3(0.54 + offset * 0.28, 0.12 - index * 0.035, 0.42),
    new Vector3(0.53 + offset * 0.18, -0.73 - index * 0.018, 0.39),
  ]);
});

function RackCableBundle() {
  return (
    <group>
      {RACK_CABLE_CURVES.map((curve, index) => (
        <mesh key={`rack-cable-${index}`}>
          <tubeGeometry args={[curve, 28, 0.0055, 7, false]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#35c8f0" : "#219ec4"}
            emissive="#35c8f0"
            emissiveIntensity={0.14}
            metalness={0.06}
            roughness={0.4}
          />
        </mesh>
      ))}
      {[0.46, 0.02, -0.42].map((y) => (
        <mesh key={`cable-clip-${y}`} position={[0.535, y, 0.405]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.012, 7, 20, Math.PI * 1.7]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphiteLight}
            metalness={0.7}
            roughness={0.32}
          />
        </mesh>
      ))}
    </group>
  );
}

function RackBlankPanel({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.07, 0.14, 0.18]} radius={0.016} smoothness={3} castShadow>
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.ink}
          metalness={0.66}
          roughness={0.42}
        />
      </RoundedBox>
      <PerforationGrid
        position={[0, 0, 0.095]}
        columns={22}
        rows={2}
        spacingX={0.041}
        spacingY={0.046}
        radius={0.008}
      />
      {[-0.51, 0.51].map((x) => (
        <mesh key={`blank-panel-screw-${x}`} position={[x, 0, 0.1]}>
          <circleGeometry args={[0.012, 14]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.mutedWhite}
            metalness={0.82}
            roughness={0.24}
          />
        </mesh>
      ))}
    </group>
  );
}

export type DemoRackFrameProps = DataCenterModelGroupProps & {
  doorOpen?: number;
  doorRef?: Ref<Group>;
  showCables?: boolean;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
  label?: string;
  children?: ReactNode;
};

export const DemoRackFrame = forwardRef<Group, DemoRackFrameProps>(
  function DemoRackFrame(
    {
      doorOpen = 0.78,
      doorRef,
      showCables = true,
      onSelect,
      interactive = true,
      label = "DEMO RACK 01",
      children,
      ...props
    },
    ref,
  ) {
    const normalizedDoorOpen = Math.min(1, Math.max(0, doorOpen));

    return (
      <group ref={ref} {...props}>
        <RoundedBox
          args={[1.4, 0.13, 1.38]}
          radius={0.025}
          smoothness={3}
          position={[0, 1.535, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#2d343b"
            metalness={0.74}
            roughness={0.4}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.4, 0.16, 1.38]}
          radius={0.022}
          smoothness={3}
          position={[0, -1.52, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#10161b"
            metalness={0.72}
            roughness={0.38}
          />
        </RoundedBox>

        <mesh position={[0, 0, -0.665]} receiveShadow>
          <boxGeometry args={[1.3, 2.94, 0.055]} />
          <meshStandardMaterial
            color="#0b1014"
            metalness={0.58}
            roughness={0.56}
          />
        </mesh>
        <PerforationGrid
          position={[0, 0, -0.634]}
          columns={23}
          rows={38}
          spacingX={0.048}
          spacingY={0.068}
          radius={0.007}
        />

        {[-0.67, 0.67].map((x) => (
          <group key={`rack-side-panel-${x}`} position={[x, 0, -0.12]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.045, 2.94, 1.02]} />
              <meshStandardMaterial
                color="#11171c"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[x > 0 ? 0.024 : -0.024, 0.98, 0.12]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.34, 0.52]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.55}
                roughness={0.58}
                side={DoubleSide}
              />
            </mesh>
          </group>
        ))}

        <group position={[0, 1.445, 0.68]}>
          <mesh castShadow>
            <boxGeometry args={[1.32, 0.15, 0.055]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.ink}
              metalness={0.68}
              roughness={0.38}
            />
          </mesh>
          <PerforationGrid
            position={[0, 0, 0.03]}
            columns={26}
            rows={2}
            spacingX={0.045}
            spacingY={0.048}
            radius={0.007}
          />
        </group>

        {[-0.53, 0.53].map((x) => (
          <group key={`rack-foot-${x}`} position={[x, -1.635, 0.49]}>
            <mesh>
              <cylinderGeometry args={[0.055, 0.065, 0.1, 18]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.black}
                metalness={0.5}
                roughness={0.58}
              />
            </mesh>
            <mesh position={[0, -0.054, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.045, 0.012, 8, 20]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.7}
                roughness={0.35}
              />
            </mesh>
          </group>
        ))}

        {[-0.66, 0.66].flatMap((x) =>
          [-0.65, 0.65].map((z) => (
            <RoundedBox
              key={`rack-post-${x}-${z}`}
              args={[0.075, 3.06, 0.075]}
              radius={0.016}
              smoothness={2}
              position={[x, 0, z]}
              castShadow
            >
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphite}
                metalness={0.72}
                roughness={0.34}
              />
            </RoundedBox>
          )),
        )}

        {[-1.49, 1.49].flatMap((y) =>
          [-0.65, 0.65].map((z) => (
            <mesh key={`rack-crossbar-${y}-${z}`} position={[0, y, z]} castShadow>
              <boxGeometry args={[1.38, 0.08, 0.075]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.7}
                roughness={0.36}
              />
            </mesh>
          )),
        )}

        {[-0.66, 0.66].flatMap((x) =>
          [-1.49, 1.49].map((y) => (
            <mesh key={`rack-depthbar-${x}-${y}`} position={[x, y, 0]}>
              <boxGeometry args={[0.075, 0.075, 1.3]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.7}
                roughness={0.36}
              />
            </mesh>
          )),
        )}

        {[-0.56, 0.56].map((x) => (
          <group key={`front-rail-${x}`} position={[x, 0, 0.625]}>
            <mesh>
              <boxGeometry args={[0.045, 2.8, 0.035]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.74}
                roughness={0.31}
              />
            </mesh>
            {RACK_UNIT_MARKERS.map((y, index) => (
              <group key={`${x}-${y}`} position={[0, y, 0.021]}>
                <mesh>
                  <boxGeometry args={[0.018, 0.026, 0.008]} />
                  <meshStandardMaterial
                    color={index % 5 === 0 ? DATA_CENTER_PALETTE.coolWhite : DATA_CENTER_PALETTE.black}
                    metalness={0.32}
                    roughness={0.7}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        <group position={[0.56, 0, 0.42]}>
          <RoundedBox args={[0.15, 2.44, 0.1]} radius={0.024} smoothness={3}>
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.ink}
              metalness={0.42}
              roughness={0.68}
            />
          </RoundedBox>
          {CABLE_FINGERS.map((y) => (
            <group key={`cable-finger-${y}`} position={[-0.095, y, 0]}>
              <mesh position={[-0.06, 0.044, 0]}>
                <boxGeometry args={[0.13, 0.022, 0.07]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.graphiteLight}
                  metalness={0.5}
                  roughness={0.58}
                />
              </mesh>
              <mesh position={[-0.06, -0.044, 0]}>
                <boxGeometry args={[0.13, 0.022, 0.07]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.graphiteLight}
                  metalness={0.5}
                  roughness={0.58}
                />
              </mesh>
            </group>
          ))}
          <EquipmentLabel
            title="CABLE PATH"
            subtitle="NEXT SOLUTIONS"
            position={[-0.077, 1.3, 0.057]}
            size={[0.14, 0.05]}
            align="center"
          />
        </group>

        {showCables ? <RackCableBundle /> : null}

        <RackBlankPanel position={[0, DEMO_RACK_LOCAL_Y.blankPanel, 0.56]} />

        {[-0.61, 0.61].map((x) => (
          <group key={`service-rail-${x}`} position={[x, DEMO_RACK_LOCAL_Y.serviceTray, 0.02]}>
            <mesh>
              <boxGeometry args={[0.035, 0.07, 1.18]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.82}
                roughness={0.26}
              />
            </mesh>
            <mesh position={[x < 0 ? 0.021 : -0.021, 0, 0.26]}>
              <boxGeometry args={[0.012, 0.04, 0.52]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.mutedWhite}
                metalness={0.88}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        <group
          ref={doorRef}
          position={[-0.72, 0, 0.705]}
          rotation={[0, -normalizedDoorOpen * 2.72, 0]}
        >
          <group position={[0.68, 0, 0]}>
            {[-0.655, 0.655].map((x) => (
              <mesh key={`door-vertical-${x}`} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.055, 3.08, 0.055]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.graphiteLight}
                  metalness={0.74}
                  roughness={0.32}
                />
              </mesh>
            ))}
            {[-1.515, 1.515].map((y) => (
              <mesh key={`door-horizontal-${y}`} position={[0, y, 0]} castShadow>
                <boxGeometry args={[1.36, 0.055, 0.055]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.graphiteLight}
                  metalness={0.74}
                  roughness={0.32}
                />
              </mesh>
            ))}
            <mesh position={[0, 0, 0.006]}>
              <boxGeometry args={[1.26, 2.96, 0.014]} />
              <meshStandardMaterial
                color="#10161a"
                metalness={0.52}
                opacity={0.82}
                roughness={0.52}
                side={DoubleSide}
                transparent
              />
            </mesh>
            <PerforationGrid
              position={[0, 0, 0.016]}
              columns={22}
              rows={48}
              spacingX={0.053}
              spacingY={0.061}
              radius={0.0095}
              color="#28323a"
            />
            <RoundedBox
              args={[0.052, 0.5, 0.055]}
              radius={0.016}
              smoothness={3}
              position={[0.55, 0, 0.065]}
            >
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.76}
                roughness={0.3}
              />
            </RoundedBox>
            {[-1.08, 0, 1.08].map((y) => (
              <mesh key={`door-hinge-${y}`} position={[-0.69, y, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.032, 0.032, 0.14, 16]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.graphiteLight}
                  metalness={0.78}
                  roughness={0.28}
                />
              </mesh>
            ))}
          </group>
        </group>

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS // EDGE"
          position={[0, 1.43, 0.708]}
          size={[0.62, 0.1]}
          align="center"
        />

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[0, 0, -0.69]}
          size={[1.52, 3.22, 0.14]}
        />

        {children}
      </group>
    );
  },
);

DemoRackFrame.displayName = "DemoRackFrame";

export type RackServerStatus = "active" | "standby" | "offline";

export type RackServerUnitProps = DataCenterModelGroupProps & {
  unitHeight?: number;
  label?: string;
  status?: RackServerStatus;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
};

export const RackServerUnit = forwardRef<Group, RackServerUnitProps>(
  function RackServerUnit(
    {
      unitHeight = 0.14,
      label = "RS-1U COMPUTE",
      status = "active",
      onSelect,
      interactive = true,
      ...props
    },
    ref,
  ) {
    const height = Math.max(0.11, unitHeight);
    const active = status === "active";

    return (
      <group ref={ref} {...props}>
        <RoundedBox args={[1.08, height, 1.02]} radius={0.018} smoothness={3} castShadow>
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            metalness={0.62}
            roughness={0.43}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.522]}>
          <boxGeometry args={[1.07, height * 0.88, 0.024]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.46}
            roughness={0.68}
          />
        </mesh>

        {Array.from({ length: height >= 0.22 ? 8 : 4 }, (_, index) => {
          const rows = height >= 0.22 ? 2 : 1;
          const row = rows === 2 ? Math.floor(index / 4) : 0;
          const column = index % 4;
          const x = -0.405 + column * 0.142;
          const y = rows === 2 ? (row === 0 ? height * 0.2 : -height * 0.2) : 0;
          return (
          <group key={`server-bay-${index}`} position={[x, y, 0.541]}>
            <RoundedBox
              args={[0.126, rows === 2 ? height * 0.34 : height * 0.6, 0.025]}
              radius={0.006}
              smoothness={2}
            >
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.58}
                roughness={0.48}
              />
            </RoundedBox>
            <mesh position={[0.037, 0, 0.017]}>
              <boxGeometry args={[0.009, rows === 2 ? height * 0.22 : height * 0.38, 0.008]} />
              <meshStandardMaterial color={DATA_CENTER_PALETTE.coolWhite} roughness={0.54} />
            </mesh>
            {index === 0 ? (
              <StatusLed
                position={[-0.045, rows === 2 ? height * 0.1 : height * 0.19, 0.018]}
                radius={0.005}
                active={active}
              />
            ) : null}
          </group>
          );
        })}

        <VentBank
          position={[0.225, 0, 0.542]}
          columns={9}
          spacing={0.024}
          slotSize={[0.013, height * 0.5, 0.008]}
        />
        <StatusLed position={[0.465, height * 0.17, 0.544]} radius={0.007} active={active} />
        <StatusLed
          position={[0.465, -height * 0.12, 0.544]}
          radius={0.006}
          active={status !== "offline"}
        />

        {[-0.515, 0.515].map((x) => (
          <RoundedBox
            key={`server-handle-${x}`}
            args={[0.026, height * 0.72, 0.055]}
            radius={0.006}
            smoothness={2}
            position={[x, 0, 0.45]}
          >
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.mutedWhite}
              metalness={0.72}
              roughness={0.28}
            />
          </RoundedBox>
        ))}

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS"
          position={[0.39, -height * 0.18, 0.546]}
          size={[0.17, Math.min(0.05, height * 0.34)]}
          align="center"
        />

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[0, 0, 0.02]}
          size={[1.18, Math.max(0.2, height + 0.08), 1.14]}
        />
      </group>
    );
  },
);

RackServerUnit.displayName = "RackServerUnit";

const DEFAULT_ACTIVE_PORTS: readonly number[] = [0, 1, 4, 7, 12, 17, 20];

export type NetworkSwitchModelProps = DataCenterModelGroupProps & {
  portCount?: number;
  activePorts?: readonly number[];
  label?: string;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
};

export const NetworkSwitchModel = forwardRef<Group, NetworkSwitchModelProps>(
  function NetworkSwitchModel(
    {
      portCount = 24,
      activePorts = DEFAULT_ACTIVE_PORTS,
      label = "NS-24 NETWORK",
      onSelect,
      interactive = true,
      ...props
    },
    ref,
  ) {
    const normalizedPortCount = Math.min(24, Math.max(8, Math.round(portCount)));
    const columns = Math.ceil(normalizedPortCount / 2);
    const activePortSet = useMemo(() => new Set(activePorts), [activePorts]);

    return (
      <group ref={ref} {...props}>
        <RoundedBox args={[1.08, 0.105, 0.7]} radius={0.016} smoothness={3} castShadow>
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            metalness={0.6}
            roughness={0.45}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.358]}>
          <boxGeometry args={[1.07, 0.095, 0.026]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.4}
            roughness={0.72}
          />
        </mesh>

        {Array.from({ length: normalizedPortCount }, (_, index) => {
          const row = index >= columns ? 1 : 0;
          const column = index % columns;
          const x = 0.02 + (column - (columns - 1) / 2) * 0.048;
          const y = row === 0 ? 0.021 : -0.021;
          const isActive = activePortSet.has(index);
          return (
            <group key={`network-port-${index}`} position={[x, y, 0.376]}>
              <mesh>
                <boxGeometry args={[0.032, 0.025, 0.014]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.black}
                  metalness={0.28}
                  roughness={0.78}
                />
              </mesh>
              <mesh position={[0, 0.004, 0.008]}>
                <boxGeometry args={[0.021, 0.006, 0.003]} />
                <meshStandardMaterial
                  color={isActive ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.mutedWhite}
                  emissive={isActive ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.black}
                  emissiveIntensity={isActive ? 0.95 : 0}
                  roughness={0.46}
                />
              </mesh>
            </group>
          );
        })}

        {[0.39, 0.45].map((x, index) => (
          <group key={`sfp-port-${x}`} position={[x, 0, 0.376]}>
            <mesh>
              <boxGeometry args={[0.042, 0.045, 0.014]} />
              <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.78} />
            </mesh>
            <StatusLed position={[0.014, 0.031, 0.008]} radius={0.0045} active={index === 0} />
          </group>
        ))}

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS"
          position={[-0.43, 0, 0.377]}
          size={[0.15, 0.052]}
          align="center"
        />
        <StatusLed position={[0.51, 0.025, 0.377]} radius={0.006} />

        {[-0.535, 0.535].map((x) => (
          <group key={`switch-ear-${x}`} position={[x, 0, 0.374]}>
            <mesh>
              <boxGeometry args={[0.035, 0.13, 0.04]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.72}
                roughness={0.32}
              />
            </mesh>
            <mesh position={[0, 0, 0.024]}>
              <circleGeometry args={[0.009, 12]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.mutedWhite}
                metalness={0.82}
                roughness={0.22}
              />
            </mesh>
          </group>
        ))}

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          size={[1.18, 0.19, 0.82]}
        />
      </group>
    );
  },
);

NetworkSwitchModel.displayName = "NetworkSwitchModel";

export type NasApplianceModelProps = DataCenterModelGroupProps & {
  bayCount?: number;
  populatedBays?: number;
  label?: string;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
};

export const NasApplianceModel = forwardRef<Group, NasApplianceModelProps>(
  function NasApplianceModel(
    {
      bayCount = 4,
      populatedBays = 4,
      label = "NAS-04 STORAGE",
      onSelect,
      interactive = true,
      ...props
    },
    ref,
  ) {
    const normalizedBayCount = Math.min(6, Math.max(2, Math.round(bayCount)));
    const normalizedPopulatedBays = Math.min(
      normalizedBayCount,
      Math.max(0, Math.round(populatedBays)),
    );
    const bayGap = 0.012;
    const bayAreaWidth = 0.62;
    const bayWidth = (bayAreaWidth - bayGap * (normalizedBayCount - 1)) / normalizedBayCount;

    return (
      <group ref={ref} {...props}>
        <RoundedBox args={[0.9, 0.54, 0.72]} radius={0.045} smoothness={5} castShadow>
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            metalness={0.42}
            roughness={0.58}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.86, 0.5, 0.032]}
          radius={0.028}
          smoothness={4}
          position={[0, 0, 0.376]}
        >
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.38}
            roughness={0.72}
          />
        </RoundedBox>

        {Array.from({ length: normalizedBayCount }, (_, index) => {
          const x = -0.38 + bayWidth / 2 + index * (bayWidth + bayGap);
          const populated = index < normalizedPopulatedBays;
          return (
            <group key={`nas-bay-${index}`} position={[x, -0.01, 0.4]}>
              <RoundedBox args={[bayWidth, 0.31, 0.028]} radius={0.01} smoothness={2}>
                <meshStandardMaterial
                  color={populated ? DATA_CENTER_PALETTE.graphiteLight : DATA_CENTER_PALETTE.black}
                  metalness={0.48}
                  roughness={0.6}
                />
              </RoundedBox>
              <mesh position={[0, 0.11, 0.019]}>
                <boxGeometry args={[bayWidth * 0.58, 0.025, 0.008]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.coolWhite}
                  metalness={0.52}
                  roughness={0.42}
                />
              </mesh>
              <mesh position={[0, -0.112, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[Math.min(0.014, bayWidth * 0.18), 0.003, 8, 18]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.mutedWhite}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              <StatusLed
                position={[bayWidth * 0.28, 0.137, 0.02]}
                radius={0.0045}
                active={populated}
              />
            </group>
          );
        })}

        <group position={[0.35, -0.02, 0.401]}>
          {[0.1, 0.05, 0, -0.05].map((y, index) => (
            <StatusLed
              key={`nas-status-${y}`}
              position={[0, y, 0]}
              radius={0.005}
              active={index <= normalizedPopulatedBays - 1}
            />
          ))}
          <mesh position={[0, -0.125, 0]}>
            <circleGeometry args={[0.025, 24]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.graphiteLight}
              emissive={DATA_CENTER_PALETTE.cyan}
              emissiveIntensity={0.18}
              metalness={0.54}
              roughness={0.36}
            />
          </mesh>
          <mesh position={[0, -0.125, 0.006]}>
            <ringGeometry args={[0.017, 0.021, 20]} />
            <meshBasicMaterial color={DATA_CENTER_PALETTE.cyan} toneMapped={false} />
          </mesh>
        </group>

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS"
          position={[0.06, 0.235, 0.403]}
          size={[0.37, 0.065]}
          align="center"
        />
        <EquipmentLabel
          title="2.5GbE"
          subtitle="HOT-SWAP"
          position={[0.34, 0.19, 0.404]}
          size={[0.13, 0.05]}
          align="center"
        />
        {[-0.36, 0.36].map((x) => (
          <mesh key={`nas-foot-${x}`} position={[x, -0.288, 0.14]}>
            <boxGeometry args={[0.09, 0.035, 0.16]} />
            <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.86} />
          </mesh>
        ))}

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[0, 0, 0.02]}
          size={[1, 0.68, 0.86]}
        />
      </group>
    );
  },
);

NasApplianceModel.displayName = "NasApplianceModel";

export type RackStorageArrayModelProps = DataCenterModelGroupProps & {
  driveCount?: number;
  label?: string;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
};

export const RackStorageArrayModel = forwardRef<Group, RackStorageArrayModelProps>(
  function RackStorageArrayModel(
    {
      driveCount = 12,
      label = "12-BAY STORAGE ARRAY",
      onSelect,
      interactive = true,
      ...props
    },
    ref,
  ) {
    const normalizedDriveCount = Math.min(12, Math.max(6, Math.round(driveCount)));

    return (
      <group ref={ref} {...props}>
        <RoundedBox args={[1.08, 0.3, 0.94]} radius={0.022} smoothness={3} castShadow>
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            metalness={0.64}
            roughness={0.44}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.482]}>
          <boxGeometry args={[1.07, 0.28, 0.025]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.46}
            roughness={0.66}
          />
        </mesh>

        {Array.from({ length: normalizedDriveCount }, (_, index) => {
          const row = Math.floor(index / 6);
          const column = index % 6;
          const x = -0.395 + column * 0.15;
          const y = row === 0 ? 0.066 : -0.066;
          return (
            <group key={`storage-bay-${index}`} position={[x, y, 0.501]}>
              <RoundedBox args={[0.13, 0.105, 0.026]} radius={0.008} smoothness={2}>
                <meshStandardMaterial
                  color={index % 4 === 0 ? DATA_CENTER_PALETTE.graphiteLight : "#222a30"}
                  metalness={0.58}
                  roughness={0.5}
                />
              </RoundedBox>
              <mesh position={[0.043, 0, 0.018]}>
                <boxGeometry args={[0.012, 0.067, 0.008]} />
                <meshStandardMaterial
                  color={DATA_CENTER_PALETTE.mutedWhite}
                  metalness={0.6}
                  roughness={0.34}
                />
              </mesh>
              <StatusLed
                position={[-0.043, 0.032, 0.02]}
                radius={0.0045}
                active={index < normalizedDriveCount - 1}
              />
            </group>
          );
        })}

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS // STORAGE"
          position={[0.34, 0.118, 0.503]}
          size={[0.26, 0.05]}
          align="center"
        />
        {[-0.52, 0.52].map((x) => (
          <group key={`storage-ear-${x}`} position={[x, 0, 0.498]}>
            <mesh>
              <boxGeometry args={[0.032, 0.25, 0.045]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.74}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.08, 0.026]}>
              <circleGeometry args={[0.009, 12]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.mutedWhite}
                metalness={0.82}
                roughness={0.22}
              />
            </mesh>
          </group>
        ))}

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          size={[1.18, 0.4, 1.06]}
        />
      </group>
    );
  },
);

RackStorageArrayModel.displayName = "RackStorageArrayModel";

export type UpsModelProps = DataCenterModelGroupProps & {
  loadPercent?: number;
  label?: string;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
};

export const UpsModel = forwardRef<Group, UpsModelProps>(function UpsModel(
  {
    loadPercent = 42,
    label = "UPS-2200",
    onSelect,
    interactive = true,
    ...props
  },
  ref,
) {
  const normalizedLoad = Math.min(100, Math.max(0, Math.round(loadPercent)));
  const illuminatedSegments = Math.round(normalizedLoad / 20);

  return (
    <group ref={ref} {...props}>
      <RoundedBox args={[1.08, 0.34, 0.94]} radius={0.022} smoothness={3} castShadow>
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.graphite}
          metalness={0.62}
          roughness={0.46}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.482]}>
        <boxGeometry args={[1.07, 0.32, 0.025]} />
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.ink}
          metalness={0.38}
          roughness={0.74}
        />
      </mesh>

      <RoundedBox
        args={[0.22, 0.15, 0.026]}
        radius={0.012}
        smoothness={3}
        position={[0.25, 0, 0.499]}
      >
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.black}
          metalness={0.18}
          roughness={0.42}
        />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh key={`ups-load-${index}`} position={[0.172 + index * 0.039, -0.026, 0.515]}>
          <boxGeometry args={[0.027, 0.035 + index * 0.008, 0.006]} />
          <meshStandardMaterial
            color={index < illuminatedSegments ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.graphiteLight}
            emissive={index < illuminatedSegments ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.black}
            emissiveIntensity={index < illuminatedSegments ? 0.86 : 0}
            roughness={0.44}
          />
        </mesh>
      ))}
      <EquipmentLabel
        title={`${normalizedLoad}% LOAD`}
        subtitle="POWER CONDITIONING"
        position={[0.25, 0.045, 0.515]}
        size={[0.16, 0.05]}
        align="center"
      />

      <mesh position={[-0.25, 0.02, 0.506]}>
        <circleGeometry args={[0.048, 28]} />
        <meshStandardMaterial
          color={DATA_CENTER_PALETTE.graphiteLight}
          metalness={0.68}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.25, 0.02, 0.513]}>
        <ringGeometry args={[0.034, 0.041, 28]} />
        <meshBasicMaterial color={DATA_CENTER_PALETTE.cyan} toneMapped={false} />
      </mesh>
      <StatusLed position={[-0.17, 0.105, 0.511]} radius={0.007} />
      <VentBank
        position={[-0.4, 0, 0.508]}
        columns={7}
        spacing={0.026}
        slotSize={[0.013, 0.18, 0.008]}
      />

      {[-0.515, 0.515].map((x) => (
        <RoundedBox
          key={`ups-handle-${x}`}
          args={[0.026, 0.22, 0.06]}
          radius={0.006}
          smoothness={2}
          position={[x, 0, 0.426]}
        >
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.coolWhite}
            metalness={0.74}
            roughness={0.28}
          />
        </RoundedBox>
      ))}

      <EquipmentLabel
        title={label}
        subtitle="NEXT SOLUTIONS"
        position={[-0.14, -0.11, 0.515]}
        size={[0.24, 0.052]}
        align="center"
      />

      <InteractiveHitbox
        disabled={!interactive}
        onSelect={onSelect}
        size={[1.18, 0.46, 1.06]}
      />
    </group>
  );
});

UpsModel.displayName = "UpsModel";

export type ComputeComponentId = "sata-ssd" | "nvme-ssd" | "ram" | "gpu" | "hdd";

export type ComputeComponentRefs = Partial<Record<ComputeComponentId, Ref<Group>>>;

export const COMPUTE_TRAY_COMPONENT_TRANSFORMS: Record<
  ComputeComponentId,
  SceneModelTransform
> = {
  "sata-ssd": { position: [-0.39, 0.145, 0.2], rotation: [0, 0, 0], scale: 0.48 },
  "nvme-ssd": { position: [-0.13, 0.14, 0.16], rotation: [0, 0, 0], scale: 0.62 },
  ram: { position: [-0.36, 0.15, -0.3], rotation: [0, 0, 0], scale: 0.48 },
  gpu: { position: [0.17, 0.19, -0.29], rotation: [0, 0, 0], scale: 0.56 },
  hdd: { position: [0.4, 0.145, 0.19], rotation: [0, 0, 0], scale: 0.44 },
};

export type ComputeComponentSelectHandler = (
  component: ComputeComponentId,
  event: ThreeEvent<MouseEvent>,
) => void;

export type ComputeServiceTrayProps = DataCenterModelGroupProps & {
  componentRefs?: ComputeComponentRefs;
  selectedComponent?: ComputeComponentId | null;
  onComponentSelect?: ComputeComponentSelectHandler;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
  label?: string;
};

export const ComputeServiceTray = forwardRef<Group, ComputeServiceTrayProps>(
  function ComputeServiceTray(
    {
      componentRefs,
      selectedComponent = null,
      onComponentSelect,
      onSelect,
      interactive = true,
      label = "SERVICE TRAY A",
      ...props
    },
    ref,
  ) {
    const handleComponentSelect = (component: ComputeComponentId) =>
      onComponentSelect
        ? (event: ThreeEvent<MouseEvent>) => onComponentSelect(component, event)
        : undefined;

    return (
      <group ref={ref} {...props}>
        <RoundedBox
          args={[1.08, 0.07, 1.18]}
          radius={0.035}
          smoothness={4}
          position={[0, 0.035, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphite}
            emissive={selectedComponent ? DATA_CENTER_PALETTE.cyan : DATA_CENTER_PALETTE.black}
            emissiveIntensity={selectedComponent ? 0.06 : 0}
            metalness={0.58}
            roughness={0.48}
          />
        </RoundedBox>
        <mesh position={[0, 0.15, -0.575]}>
          <boxGeometry args={[1.02, 0.23, 0.035]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.55}
            roughness={0.6}
          />
        </mesh>
        {[-0.525, 0.525].map((x) => (
          <mesh key={`tray-side-${x}`} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.03, 0.15, 1.12]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.graphiteLight}
              metalness={0.64}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.105, 0.615]}>
          <boxGeometry args={[1.08, 0.19, 0.055]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.ink}
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        <PerforationGrid
          position={[0, 0.105, 0.645]}
          columns={21}
          rows={3}
          spacingX={0.044}
          spacingY={0.047}
          radius={0.007}
        />
        {[-0.51, 0.51].map((x) => (
          <group key={`tray-ear-${x}`} position={[x, 0.105, 0.652]}>
            <mesh>
              <boxGeometry args={[0.055, 0.22, 0.04]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.76}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.062, 0.023]}>
              <circleGeometry args={[0.01, 12]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.mutedWhite}
                metalness={0.86}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
        {[-0.43, 0.43].map((x) => (
          <RoundedBox
            key={`tray-handle-${x}`}
            args={[0.045, 0.12, 0.06]}
            radius={0.01}
            smoothness={2}
            position={[x, 0.105, 0.675]}
          >
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.mutedWhite}
              metalness={0.78}
              roughness={0.28}
            />
          </RoundedBox>
        ))}
        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS // COMPONENT LAB"
          position={[0, 0.105, 0.678]}
          size={[0.46, 0.07]}
          align="center"
        />

        <group position={[-0.08, 0.105, -0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={0.72}>
          <MotherboardModel />
        </group>

        {[-0.535, 0.535].map((x) => (
          <mesh key={`moving-tray-rail-${x}`} position={[x, 0.03, 0.04]}>
            <boxGeometry args={[0.025, 0.045, 1.04]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.mutedWhite}
              metalness={0.86}
              roughness={0.2}
            />
          </mesh>
        ))}

        <group
          ref={componentRefs?.["sata-ssd"]}
          position={COMPUTE_TRAY_COMPONENT_TRANSFORMS["sata-ssd"].position}
          rotation={COMPUTE_TRAY_COMPONENT_TRANSFORMS["sata-ssd"].rotation}
          scale={COMPUTE_TRAY_COMPONENT_TRANSFORMS["sata-ssd"].scale}
        >
          <SataSSDModel />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleComponentSelect("sata-ssd")}
            position={[0, 0.02, 0]}
            size={[0.46, 0.22, 0.36]}
          />
        </group>

        <group
          ref={componentRefs?.["nvme-ssd"]}
          position={COMPUTE_TRAY_COMPONENT_TRANSFORMS["nvme-ssd"].position}
          rotation={COMPUTE_TRAY_COMPONENT_TRANSFORMS["nvme-ssd"].rotation}
          scale={COMPUTE_TRAY_COMPONENT_TRANSFORMS["nvme-ssd"].scale}
        >
          <NvmeSSDModel rotation={[-Math.PI / 2, 0, 0]} />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleComponentSelect("nvme-ssd")}
            position={[0, 0.02, 0]}
            size={[0.25, 0.24, 0.44]}
          />
        </group>

        <group
          ref={componentRefs?.ram}
          position={COMPUTE_TRAY_COMPONENT_TRANSFORMS.ram.position}
          rotation={COMPUTE_TRAY_COMPONENT_TRANSFORMS.ram.rotation}
          scale={COMPUTE_TRAY_COMPONENT_TRANSFORMS.ram.scale}
        >
          <RamModel rotation={[0, 0, -Math.PI / 2]} />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleComponentSelect("ram")}
            position={[0, 0.02, 0]}
            size={[0.48, 0.26, 0.36]}
          />
        </group>

        <group
          ref={componentRefs?.gpu}
          position={COMPUTE_TRAY_COMPONENT_TRANSFORMS.gpu.position}
          rotation={COMPUTE_TRAY_COMPONENT_TRANSFORMS.gpu.rotation}
          scale={COMPUTE_TRAY_COMPONENT_TRANSFORMS.gpu.scale}
        >
          <GpuModel />
          {[-0.23, 0.23].map((x) => (
            <mesh key={`gpu-support-${x}`} position={[x, -0.11, -0.03]}>
              <boxGeometry args={[0.025, 0.16, 0.08]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.coolWhite}
                metalness={0.68}
                roughness={0.32}
              />
            </mesh>
          ))}
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleComponentSelect("gpu")}
            size={[0.82, 0.42, 0.34]}
          />
        </group>

        <group
          ref={componentRefs?.hdd}
          position={COMPUTE_TRAY_COMPONENT_TRANSFORMS.hdd.position}
          rotation={COMPUTE_TRAY_COMPONENT_TRANSFORMS.hdd.rotation}
          scale={COMPUTE_TRAY_COMPONENT_TRANSFORMS.hdd.scale}
        >
          <HddModel />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleComponentSelect("hdd")}
            position={[0, 0.02, 0]}
            size={[0.48, 0.25, 0.62]}
          />
        </group>

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[0, 0.11, -0.61]}
          size={[1.16, 0.3, 0.14]}
        />
      </group>
    );
  },
);

ComputeServiceTray.displayName = "ComputeServiceTray";

export type OperatorEquipmentId =
  | "primary-monitor"
  | "keyboard"
  | "mouse"
  | "external-ssd";

export type OperatorEquipmentRefs = Partial<Record<OperatorEquipmentId, Ref<Group>>>;

export const OPERATOR_EQUIPMENT_TRANSFORMS: Record<
  OperatorEquipmentId,
  SceneModelTransform
> = {
  "primary-monitor": {
    position: [-0.08, 1.5, -0.24],
    rotation: [0, -0.02, 0],
    scale: 0.94,
  },
  keyboard: {
    position: [-0.08, 0.93, 0.24],
    rotation: [0, -0.018, 0],
    scale: 0.88,
  },
  mouse: {
    position: [0.69, 0.95, 0.28],
    rotation: [0, -0.06, 0],
    scale: 0.9,
  },
  "external-ssd": {
    position: [1.04, 0.935, 0.2],
    rotation: [0, -0.08, 0],
    scale: 0.92,
  },
};

export type OperatorEquipmentSelectHandler = (
  equipment: OperatorEquipmentId,
  event: ThreeEvent<MouseEvent>,
) => void;

export type OperatorWorkstationProps = DataCenterModelGroupProps & {
  equipmentRefs?: OperatorEquipmentRefs;
  onEquipmentSelect?: OperatorEquipmentSelectHandler;
  onSelect?: ModelSelectHandler;
  interactive?: boolean;
  label?: string;
};

export const OperatorWorkstation = forwardRef<Group, OperatorWorkstationProps>(
  function OperatorWorkstation(
    {
      equipmentRefs,
      onEquipmentSelect,
      onSelect,
      interactive = true,
      label = "OPERATOR NODE 01",
      ...props
    },
    ref,
  ) {
    const handleEquipmentSelect = (equipment: OperatorEquipmentId) =>
      onEquipmentSelect
        ? (event: ThreeEvent<MouseEvent>) => onEquipmentSelect(equipment, event)
        : undefined;

    return (
      <group ref={ref} {...props}>
        <RoundedBox
          args={[2.76, 0.14, 1.18]}
          radius={0.045}
          smoothness={4}
          position={[0, 0.82, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#252d33"
            metalness={0.46}
            roughness={0.44}
          />
        </RoundedBox>

        <group position={[-1.13, 0.4, 0]}>
          {[-0.43, 0.43].map((z) => (
            <mesh key={`left-frame-post-${z}`} position={[0, 0, z]} castShadow>
              <boxGeometry args={[0.1, 0.76, 0.1]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.graphiteLight}
                metalness={0.72}
                roughness={0.32}
              />
            </mesh>
          ))}
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.96]} />
            <meshStandardMaterial
              color={DATA_CENTER_PALETTE.graphiteLight}
              metalness={0.72}
              roughness={0.32}
            />
          </mesh>
          {[-0.43, 0.43].map((z) => (
            <RoundedBox
              key={`left-frame-foot-${z}`}
              args={[0.32, 0.045, 0.28]}
              radius={0.018}
              smoothness={3}
              position={[0, -0.42, z]}
            >
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.ink}
                metalness={0.55}
                roughness={0.55}
              />
            </RoundedBox>
          ))}
        </group>

        <RoundedBox
          args={[0.66, 0.74, 0.9]}
          radius={0.025}
          smoothness={4}
          position={[1.03, 0.39, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#151b20"
            metalness={0.46}
            roughness={0.54}
          />
        </RoundedBox>
        {[-0.205, 0, 0.205].map((y, index) => (
          <group key={`pedestal-drawer-${y}`} position={[1.03, 0.4 + y, 0.458]}>
            <RoundedBox args={[0.57, 0.17, 0.028]} radius={0.008} smoothness={2}>
              <meshStandardMaterial
                color={index === 0 ? DATA_CENTER_PALETTE.graphiteLight : "#20272d"}
                metalness={0.52}
                roughness={0.52}
              />
            </RoundedBox>
            <mesh position={[0, 0.045, 0.02]}>
              <boxGeometry args={[0.22, 0.018, 0.014]} />
              <meshStandardMaterial
                color={DATA_CENTER_PALETTE.mutedWhite}
                metalness={0.84}
                roughness={0.22}
              />
            </mesh>
          </group>
        ))}
        {[-0.22, 0.22].map((x) => (
          <mesh key={`pedestal-foot-${x}`} position={[1.03 + x, 0.0, 0.28]}>
            <boxGeometry args={[0.12, 0.06, 0.24]} />
            <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.82} />
          </mesh>
        ))}

        <mesh position={[-0.22, 0.5, -0.51]}>
          <boxGeometry args={[1.8, 0.46, 0.055]} />
          <meshStandardMaterial
            color="#151b20"
            metalness={0.36}
            roughness={0.64}
          />
        </mesh>
        <PerforationGrid
          position={[-0.22, 0.5, -0.48]}
          columns={18}
          rows={5}
          spacingX={0.086}
          spacingY={0.072}
          radius={0.009}
        />

        <RoundedBox
          args={[1.65, 0.075, 0.16]}
          radius={0.018}
          smoothness={3}
          position={[-0.2, 0.69, -0.4]}
        >
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.graphiteLight}
            metalness={0.62}
            roughness={0.4}
          />
        </RoundedBox>
        {[-0.68, -0.2, 0.28].map((x) => (
          <mesh key={`cable-slot-${x}`} position={[x, 0.69, -0.31]}>
            <boxGeometry args={[0.28, 0.022, 0.018]} />
            <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.82} />
          </mesh>
        ))}

        <mesh position={[-0.18, 0.875, -0.52]}>
          <boxGeometry args={[2.1, 0.024, 0.03]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.cyan}
            emissive={DATA_CENTER_PALETTE.cyan}
            emissiveIntensity={1.45}
            roughness={0.4}
          />
        </mesh>
        <pointLight
          color={DATA_CENTER_PALETTE.cyan}
          distance={2.8}
          intensity={7.5}
          position={[-0.18, 0.9, -0.22]}
          decay={2}
        />
        <pointLight
          color="#e7f7ff"
          distance={4.2}
          intensity={14}
          position={[0.1, 2.05, 1.42]}
          decay={2}
        />

        <RoundedBox
          args={[1.58, 0.018, 0.72]}
          radius={0.025}
          smoothness={3}
          position={[-0.04, 0.9, 0.23]}
          receiveShadow
        >
          <meshStandardMaterial color={DATA_CENTER_PALETTE.black} roughness={0.82} />
        </RoundedBox>
        <mesh position={[-0.22, 0.899, -0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.055, 28]} />
          <meshStandardMaterial
            color={DATA_CENTER_PALETTE.coolWhite}
            metalness={0.65}
            roughness={0.34}
          />
        </mesh>

        <group
          ref={equipmentRefs?.["primary-monitor"]}
          position={OPERATOR_EQUIPMENT_TRANSFORMS["primary-monitor"].position}
          rotation={OPERATOR_EQUIPMENT_TRANSFORMS["primary-monitor"].rotation}
          scale={OPERATOR_EQUIPMENT_TRANSFORMS["primary-monitor"].scale}
        >
          <MonitorModel wide />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleEquipmentSelect("primary-monitor")}
            position={[0, -0.03, 0]}
            size={[1.82, 1.02, 0.24]}
          />
        </group>

        <group
          ref={equipmentRefs?.keyboard}
          position={OPERATOR_EQUIPMENT_TRANSFORMS.keyboard.position}
          rotation={OPERATOR_EQUIPMENT_TRANSFORMS.keyboard.rotation}
          scale={OPERATOR_EQUIPMENT_TRANSFORMS.keyboard.scale}
        >
          <KeyboardModel />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleEquipmentSelect("keyboard")}
            position={[0, 0.04, 0]}
            size={[1.34, 0.22, 0.54]}
          />
        </group>

        <group
          ref={equipmentRefs?.mouse}
          position={OPERATOR_EQUIPMENT_TRANSFORMS.mouse.position}
          rotation={OPERATOR_EQUIPMENT_TRANSFORMS.mouse.rotation}
          scale={OPERATOR_EQUIPMENT_TRANSFORMS.mouse.scale}
        >
          <MouseModel />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleEquipmentSelect("mouse")}
            position={[0, 0.04, 0]}
            size={[0.38, 0.24, 0.46]}
          />
        </group>

        <group
          ref={equipmentRefs?.["external-ssd"]}
          position={OPERATOR_EQUIPMENT_TRANSFORMS["external-ssd"].position}
          rotation={OPERATOR_EQUIPMENT_TRANSFORMS["external-ssd"].rotation}
          scale={OPERATOR_EQUIPMENT_TRANSFORMS["external-ssd"].scale}
        >
          <ExternalSSDModel />
          <InteractiveHitbox
            disabled={!interactive}
            onSelect={handleEquipmentSelect("external-ssd")}
            position={[0, 0.035, 0]}
            size={[0.5, 0.22, 0.42]}
          />
        </group>

        <EquipmentLabel
          title={label}
          subtitle="NEXT SOLUTIONS // OPS"
          position={[1.03, 0.68, 0.476]}
          size={[0.46, 0.08]}
          align="center"
        />
        <StatusLed position={[1.28, 0.69, 0.478]} radius={0.01} />

        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[-0.22, 0.8, 0.62]}
          size={[1.8, 0.22, 0.14]}
        />
        <InteractiveHitbox
          disabled={!interactive}
          onSelect={onSelect}
          position={[1.03, 0.39, 0.48]}
          size={[0.72, 0.82, 0.12]}
        />
      </group>
    );
  },
);

OperatorWorkstation.displayName = "OperatorWorkstation";
