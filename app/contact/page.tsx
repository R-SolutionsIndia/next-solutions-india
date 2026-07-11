import type { Metadata } from "next";

import styles from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Next Solutions for product price requests and billing enquiries.",
};

const productSubject = encodeURIComponent("Product enquiry — Next Solutions");
const billingSubject = encodeURIComponent("Billing enquiry — Next Solutions");

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Start with the right inbox.</h1>
            <p className={styles.lead}>
              Send product and price requests to Orders. Use Accounts only for
              billing-related enquiries.
            </p>
          </div>
          <p className={styles.heroAside}>Next Solutions</p>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>Contact</p>
          <div className={styles.contactList}>
            <article className={styles.contactRow}>
              <h2>Product enquiries</h2>
              <p>
                Include the product category or model, preferred configuration,
                quantity, and delivery city.
              </p>
              <a
                className={styles.emailLink}
                href={`mailto:orders@solutionsind.com?subject=${productSubject}`}
              >
                orders@solutionsind.com
              </a>
            </article>
            <article className={styles.contactRow}>
              <h2>Billing enquiries</h2>
              <p>
                Include the relevant invoice or reference details when available.
                Do not send payment-card information by email.
              </p>
              <a
                className={styles.emailLink}
                href={`mailto:accounts@solutionsind.com?subject=${billingSubject}`}
              >
                accounts@solutionsind.com
              </a>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Before you send</p>
            <div>
              <h2 className={styles.sectionTitle}>A few details make the request clearer.</h2>
              <ul className={styles.checklist}>
                <li data-index="01">Product name, model, SKU, or category</li>
                <li data-index="02">Required specifications or use case</li>
                <li data-index="03">Quantity</li>
                <li data-index="04">Delivery city or postcode</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
