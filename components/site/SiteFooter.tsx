import Link from "next/link";
import styles from "./site.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <strong>NEXT SOLUTIONS</strong>
          <p>Built for What&apos;s Next.</p>
          <span className={styles.footerCopyright}>
            © {new Date().getFullYear()} Next Solutions
          </span>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/products">Products</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className={styles.footerContact}>
          <span>Product enquiries</span>
          <a href="mailto:orders@solutionsind.com">orders@solutionsind.com</a>
        </div>
      </div>
    </footer>
  );
}
