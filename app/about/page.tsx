import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how the Next Solutions website helps customers explore, compare, and request pricing for IT hardware.",
};

const steps = [
  {
    number: "01",
    title: "Explore",
    copy: "Start with the interactive setup or go directly to the product catalogue.",
  },
  {
    number: "02",
    title: "Compare",
    copy: "Narrow products by the specifications that matter to your intended setup.",
  },
  {
    number: "03",
    title: "Request",
    copy: "Choose a configuration and quantity, then review a prepared email enquiry.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Hardware, made easier to understand.</h1>
            <p className={styles.lead}>
              Next Solutions brings product discovery, specification filtering,
              and price enquiries into one clear experience.
            </p>
          </div>
          <p className={styles.heroAside}>Built for What&apos;s Next</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>How it works</p>
            <div>
              <h2 className={styles.sectionTitle}>
                From a real setup to a relevant shortlist.
              </h2>
              <p className={styles.sectionCopy}>
                The 3D workspace gives each component a recognisable context.
                The catalogue then provides the practical detail needed to
                compare available options and prepare an enquiry.
              </p>
              <div className={styles.steps}>
                {steps.map((step) => (
                  <article className={styles.step} key={step.number}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Next step</p>
            <div>
              <h2 className={styles.sectionTitle}>Find the right starting point.</h2>
              <p className={styles.sectionCopy}>
                Browse the current catalogue, or contact Next Solutions with a
                product category, configuration, and quantity.
              </p>
              <div className={styles.actionRow}>
                <Link className={styles.primaryAction} href="/products">
                  Browse products
                </Link>
                <Link className={styles.secondaryAction} href="/contact">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
