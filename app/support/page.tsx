import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help with product selection, price requests, and billing enquiries at Next Solutions.",
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Help at each decision point.</h1>
            <p className={styles.lead}>
              Use the catalogue to narrow your options, then send the exact
              configuration and quantity you want checked.
            </p>
          </div>
          <p className={styles.heroAside}>Product selection · Enquiries · Billing</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Request support</p>
            <div>
              <h2 className={styles.sectionTitle}>Choose the closest route.</h2>
              <div className={styles.contactList}>
                <article className={styles.contactRow}>
                  <h2>Product selection</h2>
                  <p>
                    Share the intended use, key requirements, quantity, and any
                    models already under consideration.
                  </p>
                  <a
                    className={styles.emailLink}
                    href="mailto:orders@solutionsind.com?subject=Product%20selection%20help%20%E2%80%94%20Next%20Solutions"
                  >
                    orders@solutionsind.com
                  </a>
                </article>
                <article className={styles.contactRow}>
                  <h2>Billing</h2>
                  <p>
                    Use the billing inbox for invoice or accounts-related questions.
                  </p>
                  <a
                    className={styles.emailLink}
                    href="mailto:accounts@solutionsind.com?subject=Billing%20enquiry%20%E2%80%94%20Next%20Solutions"
                  >
                    accounts@solutionsind.com
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Common questions</p>
            <div>
              <h2 className={styles.sectionTitle}>How the enquiry flow works.</h2>
              <div className={styles.faq}>
                <details>
                  <summary>How do I request a price?</summary>
                  <p>
                    Select a listed product, choose the relevant configuration and
                    quantity, then open the prepared email draft. Review and send it
                    from your email application to complete the enquiry.
                  </p>
                </details>
                <details>
                  <summary>Does this website take payment?</summary>
                  <p>
                    No. The current website prepares an email enquiry only. A draft
                    is not a purchase, payment, or confirmed order.
                  </p>
                </details>
                <details>
                  <summary>How do I confirm availability?</summary>
                  <p>
                    Send a price request for the exact model, configuration, and
                    quantity. Availability is confirmed in the response.
                  </p>
                </details>
                <details>
                  <summary>What if I do not know the exact model?</summary>
                  <p>
                    Send the category, intended use, must-have specifications,
                    quantity, and delivery city to orders@solutionsind.com.
                  </p>
                </details>
              </div>
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
