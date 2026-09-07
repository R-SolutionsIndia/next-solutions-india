"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`${styles.header} ${styles.dark}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logoLink} aria-label="Next Solutions home" onClick={() => setOpen(false)}>
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
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className={styles.requestLink} href="/products">
          Request Price
          <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
        </Link>

        <button
          className={styles.menuButton}
          ref={menuButton}
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
            <Link
              href={item.href}
              key={item.href}
              className={pathname.startsWith(item.href) ? styles.active : undefined}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className={styles.mobileRequest} href="/products" onClick={() => setOpen(false)}>
            Request Price
            <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
