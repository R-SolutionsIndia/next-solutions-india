import type { Metadata } from "next";

import styles from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: "Terms",
  description: "Website terms for the Next Solutions product catalogue.",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.legalHero}>
          <p className={styles.eyebrow}>Website information</p>
          <h1 className={styles.legalTitle}>Terms</h1>
          <p className={styles.legalIntro}>
            These terms describe how the Next Solutions product catalogue and
            email-based Request Price feature are intended to be used.
          </p>
        </header>

        <div className={styles.legalGrid}>
          <p className={styles.legalMeta}>
            Version 1.0
            <br />
            Updated 10 July 2026
          </p>
          <div className={styles.legalContent}>
            <section>
              <h2>Catalogue information</h2>
              <p>
                Product names, images, specifications, filters, and compatibility
                information are provided to support product discovery. Confirm the
                exact model, specification, compatibility, warranty, and package
                contents in the response to your enquiry before making a purchase
                decision.
              </p>
            </section>

            <section>
              <h2>Price requests</h2>
              <p>
                Request Price opens a draft in your email application. Creating or
                sending that draft is an enquiry only; it is not an accepted order,
                a reservation, a payment, or a guarantee of supply.
              </p>
              <p>
                Price, taxes, availability, delivery, lead time, warranty, and any
                other commercial terms are confirmed separately in the response.
              </p>
            </section>

            <section>
              <h2>Availability and changes</h2>
              <p>
                Products and configurations may change or become unavailable.
                Next Solutions may correct catalogue errors or update website
                content without prior notice.
              </p>
            </section>

            <section>
              <h2>Acceptable use</h2>
              <ul>
                <li>Use the website only for lawful purposes.</li>
                <li>Do not interfere with the website or attempt unauthorised access.</li>
                <li>
                  Do not use automated requests in a way that disrupts normal access.
                </li>
              </ul>
            </section>

            <section>
              <h2>Third-party names and links</h2>
              <p>
                Manufacturer and product names belong to their respective owners.
                Any third-party site linked from this website is operated under its
                own terms and privacy practices.
              </p>
            </section>

            <section>
              <h2>Website availability</h2>
              <p>
                The website may be changed, suspended, or unavailable from time to
                time. Nothing on the website should be treated as professional,
                financial, or technical advice for a specific deployment.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
