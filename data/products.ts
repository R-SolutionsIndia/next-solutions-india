export const productCategories = [
  { slug: "ssd", label: "SSD", singularLabel: "Solid-state drive" },
  { slug: "hdd", label: "HDD", singularLabel: "Hard disk drive" },
  { slug: "ram", label: "RAM", singularLabel: "Desktop memory" },
  { slug: "graphics", label: "Graphics", singularLabel: "Graphics card" },
  { slug: "nas", label: "NAS", singularLabel: "Network storage" },
  { slug: "printers", label: "Printers", singularLabel: "Printer" },
] as const;

export type ProductCategory = (typeof productCategories)[number]["slug"];

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  name: string;
  model: string;
  sku: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  sourceUrl: string;
  imageSourceUrl: string;
  storefrontImageUrl?: string;
  verifiedOn: string;
  specs: ProductSpec[];
  cardSpecs: ProductSpec[];
  filters: Record<string, string>;
  compatibility: string[];
  warranty?: string;
};

export type CatalogProduct = Pick<
  Product,
  | "id"
  | "slug"
  | "category"
  | "brand"
  | "name"
  | "model"
  | "sku"
  | "image"
  | "imageAlt"
  | "cardSpecs"
  | "filters"
>;

export type CatalogFilterDefinition = {
  key: string;
  label: string;
};

export const categoryFilters: Record<
  ProductCategory,
  readonly CatalogFilterDefinition[]
> = {
  ssd: [
    { key: "capacity", label: "Capacity" },
    { key: "driveType", label: "Type" },
    { key: "formFactor", label: "Form factor" },
    { key: "interface", label: "Interface" },
  ],
  hdd: [
    { key: "capacity", label: "Capacity" },
    { key: "formFactor", label: "Form factor" },
    { key: "interface", label: "Interface" },
    { key: "rotationalSpeed", label: "Rotational speed" },
  ],
  ram: [
    { key: "capacity", label: "Capacity" },
    { key: "memoryGeneration", label: "Memory type" },
    { key: "formFactor", label: "Form factor" },
    { key: "speed", label: "Speed" },
  ],
  graphics: [
    { key: "graphicsMemory", label: "Graphics memory" },
    { key: "memoryType", label: "Memory type" },
    { key: "interface", label: "Interface" },
  ],
  nas: [
    { key: "bayCount", label: "Drive bays" },
    { key: "suppliedDrives", label: "Drives supplied" },
    { key: "expansion", label: "Expansion" },
  ],
  printers: [
    { key: "output", label: "Output" },
    { key: "function", label: "Function" },
    { key: "connectivity", label: "Connectivity" },
  ],
};

export const products: readonly Product[] = [
  {
    id: "wd-blue-sa510-1tb",
    slug: "wd-blue-sa510-sata-ssd-1tb",
    category: "ssd",
    brand: "Western Digital",
    name: "WD Blue SA510 SATA SSD",
    model: "WD Blue SA510",
    sku: "WDS100T3B0A",
    shortDescription:
      "A 1TB internal SATA solid-state drive in a slim 2.5-inch format.",
    image: "/products/wd-blue-sa510-1tb.jpg",
    imageAlt: "WD Blue SA510 1TB 2.5-inch SATA solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/western-digital-wd-blue-sa510-sata-1tb-up-to-560mbs-25-inch7-mm-5y-warranty-internal-solid-state-drive-ssd-wds100t3b0a",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/uOFeJGOOgRNYKsx2rI8SHqWM0i1S3ndQZ0YH0C4F.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Form factor", value: "2.5-inch / 7mm" },
      { label: "Interface", value: "SATA" },
      { label: "Sequential read", value: "Up to 560 MB/s" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "1TB" },
      { label: "Form factor", value: "2.5-inch / 7mm" },
      { label: "Interface", value: "SATA" },
    ],
    filters: {
      capacity: "1TB",
      driveType: "Internal SATA",
      formFactor: "2.5-inch / 7mm",
      interface: "SATA",
    },
    compatibility: [
      "Requires a system with a 2.5-inch 7mm drive position and SATA connection.",
      "Confirm available SATA power and data connections before requesting.",
    ],
    warranty: "5 years",
  },
  {
    id: "wd-black-sn770-1tb",
    slug: "wd-black-sn770-nvme-ssd-1tb",
    category: "ssd",
    brand: "Western Digital",
    name: "WD Black SN770 NVMe SSD",
    model: "WD Black SN770",
    sku: "WDS100T3X0E",
    shortDescription:
      "A 1TB PCIe Gen4 NVMe drive in the M.2 2280 format for compatible desktops and laptops.",
    image: "/products/wd-black-sn770-1tb.jpg",
    imageAlt: "WD Black SN770 1TB M.2 NVMe solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/western-digital-wd-black-sn770-nvme-1tb-upto-5150mbs-5y-warranty-pcie-gen-4-nvme-m2-2280-gaming-storage-internal-solid-state-drive-ssd-wds100t3x0e",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/wTYdUgVCMvt1K4vXBDGpYhFh2fmwAxJdXweOmWTF.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Form factor", value: "M.2 2280" },
      { label: "Interface", value: "PCIe Gen4 NVMe" },
      { label: "Sequential read", value: "Up to 5,150 MB/s" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "1TB" },
      { label: "Form factor", value: "M.2 2280" },
      { label: "Interface", value: "PCIe Gen4 NVMe" },
    ],
    filters: {
      capacity: "1TB",
      driveType: "Internal NVMe",
      formFactor: "M.2 2280",
      interface: "PCIe Gen4 NVMe",
    },
    compatibility: [
      "Requires an M.2 2280 slot that supports PCIe NVMe storage.",
      "Confirm the host system's supported PCIe generation and M.2 clearance.",
    ],
    warranty: "5 years",
  },
  {
    id: "samsung-990-pro-2tb",
    slug: "samsung-990-pro-ssd-2tb",
    category: "ssd",
    brand: "Samsung",
    name: "Samsung 990 PRO SSD",
    model: "990 PRO",
    sku: "MZ-V9P2T0BW",
    shortDescription:
      "A 2TB PCIe 4.0 M.2 NVMe solid-state drive rated for up to 7,450 MB/s reads.",
    image: "/products/samsung-990-pro-2tb.jpg",
    imageAlt: "Samsung 990 PRO 2TB M.2 NVMe solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/samsung-990-pro-ssd-2tb-pcie-40-m2-internal-solid-state-drive-fastest-speed-for-gaming-heat-control-direct-storage-and-memory-expansion-for-video-editing-heavy-graphics-mz-v9p2t0bw",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/q5i3lhLrhBxSzplujxF6K9pX7x7VBoyvCkkpnpUR.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "2TB" },
      { label: "Form factor", value: "M.2" },
      { label: "Interface", value: "PCIe 4.0 NVMe" },
      { label: "Sequential read", value: "Up to 7,450 MB/s" },
      { label: "Sequential write", value: "Up to 6,900 MB/s" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "2TB" },
      { label: "Interface", value: "PCIe 4.0 NVMe" },
      { label: "Read speed", value: "Up to 7,450 MB/s" },
    ],
    filters: {
      capacity: "2TB",
      driveType: "Internal NVMe",
      formFactor: "M.2",
      interface: "PCIe 4.0 NVMe",
    },
    compatibility: [
      "Requires a host with an M.2 slot that supports PCIe NVMe storage.",
      "Check motherboard clearance and thermal requirements before requesting.",
    ],
  },
  {
    id: "lexar-nm620-1tb",
    slug: "lexar-nm620-m2-ssd-1tb",
    category: "ssd",
    brand: "Lexar",
    name: "Lexar NM620 M.2 SSD",
    model: "NM620",
    sku: "LNM620X001T-RNNNU",
    shortDescription:
      "A 1TB M.2 2280 PCIe Gen3x4 NVMe drive for compatible PCs.",
    image: "/products/lexar-nm620-1tb.jpg",
    imageAlt: "Lexar NM620 1TB M.2 2280 solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/lexar-nm620-1tb-m2-2280-pcie-internal-ssd-up-to-3300mbs-read-for-pc-lnm620x001t-rnnnu",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/5d1aIysrSDvIM56aRoW0BAQBVTdPfPfviQorQIvk.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Form factor", value: "M.2 2280" },
      { label: "Interface", value: "PCIe Gen3x4 / NVMe 1.4" },
      { label: "Sequential read", value: "Up to 3,300 MB/s" },
      { label: "Sequential write", value: "Up to 3,000 MB/s" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "1TB" },
      { label: "Interface", value: "PCIe Gen3x4" },
      { label: "Read speed", value: "Up to 3,300 MB/s" },
    ],
    filters: {
      capacity: "1TB",
      driveType: "Internal NVMe",
      formFactor: "M.2 2280",
      interface: "PCIe Gen3x4 / NVMe 1.4",
    },
    compatibility: [
      "Requires an M.2 2280 slot that supports PCIe NVMe storage.",
      "Confirm the host system's supported PCIe generation.",
    ],
  },
  {
    id: "crucial-16gb-ddr4-2666",
    slug: "crucial-16gb-ddr4-2666-desktop-memory",
    category: "ram",
    brand: "Crucial",
    name: "Crucial 16GB DDR4-2666 Desktop Memory",
    model: "Crucial DDR4-2666 UDIMM",
    sku: "CT16G4DFRA266",
    shortDescription:
      "A single 16GB DDR4-2666 desktop memory module operating at 1.2V.",
    image: "/products/crucial-16gb-ddr4-2666.jpg",
    imageAlt: "Crucial 16GB DDR4-2666 desktop memory module",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/crucial-ram-16gb-ddr4-2666mhz-desktop-memory",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/zTocy5UZYlFq0dcrks0sujDah1y49Gphdiga0Tei.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "16GB" },
      { label: "Memory type", value: "DDR4" },
      { label: "Speed", value: "2,666 MT/s" },
      { label: "Form factor", value: "Desktop DIMM" },
      { label: "Voltage", value: "1.2V" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "16GB" },
      { label: "Memory type", value: "DDR4" },
      { label: "Speed", value: "2,666 MT/s" },
    ],
    filters: {
      capacity: "16GB",
      memoryGeneration: "DDR4",
      formFactor: "Desktop DIMM",
      speed: "2,666 MT/s",
    },
    compatibility: [
      "Requires a desktop motherboard with a compatible DDR4 DIMM slot.",
      "Installed memory speed depends on the processor and motherboard configuration.",
    ],
  },
  {
    id: "zotac-rtx-3060-twin-edge",
    slug: "zotac-geforce-rtx-3060-twin-edge-12gb",
    category: "graphics",
    brand: "ZOTAC",
    name: "ZOTAC GAMING GeForce RTX 3060 Twin Edge",
    model: "GeForce RTX 3060 Twin Edge",
    sku: "ZT-A30600E-10M",
    shortDescription:
      "A dual-fan GeForce RTX 3060 graphics card with 12GB of GDDR6 memory.",
    image: "/products/zotac-rtx-3060-twin-edge.jpg",
    imageAlt: "ZOTAC GAMING GeForce RTX 3060 Twin Edge graphics card",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/zotac-gaming-ge-force-rtx-3060-twin-edge-gddr6-12gb-192-bit-pcie-30-pci-e-x16-with-ice-storm-20-cooling-1777-mhz-boost-clock-5-years-warranty-3-years-warranty-2-years-extended-warranty",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/VqAqGbqa2VsJkzyltFnpCQZ90wnVej8TH67K8eO1.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Graphics memory", value: "12GB GDDR6" },
      { label: "Memory bus", value: "192-bit" },
      { label: "Interface", value: "PCIe 3.0 x16" },
      { label: "Boost clock", value: "1,777 MHz" },
      { label: "Cooling", value: "Dual fan" },
    ],
    cardSpecs: [
      { label: "Graphics memory", value: "12GB GDDR6" },
      { label: "Interface", value: "PCIe 3.0 x16" },
      { label: "Boost clock", value: "1,777 MHz" },
    ],
    filters: {
      graphicsMemory: "12GB",
      memoryType: "GDDR6",
      interface: "PCIe 3.0 x16",
    },
    compatibility: [
      "Requires a desktop system with a PCIe x16 slot.",
      "Confirm case clearance, power-supply capacity and power connectors before requesting.",
    ],
    warranty: "3 years standard plus 2 years extended, subject to registration terms",
  },
  {
    id: "zotac-rtx-4070-super-trinity",
    slug: "zotac-rtx-4070-super-trinity-black-edition",
    category: "graphics",
    brand: "ZOTAC",
    name: "ZOTAC GAMING GeForce RTX 4070 SUPER Trinity Black Edition",
    model: "GeForce RTX 4070 SUPER Trinity Black Edition",
    sku: "ZT-D40720D-10P",
    shortDescription:
      "A GeForce RTX 4070 SUPER graphics card with 12GB GDDR6X memory and a triple-fan cooler.",
    image: "/products/zotac-rtx-4070-super-trinity.jpg",
    imageAlt:
      "ZOTAC GAMING GeForce RTX 4070 SUPER Trinity Black Edition graphics card",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/zotac-gaming-geforce-rtx-4070-super-trinity-gddr6x-black-edition-192bit-pcie-4-graphics-card-with-2475mhz-boost-clock-2-years-warranty-3-years-extended-warranty",
    imageSourceUrl:
      "https://www.primeabgb.com/wp-content/uploads/2025/08/ZOTAC-GAMING-GeForce-RTX-4070-SUPER-Trinity-Black-Edition-12GB-GDDR6X-Graphic-Card-ZT-D40720D-10P.jpg",
    storefrontImageUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/NP3U7uWWgqZNYu5IBDa1HGNMosqZajkOyVhHf1s1.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Graphics memory", value: "12GB GDDR6X" },
      { label: "Memory bus", value: "192-bit" },
      { label: "Interface", value: "PCIe 4.0 x16" },
      { label: "Boost clock", value: "2,475 MHz" },
      { label: "Cooling", value: "Triple fan" },
    ],
    cardSpecs: [
      { label: "Graphics memory", value: "12GB GDDR6X" },
      { label: "Interface", value: "PCIe 4.0 x16" },
      { label: "Boost clock", value: "2,475 MHz" },
    ],
    filters: {
      graphicsMemory: "12GB",
      memoryType: "GDDR6X",
      interface: "PCIe 4.0 x16",
    },
    compatibility: [
      "Requires a desktop system with a PCIe x16 slot.",
      "Confirm case clearance, power-supply capacity and power connectors before requesting.",
    ],
    warranty: "2 years standard plus 3 years extended, subject to registration terms",
  },
  {
    id: "samsung-t7-shield-1tb",
    slug: "samsung-t7-shield-portable-ssd-1tb",
    category: "ssd",
    brand: "Samsung",
    name: "Samsung T7 Shield Portable SSD",
    model: "T7 Shield",
    sku: "MU-PE1T0S/WW",
    shortDescription:
      "A rugged 1TB portable SSD with USB 3.2 Gen 2 connectivity and an IP65 rating.",
    image: "/products/samsung-t7-shield-1tb.jpg",
    imageAlt: "Samsung T7 Shield 1TB portable solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/samsung-t7-shield-1tb-portable-ssd-up-to-1050mbs-usb-32-gen2-rugged-ip65-water-dust-resistant-for-photographers-content-creators-and-gaming-extenal-solid-state-drive-mu-pe1t0sww-black",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/1OnpyBdW27HiwgNkU7EjnVqw4cGU7Vu03mupDaEn.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Interface", value: "USB 3.2 Gen 2" },
      { label: "Sequential read", value: "Up to 1,050 MB/s" },
      { label: "Ingress rating", value: "IP65" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "1TB" },
      { label: "Interface", value: "USB 3.2 Gen 2" },
      { label: "Ingress rating", value: "IP65" },
    ],
    filters: {
      capacity: "1TB",
      driveType: "Portable",
      formFactor: "Portable",
      interface: "USB 3.2 Gen 2",
    },
    compatibility: [
      "Requires a compatible USB host connection.",
      "Maximum transfer speed depends on the host device, cable and workload.",
    ],
  },
  {
    id: "sandisk-extreme-portable-500gb",
    slug: "sandisk-extreme-portable-ssd-500gb",
    category: "ssd",
    brand: "SanDisk",
    name: "SanDisk Extreme Portable SSD",
    model: "Extreme Portable SSD",
    sku: "SDSSDE61-500G-G25",
    shortDescription:
      "A 500GB USB-C portable SSD rated for up to 1,050 MB/s reads and IP55 protection.",
    image: "/products/sandisk-extreme-portable-500gb.jpg",
    imageAlt: "SanDisk Extreme 500GB portable solid-state drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/sandisk-500gb-extreme-portable-ssd-1050mbs-r-1000mbs-wupto-2-meter-drop-protection-with-ip55-waterdust-resistance-hw-encryption-pcmac-typec-smartphone-compatible-5y-warranty-external-ssd",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/A5GbZlNy3d5n0JJNJ5DF4neJFCkT8elt2IwGDjDu.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "500GB" },
      { label: "Connection", value: "USB-C" },
      { label: "Sequential read", value: "Up to 1,050 MB/s" },
      { label: "Sequential write", value: "Up to 1,000 MB/s" },
      { label: "Ingress rating", value: "IP55" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "500GB" },
      { label: "Connection", value: "USB-C" },
      { label: "Ingress rating", value: "IP55" },
    ],
    filters: {
      capacity: "500GB",
      driveType: "Portable",
      formFactor: "Portable",
      interface: "USB-C",
    },
    compatibility: [
      "Requires a compatible USB host connection.",
      "Maximum transfer speed depends on the host device, cable and workload.",
    ],
    warranty: "5 years",
  },
  {
    id: "wd-blue-2tb-hdd",
    slug: "wd-blue-2tb-7200-rpm-desktop-hdd",
    category: "hdd",
    brand: "Western Digital",
    name: "WD Blue 2TB 7200 RPM Desktop HDD",
    model: "WD Blue Desktop HDD",
    sku: "WD20EZBX-SPAYRA0",
    shortDescription:
      "A 2TB 3.5-inch desktop hard drive with a 7,200 RPM spindle speed.",
    image: "/products/wd-blue-2tb-hdd.jpg",
    imageAlt: "WD Blue 2TB 7200 RPM 3.5-inch desktop hard drive",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/western-digital-blue-2tb-7200-rpm-desktop-hdd",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/Ng7f2ZGZ3CAMdPMmXeHVSKsu5Rp1JfuVbr6cjyAe.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Capacity", value: "2TB" },
      { label: "Form factor", value: "3.5-inch" },
      { label: "Interface", value: "SATA 6 Gb/s" },
      { label: "Rotational speed", value: "7,200 RPM" },
    ],
    cardSpecs: [
      { label: "Capacity", value: "2TB" },
      { label: "Form factor", value: "3.5-inch" },
      { label: "Speed", value: "7,200 RPM" },
    ],
    filters: {
      capacity: "2TB",
      formFactor: "3.5-inch",
      interface: "SATA 6 Gb/s",
      rotationalSpeed: "7,200 RPM",
    },
    compatibility: [
      "Requires a desktop chassis with a 3.5-inch drive bay and SATA connection.",
      "Confirm available SATA power and data connections before requesting.",
    ],
  },
  {
    id: "synology-ds923-plus",
    slug: "synology-diskstation-ds923-plus",
    category: "nas",
    brand: "Synology",
    name: "Synology DiskStation DS923+",
    model: "DiskStation DS923+",
    sku: "DS923+",
    shortDescription:
      "A four-bay, diskless network-attached storage enclosure with optional DX517 expansion support.",
    image: "/products/synology-ds923-plus.jpg",
    imageAlt: "Synology DiskStation DS923+ four-bay network storage enclosure",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/synology-diskstation-ds923-network-attached-storage-drive-black",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/bMPheLtRD0McGDFG0dwljTzKtTqXcQhIt7ShVeOA.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Drive bays", value: "4" },
      { label: "Drives supplied", value: "Diskless" },
      { label: "Expansion support", value: "Synology DX517" },
    ],
    cardSpecs: [
      { label: "Drive bays", value: "4" },
      { label: "Drives supplied", value: "Diskless" },
      { label: "Expansion", value: "DX517 supported" },
    ],
    filters: {
      bayCount: "4 bays",
      suppliedDrives: "Diskless",
      expansion: "DX517 supported",
    },
    compatibility: [
      "Storage drives are not included with this diskless enclosure.",
      "Confirm drive compatibility and the required storage layout before requesting.",
    ],
  },
  {
    id: "hp-laser-1008w",
    slug: "hp-laser-1008w-printer",
    category: "printers",
    brand: "HP",
    name: "HP Laser 1008w Printer",
    model: "HP Laser 1008w",
    sku: "714Z9A",
    shortDescription:
      "A compact monochrome, single-function laser printer with Wi-Fi and USB connectivity.",
    image: "/products/hp-laser-1008w.jpg",
    imageAlt: "HP Laser 1008w monochrome wireless printer",
    sourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/product/hp-laser-1008w-printer-wireless-single-function-print-hi-speed-usb-20-up-to-21-ppm-150-sheet-input-tray-100-sheet-output-tray-10000-page-duty-cycle-1-year-warranty-black-and-white-714z9a",
    imageSourceUrl:
      "https://solutionsindiaonline.abacisoftware.com/public/uploads/all/oHmb4TnYBkINgADA1S7PiYVF5S7g8iDkXy8yjtr0.jpg",
    verifiedOn: "2026-07-10",
    specs: [
      { label: "Print output", value: "Monochrome" },
      { label: "Function", value: "Print only" },
      { label: "Print speed", value: "Up to 21 ppm" },
      { label: "Connectivity", value: "Wi-Fi and USB 2.0" },
      { label: "Input tray", value: "150 sheets" },
      { label: "Output tray", value: "100 sheets" },
      { label: "Duty cycle", value: "Up to 10,000 pages" },
    ],
    cardSpecs: [
      { label: "Output", value: "Monochrome" },
      { label: "Speed", value: "Up to 21 ppm" },
      { label: "Connectivity", value: "Wi-Fi + USB" },
    ],
    filters: {
      output: "Monochrome",
      function: "Print only",
      connectivity: "Wi-Fi + USB",
    },
    compatibility: [
      "Supports connection over Wi-Fi or Hi-Speed USB 2.0.",
      "Confirm operating-system and network requirements before requesting.",
    ],
    warranty: "1 year",
  },
];

export const catalogProducts: readonly CatalogProduct[] = products.map(
  ({
    id,
    slug,
    category,
    brand,
    name,
    model,
    sku,
    image,
    imageAlt,
    cardSpecs,
    filters,
  }) => ({
    id,
    slug,
    category,
    brand,
    name,
    model,
    sku,
    image,
    imageAlt,
    cardSpecs,
    filters,
  }),
);

const categorySlugSet = new Set<ProductCategory>(
  productCategories.map((category) => category.slug),
);

export function isProductCategory(value: string): value is ProductCategory {
  return categorySlugSet.has(value as ProductCategory);
}

export function getCategoryDefinition(category: ProductCategory) {
  return productCategories.find((item) => item.slug === category)!;
}

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function getProduct(category: string, slug: string) {
  if (!isProductCategory(category)) return undefined;

  return products.find(
    (product) => product.category === category && product.slug === slug,
  );
}
