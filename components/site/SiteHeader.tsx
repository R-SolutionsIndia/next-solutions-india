"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./site.module.css";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={`${styles.header} ${styles.dark}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logoLink} aria-label="Next Solutions home">
          <span className={styles.logoMark} aria-hidden="true">
            <Image
              src="/brand/next-solutions-logo.jpeg"
              alt=""
              width={476}
              height={352}
              priority
              className={styles.logoSource}
            />
          </span>
          <span className={styles.wordmark}>
            <strong>NEXT SOLUTIONS</strong>
            <small>Built for What&apos;s Next</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={pathname.startsWith(item.href) ? styles.active : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className={styles.requestLink} href="/products">
          Request Price
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/products" onClick={() => setOpen(false)}>
            Request Price
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
