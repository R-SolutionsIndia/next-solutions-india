import type { ProductTarget, SceneTarget } from "@/lib/scene-store";

export type SceneProduct = {
  name: string;
  category: string;
  description: string;
  specs: readonly string[];
  brands: readonly string[];
  href: string;
  representative?: boolean;
};

export const SCENE_PRODUCTS: Record<ProductTarget, SceneProduct> = {
  monitor: {
    name: "Gaming monitor",
    category: "Representative desk prop",
    description: "A representative display that shows how the gaming workspace comes together.",
    specs: ["Desk-scale display", "DisplayPort / HDMI class", "VESA-style stand"],
    brands: [],
    href: "/products",
    representative: true,
  },
  keyboard: {
    name: "Gaming keyboard",
    category: "Representative desk prop",
    description: "A representative compact mechanical keyboard used to complete the scene.",
    specs: ["Compact layout", "Mechanical-style keys", "Wired desk setup"],
    brands: [],
    href: "/products",
    representative: true,
  },
  mouse: {
    name: "Gaming mouse",
    category: "Representative desk prop",
    description: "A representative ergonomic mouse used to complete the gaming workspace.",
    specs: ["Ergonomic shell", "Optical-sensor class", "Wired desk setup"],
    brands: [],
    href: "/products",
    representative: true,
  },
  "external-ssd": {
    name: "External SSD",
    category: "Storage",
    description: "Portable solid-state storage for fast transfers and backups.",
    specs: ["USB-C options", "500 GB–4 TB", "Portable form factor"],
    brands: ["Brand", "Capacity", "Interface"],
    href: "/products/ssd?driveType=Portable",
    representative: true,
  },
  "sata-ssd": {
    name: "2.5-inch SATA SSD",
    category: "Internal storage",
    description: "A standard 100 × 69.85 × 7 mm SATA drive, shown on a removable sled.",
    specs: ["2.5-inch / 7 mm", "SATA III", "500 GB–4 TB"],
    brands: ["Brand", "Capacity", "Read speed"],
    href: "/products/ssd?driveType=Internal+SATA",
    representative: true,
  },
  "nvme-ssd": {
    name: "M.2 NVMe SSD",
    category: "Internal storage",
    description: "Compact motherboard storage, released from its standoff before removal.",
    specs: ["M.2 2280", "PCIe NVMe", "500 GB–4 TB"],
    brands: ["Brand", "Capacity", "PCIe generation"],
    href: "/products/ssd?driveType=Internal+NVMe",
    representative: true,
  },
  ram: {
    name: "Desktop memory",
    category: "Memory",
    description: "Compare desktop kits by generation, capacity, speed and latency.",
    specs: ["Desktop DIMM", "Matched kits", "DDR4 / DDR5 options"],
    brands: ["Brand", "Capacity", "Speed"],
    href: "/products/ram",
    representative: true,
  },
  gpu: {
    name: "Graphics cards",
    category: "Graphics",
    description: "Choose by chipset, VRAM, dimensions and power requirement.",
    specs: ["Triple-fan class", "PCIe x16", "DisplayPort / HDMI"],
    brands: ["Brand", "Chipset", "VRAM"],
    href: "/products/graphics",
    representative: true,
  },
  hdd: {
    name: "3.5-inch HDD",
    category: "Internal storage",
    description: "High-capacity storage mounted in a sliding drive caddy.",
    specs: ["3.5-inch", "SATA", "Desktop / NAS options"],
    brands: ["Brand", "Capacity", "Workload"],
    href: "/products/hdd",
    representative: true,
  },
};

export const CAMERA_PRESETS: Record<
  SceneTarget,
  { position: readonly [number, number, number]; target: readonly [number, number, number] }
> = {
  overview: { position: [4.2, 2.2, 5.1], target: [0.45, 0.62, -0.02] },
  tower: { position: [3.99, 1.72, 2.85], target: [2.14, 0.84, -0.08] },
  monitor: { position: [2.78, 1.72, 3.16], target: [0.38, 0.92, -0.04] },
  keyboard: { position: [2.34, 0.95, 2.83], target: [0.54, 0.22, 1.03] },
  mouse: { position: [2.45, 0.82, 2.47], target: [1.38, 0.23, 1.22] },
  "external-ssd": { position: [2.75, 0.81, 2.48], target: [1.83, 0.21, 1.16] },
  "sata-ssd": { position: [3.91, 1.48, 2.38], target: [2.94, 0.95, 0.34] },
  "nvme-ssd": { position: [3.97, 1.63, 2.32], target: [2.95, 1.05, -0.02] },
  ram: { position: [3.88, 1.78, 2.38], target: [2.94, 1.34, 0.06] },
  gpu: { position: [4.02, 1.57, 2.58], target: [2.94, 1.03, 0.02] },
  hdd: { position: [3.9, 1.38, 2.5], target: [2.92, 0.8, 0.34] },
};
