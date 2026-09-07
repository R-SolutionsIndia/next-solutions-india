import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import GamingHero from "@/components/scene/GamingHero";
import styles from "./page.module.css";

const categories = [
  ["SSD", "/products/ssd", "/products/samsung-990-pro-2tb.jpg"],
  ["HDD", "/products/hdd", "/products/wd-blue-2tb-hdd.jpg"],
  ["NAS", "/products/nas", "/products/synology-ds923-plus.jpg"],
  ["Memory", "/products/ram", "/products/crucial-16gb-ddr4-2666.jpg"],
  ["Graphics", "/products/graphics", "/products/zotac-rtx-3060-twin-edge.jpg"],
  ["Printers", "/products/printers", "/products/hp-laser-1008w.jpg"],
] as const;

const steps = [
  ["01", "Explore", "Inspect the setup or start directly in the product catalogue."],
  ["02", "Configure", "Narrow real products using specifications and compatibility."],
  ["03", "Request", "Open a complete price-request draft in your own email app."],
] as const;

export default function HomePage() {
  return (
    <main className={styles.home}>
      <GamingHero />

      <section className={styles.categorySection} aria-labelledby="category-heading">
        <div className={styles.sectionShell}>
          <div className={styles.categoryIntro}>
            <h2 id="category-heading">Good hardware.<br />The right fit.</h2>
            <div>
              <p>Explore our range, from everyday upgrades to business infrastructure.</p>
              <Link href="/products">Browse all products <ArrowRight size={20} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className={styles.categoryRail}>
            {categories.map(([label, href, image], index) => (
              <Link href={href} key={label}>
                <div className={styles.categoryImage}>
                  <Image src={image} alt="" fill sizes="(max-width: 680px) 45vw, 30vw" />
                </div>
                <div className={styles.categoryCaption}>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <span>{label}</span>
                  <ArrowRight size={21} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-heading">
        <div className={styles.sectionShell}>
          <div className={styles.sectionIntro}>
            <h2 id="process-heading">A clearer path to the right hardware.</h2>
            <p>
              Explore the setup. Compare the details. Request the configuration that works for you.
            </p>
          </div>
          <ol className={styles.steps}>
            {steps.map(([number, title, description]) => (
              <li key={number}>
                <span className="mono">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.sectionShell}>
          <h2>Start with the hardware you need.</h2>
          <Link href="/products">Browse all products <ArrowRight size={22} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
