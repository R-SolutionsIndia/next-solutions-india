import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./site.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerIdentity}>
          <strong>NEXT SOLUTIONS</strong>
          <p>Built for What&apos;s Next.</p>
        </div>
        <nav className={styles.footerLinks} aria-label="Footer navigation">
          <Link href="/products">Products</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <div className={styles.footerContact}>
          <span>Product enquiries</span>
          <a href="mailto:orders@solutionsind.com">
            orders@solutionsind.com
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span className={styles.footerCopyright}>
          © {new Date().getFullYear()} Next Solutions
        </span>
        <span>Storage. Compute. Connectivity.</span>
      </div>
    </footer>
  );
}
