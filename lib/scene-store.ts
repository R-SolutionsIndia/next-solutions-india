import { create } from "zustand";

export type SceneTarget =
  | "overview"
  | "rack"
  | "workstation"
  | "nas"
  | "network-switch"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "external-ssd"
  | "sata-ssd"
  | "nvme-ssd"
  | "ram"
  | "gpu"
  | "hdd";

export type ProductTarget = Exclude<SceneTarget, "overview" | "rack" | "workstation">;

type ParentFocus = "overview" | "rack" | "workstation";

type SceneState = {
  focus: SceneTarget;
  drawerProduct: ProductTarget | null;
  parentFocus: ParentFocus;
  hasEntered: boolean;
  reducedMotion: boolean;
  enterScene: () => void;
  focusRack: () => void;
  focusWorkstation: () => void;
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

const WORKSTATION_PRODUCTS = new Set<ProductTarget>([
  "monitor",
  "keyboard",
  "mouse",
  "external-ssd",
]);

let drawerTimer: ReturnType<typeof setTimeout> | null = null;

function clearDrawerTimer() {
  if (drawerTimer === null) return;
  clearTimeout(drawerTimer);
  drawerTimer = null;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  focus: "overview",
  drawerProduct: null,
  parentFocus: "overview",
  hasEntered: false,
  reducedMotion: false,
  enterScene: () => {
    clearDrawerTimer();
    set({ focus: "rack", drawerProduct: null, parentFocus: "rack", hasEntered: true });
  },
  focusRack: () => {
    clearDrawerTimer();
    set({ focus: "rack", drawerProduct: null, parentFocus: "rack", hasEntered: true });
  },
  focusWorkstation: () => {
    clearDrawerTimer();
    set({
      focus: "workstation",
      drawerProduct: null,
      parentFocus: "workstation",
      hasEntered: true,
    });
  },
  inspectProduct: (target) => {
    clearDrawerTimer();
    const currentFocus = get().focus;
    const parentFocus: ParentFocus =
      currentFocus === "rack" || INTERNAL_PRODUCTS.has(currentFocus as ProductTarget)
        ? "rack"
        : currentFocus === "workstation" ||
            WORKSTATION_PRODUCTS.has(currentFocus as ProductTarget)
          ? "workstation"
          : "overview";

    set({ focus: target, drawerProduct: null, parentFocus, hasEntered: true });
    drawerTimer = setTimeout(
      () => {
        set((state) =>
          state.focus === target ? { drawerProduct: target } : { drawerProduct: null },
        );
        drawerTimer = null;
      },
      get().reducedMotion ? 0 : 640,
    );
  },
  closeDrawer: () => {
    clearDrawerTimer();
    set({
      drawerProduct: null,
      focus: get().parentFocus,
    });
  },
  resetScene: () => {
    clearDrawerTimer();
    set({
      focus: "overview",
      drawerProduct: null,
      parentFocus: "overview",
      hasEntered: true,
    });
  },
  setReducedMotion: (value) => set({ reducedMotion: value }),
}));
