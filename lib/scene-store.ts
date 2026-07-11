import { create } from "zustand";

export type SceneTarget =
  | "overview"
  | "tower"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "external-ssd"
  | "sata-ssd"
  | "nvme-ssd"
  | "ram"
  | "gpu"
  | "hdd";

export type ProductTarget = Exclude<SceneTarget, "overview" | "tower">;

type SceneState = {
  focus: SceneTarget;
  drawerProduct: ProductTarget | null;
  hasEntered: boolean;
  reducedMotion: boolean;
  enterScene: () => void;
  focusTower: () => void;
  inspectProduct: (target: ProductTarget) => void;
  closeDrawer: () => void;
  resetScene: () => void;
  setReducedMotion: (value: boolean) => void;
};

const INTERNAL_PRODUCTS = new Set<ProductTarget>([
  "sata-ssd",
  "nvme-ssd",
  "ram",
  "gpu",
  "hdd",
]);

export const useSceneStore = create<SceneState>((set, get) => ({
  focus: "overview",
  drawerProduct: null,
  hasEntered: false,
  reducedMotion: false,
  enterScene: () =>
    set({ focus: "tower", drawerProduct: null, hasEntered: true }),
  focusTower: () =>
    set({ focus: "tower", drawerProduct: null, hasEntered: true }),
  inspectProduct: (target) =>
    set({ focus: target, drawerProduct: target, hasEntered: true }),
  closeDrawer: () => {
    const current = get().drawerProduct;
    set({
      drawerProduct: null,
      focus: current && INTERNAL_PRODUCTS.has(current) ? "tower" : "overview",
    });
  },
  resetScene: () =>
    set({ focus: "overview", drawerProduct: null, hasEntered: true }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
}));
