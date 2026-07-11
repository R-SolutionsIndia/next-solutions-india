import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/content/content.module.css";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Find products by manufacturer in the current Next Solutions hardware catalogue.",
};

const brandCounts = products.reduce((counts, product) => {
  counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
  return counts;
}, new Map<string, number>());

const brandIndex = Array.from(brandCounts, ([name, productCount]) => ({
  name,
  productCount,
})).sort((left, right) => left.name.localeCompare(right.name));

export default function BrandsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Find products by manufacturer.</h1>
            <p className={styles.lead}>
              Brand names on this site come from the current product catalogue.
              Search a manufacturer or browse by hardware category.
            </p>
          </div>
          <p className={styles.heroAside}>
            Availability is confirmed with each price request
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Brand search</p>
            <div>
              <h2 className={styles.sectionTitle}>Start with a name.</h2>
              <form className={styles.searchForm} action="/products" method="get">
                <label className="sr-only" htmlFor="brand-search">
                  Search products by brand
                </label>
                <input
                  className={styles.searchInput}
                  id="brand-search"
                  name="q"
                  placeholder="Search a manufacturer"
                  type="search"
                />
                <button className={styles.searchButton} type="submit">
                  Search products
                </button>
              </form>
              <p className={styles.note}>
                A listed brand or product does not guarantee current stock.
                Submit a price request to confirm the exact model, availability,
                and commercial details.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <p className={styles.sectionLabel}>Current catalogue</p>
            <div>
              <h2 className={styles.sectionTitle}>Manufacturers in the catalogue.</h2>
              <div className={styles.directory}>
                {brandIndex.map((brand) => (
                  <div className={styles.directoryRow} key={brand.name}>
                    <h3>{brand.name}</h3>
                    <p>
                      {brand.productCount} listed {brand.productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.actionRow}>
                <Link className={styles.primaryAction} href="/products">
                  View all products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
