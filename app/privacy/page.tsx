import type { Metadata } from "next";

import styles from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Next Solutions website.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.legalHero}>
          <p className={styles.eyebrow}>Website information</p>
          <h1 className={styles.legalTitle}>Privacy</h1>
          <p className={styles.legalIntro}>
            This page explains what happens to information when you browse the
            Next Solutions website or choose to send an email enquiry.
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
              <h2>Email enquiries</h2>
              <p>
                The Request Price feature prepares a draft in your email
                application. Information in that draft is not sent to Next
                Solutions until you review and send the message yourself.
              </p>
              <p>
                A product enquiry may include your name, reply email, phone or
                WhatsApp number, delivery city, company or GST name, selected
                product details, quantity, and notes. Information you send is used
                to review and respond to that enquiry.
              </p>
            </section>

            <section>
              <h2>Website operation</h2>
              <p>
                Hosting and security providers may process basic technical data,
                such as an IP address, browser information, requested pages, and
                timestamps, to deliver and protect the website.
              </p>
              <p>
                The current website does not provide user accounts, website
                checkout, or website payment collection.
              </p>
            </section>

            <section>
              <h2>Sharing and retention</h2>
              <p>
                Information may be handled by service providers needed to operate
                email and website infrastructure. It may also be retained when
                reasonably needed to respond to a request, maintain related
                business records, or meet applicable obligations.
              </p>
            </section>

            <section>
              <h2>Your choices</h2>
              <p>
                You decide whether to send a prepared email draft and which
                optional details to include. To ask about information contained in
                an enquiry, reply to the relevant email thread so the request can
                be identified.
              </p>
            </section>

            <section>
              <h2>Changes</h2>
              <p>
                This notice may be updated as the website changes. It will be
                revised before introducing analytics, user accounts, payments, or
                site-submitted forms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
