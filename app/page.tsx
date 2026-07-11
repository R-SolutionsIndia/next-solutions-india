import Link from "next/link";
import GamingHero from "@/components/scene/GamingHero";
import styles from "./page.module.css";

const categories = [
  ["SSD", "/products/ssd"],
  ["HDD", "/products/hdd"],
  ["NAS", "/products/nas"],
  ["Memory", "/products/ram"],
  ["Graphics", "/products/graphics"],
  ["Printers", "/products/printers"],
] as const;

const steps = [
  ["01", "Explore", "Inspect the setup or start directly in the product catalogue."],
  ["02", "Configure", "Narrow real products using verified specifications and compatibility."],
  ["03", "Request", "Open a complete price-request draft in your own email app."],
] as const;

export default function HomePage() {
  return (
    <main className={styles.home}>
      <GamingHero />

      <section className={styles.categorySection} aria-labelledby="category-heading">
        <div className={styles.sectionShell}>
          <h2 id="category-heading">Browse categories</h2>
          <div className={styles.categoryRail}>
            {categories.map(([label, href]) => (
              <Link href={href} key={label}>
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
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
              The 3D setup helps you understand where hardware belongs. The catalogue helps you
              choose the exact model.
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
          <Link href="/products">Browse all products</Link>
        </div>
      </section>
    </main>
  );
}
