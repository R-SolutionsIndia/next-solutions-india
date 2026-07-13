"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { useSceneStore, type ProductTarget } from "@/lib/scene-store";

import styles from "./GamingHero.module.css";
import { SCENE_PRODUCTS } from "./scene-data";

const GamingCanvas = dynamic(() => import("./GamingCanvas"), {
  ssr: false,
  loading: () => <div className={styles.loading} aria-hidden="true" />,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2"),
    );
  } catch {
    return false;
  }
}

function StaticFallback() {
  const inspectProduct = useSceneStore((state) => state.inspectProduct);
  const focusRack = useSceneStore((state) => state.focusRack);
  const focusWorkstation = useSceneStore((state) => state.focusWorkstation);
  const focus = useSceneStore((state) => state.focus);

  return (
    <div className={styles.fallback} aria-label="Interactive infrastructure lab">
      <div className={styles.fallbackPoster} aria-hidden="true" />
      <div className={styles.fallbackActions}>
        {focus === "rack" ? (
          <>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("sata-ssd")} type="button">
              SATA SSD
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("nvme-ssd")} type="button">
              NVMe SSD
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("ram")} type="button">
              Memory
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("gpu")} type="button">
              Graphics
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("hdd")} type="button">
              HDD
            </button>
          </>
        ) : focus === "workstation" ? (
          <>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("monitor")} type="button">
              Display
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("keyboard")} type="button">
              Keyboard
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("mouse")} type="button">
              Mouse
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("external-ssd")} type="button">
              External SSD
            </button>
          </>
        ) : (
          <>
            <button className={styles.fallbackButton} onClick={focusRack} type="button">
              Components
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("nas")} type="button">
              NAS
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("network-switch")} type="button">
              Network
            </button>
            <button className={styles.fallbackButton} onClick={focusWorkstation} type="button">
              Setup
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProductDrawer({ productId }: { productId: ProductTarget }) {
  const product = SCENE_PRODUCTS[productId];
  const closeDrawer = useSceneStore((state) => state.closeDrawer);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [closeDrawer, productId]);

  const trapFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <aside
      ref={drawerRef}
      className={styles.drawer}
      aria-label={`${product.name} details`}
      aria-modal="true"
      role="dialog"
      onKeyDown={trapFocus}
    >
      <button
        ref={closeRef}
        className={styles.drawerClose}
        onClick={closeDrawer}
        type="button"
        aria-label="Close product details"
      >
        ×
      </button>
      <p className={styles.drawerCategory}>{product.category}</p>
      <h2 className={styles.drawerTitle}>{product.name}</h2>
      <p className={styles.drawerDescription}>{product.description}</p>
      <ul className={styles.specList}>
        {product.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
      {product.brands.length > 0 ? (
        <>
          <p className={styles.brandLabel}>Configure by</p>
          <p className={styles.brands}>{product.brands.join("  ·  ")}</p>
        </>
      ) : null}
      {product.representative ? (
        <p className={styles.drawerNote}>
          Representative setup, not an inventory claim. Exact models and availability are confirmed
          when you request a price.
        </p>
      ) : null}
      <div className={styles.drawerActions}>
        <Link className={styles.drawerPrimary} href={product.href}>
          {product.href === "/contact"
            ? "Talk to Next Solutions"
            : product.brands.length > 0
              ? "Configure options"
              : "Browse verified products"}
        </Link>
        <button className={styles.drawerSecondary} onClick={closeDrawer} type="button">
          Return to setup
        </button>
      </div>
    </aside>
  );
}

const internalComponents: readonly [ProductTarget, string][] = [
  ["sata-ssd", "SATA SSD"],
  ["nvme-ssd", "M.2 NVMe"],
  ["ram", "Memory"],
  ["gpu", "Graphics"],
  ["hdd", "Hard drive"],
];

const workstationComponents: readonly [ProductTarget, string][] = [
  ["monitor", "Display"],
  ["keyboard", "Keyboard"],
  ["mouse", "Mouse"],
  ["external-ssd", "External SSD"],
];

function HardwareSelectorCard({
  title,
  eyebrow,
  hint,
  items,
  onSelect,
}: {
  title: string;
  eyebrow: string;
  hint: string;
  items: readonly [ProductTarget, string][];
  onSelect: (target: ProductTarget) => void;
}) {
  const titleId = title === "Choose a component"
    ? "compute-components-title"
    : "workstation-components-title";

  return (
    <section className={styles.componentSelectorCard} aria-labelledby={titleId}>
      <header className={styles.componentSelectorHeader}>
        <p className={styles.componentSelectorEyebrow}>{eyebrow}</p>
        <h2 className={styles.componentSelectorTitle} id={titleId}>
          {title}
        </h2>
        <p className={styles.componentSelectorHint}>{hint}</p>
      </header>
      <div className={styles.componentRail} aria-label={`${title} options`}>
        {items.map(([target, label], index) => (
          <button key={target} type="button" onClick={() => onSelect(target)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function GamingHero({ className = "" }: { className?: string }) {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const drawerProduct = useSceneStore((state) => state.drawerProduct);
  const focus = useSceneStore((state) => state.focus);
  const hasEntered = useSceneStore((state) => state.hasEntered);
  const enterScene = useSceneStore((state) => state.enterScene);
  const focusRack = useSceneStore((state) => state.focusRack);
  const focusWorkstation = useSceneStore((state) => state.focusWorkstation);
  const resetScene = useSceneStore((state) => state.resetScene);
  const inspectProduct = useSceneStore((state) => state.inspectProduct);
  const setReducedMotion = useSceneStore((state) => state.setReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    const capabilityFrame = window.requestAnimationFrame(() => {
      setWebGLAvailable(supportsWebGL());
    });
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => {
      window.cancelAnimationFrame(capabilityFrame);
      query.removeEventListener("change", syncPreference);
    };
  }, [setReducedMotion]);

  return (
    <section
      className={`${styles.hero} ${className}`}
      data-focus={focus}
      data-drawer-open={drawerProduct !== null ? "true" : "false"}
      aria-labelledby="infrastructure-hero-title"
    >
      <div className={styles.canvasShell} inert={drawerProduct ? true : undefined}>
        {webGLAvailable === false ? <StaticFallback /> : <GamingCanvas />}
      </div>

      <div className={styles.copy} inert={focus !== "overview" ? true : undefined}>
        <h1 className={styles.title} id="infrastructure-hero-title">
          Built for
          <br />
          What&apos;s Next.
        </h1>
        <p className={styles.lede}>
          Explore the infrastructure. Inspect the hardware. Find the right configuration.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryAction} onClick={enterScene} type="button">
            Explore infrastructure
          </button>
          <Link className={styles.secondaryAction} href="/products">
            Browse products
          </Link>
        </div>
      </div>

      {focus !== "overview" && drawerProduct === null ? (
        <button className={styles.backControl} onClick={resetScene} type="button">
          <span aria-hidden="true">←</span>{" "}
          {focus === "workstation" ? "Return to overview" : "Return to setup"}
        </button>
      ) : null}

      {focus === "rack" ? (
        <HardwareSelectorCard
          eyebrow="Compute tray deployed"
          hint="Select installed hardware to inspect it."
          items={internalComponents}
          onSelect={inspectProduct}
          title="Choose a component"
        />
      ) : focus === "workstation" ? (
        <HardwareSelectorCard
          eyebrow="Operator setup"
          hint="Select hardware on the desk or use the choices below."
          items={workstationComponents}
          onSelect={inspectProduct}
          title="Choose workstation hardware"
        />
      ) : null}

      {focus === "overview" ? (
        <div className={styles.mobileSceneMenu} aria-label="Explore infrastructure hardware">
          <button type="button" onClick={focusRack}>Components</button>
          <button type="button" onClick={() => inspectProduct("nas")}>NAS</button>
          <button type="button" onClick={() => inspectProduct("network-switch")}>Network</button>
          <button type="button" onClick={focusWorkstation}>Setup</button>
        </div>
      ) : null}

      <div
        className={styles.dragHint}
        style={{ opacity: hasEntered || focus !== "overview" ? 0 : 1 }}
        aria-hidden="true"
      >
        <span className={styles.dragGlyph}>← ◉ →</span>
        <span>Drag to inspect infrastructure</span>
      </div>

      {focus === "overview" ? (
        <p className={styles.representative}>Representative infrastructure lab</p>
      ) : null}
      {drawerProduct ? <ProductDrawer productId={drawerProduct} /> : null}
      <p className={styles.srOnly} aria-live="polite">
        {drawerProduct ? `${SCENE_PRODUCTS[drawerProduct].name} details opened.` : ""}
      </p>
    </section>
  );
}
