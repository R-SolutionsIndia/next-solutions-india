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
  nas: {
    name: "4-bay network storage",
    category: "Network-attached storage",
    description:
      "Centralise team files, backups and shared workloads in a compact four-bay enclosure.",
    specs: ["4 hot-swap bays", "Diskless configuration", "Expansion-ready"],
    brands: ["Drive bays", "Supplied drives", "Expansion"],
    href: "/products/nas",
    representative: true,
  },
  "network-switch": {
    name: "24-port network switch",
    category: "Representative infrastructure",
    description:
      "A managed switching layer connects the rack, storage and operator workstation.",
    specs: ["24-port class", "Rack-mount format", "Managed-network ready"],
    brands: [],
    href: "/contact",
    representative: true,
  },
  monitor: {
    name: "Operator display",
    category: "Representative workstation",
    description: "A professional display for infrastructure monitoring and daily operations.",
    specs: ["34-inch ultrawide class", "DisplayPort / HDMI class", "VESA-style stand"],
    brands: [],
    href: "/products",
    representative: true,
  },
  keyboard: {
    name: "Operator keyboard",
    category: "Representative workstation",
    description: "A compact wired keyboard for the adjacent infrastructure console.",
    specs: ["Compact layout", "Low-profile keys", "Wired workstation"],
    brands: [],
    href: "/products",
    representative: true,
  },
  mouse: {
    name: "Operator mouse",
    category: "Representative workstation",
    description: "A representative ergonomic mouse for the infrastructure console.",
    specs: ["Ergonomic shell", "Optical-sensor class", "Wired workstation"],
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
    description: "A WD Blue SA510-class 2.5-inch SATA drive, shown on the compute service tray.",
    specs: ["2.5-inch / 7 mm", "SATA III", "1 TB catalogue option"],
    brands: ["Brand", "Capacity", "Read speed"],
    href: "/products/ssd?driveType=Internal+SATA",
    representative: true,
  },
  "nvme-ssd": {
    name: "M.2 NVMe SSD",
    category: "Internal storage",
    description: "A WD Black SN770-class M.2 drive, released from its standoff before removal.",
    specs: ["M.2 2280", "PCIe Gen4 NVMe", "1 TB catalogue option"],
    brands: ["Brand", "Capacity", "PCIe generation"],
    href: "/products/ssd?driveType=Internal+NVMe",
    representative: true,
  },
  ram: {
    name: "Desktop memory",
    category: "Memory",
    description: "Compare desktop kits by generation, capacity, speed and latency.",
    specs: ["Desktop UDIMM", "16 GB catalogue option", "DDR4-2666"],
    brands: ["Brand", "Capacity", "Speed"],
    href: "/products/ram",
    representative: true,
  },
  gpu: {
    name: "Graphics cards",
    category: "Graphics",
    description: "Choose by chipset, VRAM, dimensions and power requirement.",
    specs: ["Dual / triple-fan options", "PCIe x16", "12 GB catalogue options"],
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
  overview: { position: [5, 2.88, 6.2], target: [1.55, 1.48, -0.08] },
  rack: { position: [4.25, 2.58, 4.5], target: [1.25, 1.78, 0.62] },
  workstation: { position: [6.72, 2.92, 5.36], target: [3.72, 1.34, 0.48] },
  nas: { position: [3.55, 2.72, 4.7], target: [-0.72, 2.48, 1.78] },
  "network-switch": { position: [3.58, 3.2, 4.68], target: [-0.72, 2.9, 1.78] },
  monitor: { position: [5.1, 2.42, 4.95], target: [2.2, 1.82, 1.42] },
  keyboard: { position: [5.02, 1.98, 4.72], target: [2.35, 1.4, 1.52] },
  mouse: { position: [5.02, 1.92, 4.7], target: [2.5, 1.35, 1.56] },
  "external-ssd": { position: [5.02, 1.96, 4.68], target: [2.58, 1.38, 1.52] },
  "sata-ssd": { position: [3.48, 2.55, 4.8], target: [-0.82, 2.08, 2.34] },
  "nvme-ssd": { position: [3.48, 2.58, 4.78], target: [-0.78, 2.08, 2.34] },
  ram: { position: [3.48, 2.6, 4.8], target: [-0.84, 2.12, 2.42] },
  gpu: { position: [3.5, 2.55, 4.86], target: [-0.8, 2.12, 2.46] },
  hdd: { position: [3.5, 2.55, 4.82], target: [-0.72, 2.08, 2.38] },
};
