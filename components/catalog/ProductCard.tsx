import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { CatalogProduct } from "@/data/products";

import styles from "./catalog.module.css";

type ProductCardProps = {
  product: CatalogProduct;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const productPath = `/products/${product.category}/${product.slug}`;

  return (
    <article className={styles.productCard}>
      <Link
        className={styles.productImageLink}
        href={productPath}
        aria-label={`View ${product.name}`}
      >
        <Image
          className={styles.productImage}
          src={product.image}
          alt={product.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw"
        />
      </Link>

      <div className={styles.productCardBody}>
        <p className={styles.productBrand}>{product.brand}</p>
        <h2 className={styles.productCardTitle}>
          <Link href={productPath}>{product.name}</Link>
        </h2>
        <p className={styles.productSku}>{product.sku}</p>

        <dl className={styles.cardSpecs}>
          {product.cardSpecs.map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.cardActions}>
          <Link className={styles.detailsLink} href={productPath}>
            View details
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </Link>
          <Link
            className={styles.requestButton}
            href={`${productPath}#request-price`}
          >
            Request price
          </Link>
        </div>
      </div>
    </article>
  );
}
