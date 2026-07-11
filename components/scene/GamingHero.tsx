"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const focusTower = useSceneStore((state) => state.focusTower);
  const focus = useSceneStore((state) => state.focus);

  return (
    <div className={styles.fallback} aria-label="Gaming setup product explorer">
      <div className={styles.fallbackPoster} aria-hidden="true" />
      <div className={styles.fallbackActions}>
        {focus === "overview" ? (
          <>
            <button className={styles.fallbackButton} onClick={focusTower} type="button">
              Open tower
            </button>
            <button className={styles.fallbackButton} onClick={() => inspectProduct("monitor")} type="button">
              Monitor
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
        )}
      </div>
    </div>
  );
}

function ProductDrawer({ productId }: { productId: ProductTarget }) {
  const product = SCENE_PRODUCTS[productId];
  const closeDrawer = useSceneStore((state) => state.closeDrawer);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeDrawer, productId]);

  return (
    <aside
      className={styles.drawer}
      aria-label={`${product.name} details`}
      aria-modal="true"
      role="dialog"
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
          <p className={styles.brandLabel}>Useful catalogue filters</p>
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
          {product.brands.length > 0 ? "Configure options" : "Browse verified products"}
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

export default function GamingHero({ className = "" }: { className?: string }) {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const drawerProduct = useSceneStore((state) => state.drawerProduct);
  const focus = useSceneStore((state) => state.focus);
  const hasEntered = useSceneStore((state) => state.hasEntered);
  const enterScene = useSceneStore((state) => state.enterScene);
  const focusTower = useSceneStore((state) => state.focusTower);
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
      aria-labelledby="gaming-hero-title"
    >
      <div className={styles.canvasShell}>
        {webGLAvailable === false ? <StaticFallback /> : <GamingCanvas />}
      </div>

      <div className={styles.copy} inert={focus !== "overview" ? true : undefined}>
        <h1 className={styles.title} id="gaming-hero-title">
          Built for What&apos;s Next.
        </h1>
        <p className={styles.lede}>
          Explore the setup. Inspect the hardware. Find the right configuration.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryAction} onClick={enterScene} type="button">
            Explore setup
          </button>
          <Link className={styles.secondaryAction} href="/products">
            Browse products
          </Link>
        </div>
      </div>

      {focus !== "overview" && drawerProduct === null ? (
        <button className={styles.backControl} onClick={resetScene} type="button">
          <span aria-hidden="true">←</span> Return to setup
        </button>
      ) : null}

      {focus === "tower" ? (
        <>
          <p className={styles.modeLabel} aria-live="polite">
            <span>Case open</span>
            Select a component
          </p>
          <div className={styles.componentRail} aria-label="Tower components">
            {internalComponents.map(([target, label], index) => (
              <button key={target} type="button" onClick={() => inspectProduct(target)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {focus === "overview" ? (
        <div className={styles.mobileSceneMenu} aria-label="Explore setup hardware">
          <button type="button" onClick={focusTower}>Tower</button>
          <button type="button" onClick={() => inspectProduct("monitor")}>Monitors</button>
          <button type="button" onClick={() => inspectProduct("keyboard")}>Keyboard</button>
          <button type="button" onClick={() => inspectProduct("mouse")}>Mouse</button>
          <button type="button" onClick={() => inspectProduct("external-ssd")}>External SSD</button>
        </div>
      ) : null}

      <div
        className={styles.dragHint}
        style={{ opacity: hasEntered || focus !== "overview" ? 0 : 1 }}
        aria-hidden="true"
      >
        <span className={styles.dragGlyph}>← ◉ →</span>
        <span>Drag to inspect</span>
      </div>

      <p className={styles.representative}>Representative gaming setup</p>
      {drawerProduct ? <ProductDrawer productId={drawerProduct} /> : null}
      <p className={styles.srOnly} aria-live="polite">
        {drawerProduct ? `${SCENE_PRODUCTS[drawerProduct].name} details opened.` : ""}
      </p>
    </section>
  );
}
