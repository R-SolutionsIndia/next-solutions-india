import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RequestPriceForm } from "@/components/catalog/RequestPriceForm";
import styles from "@/components/catalog/catalog.module.css";
import {
  getCategoryDefinition,
  getProduct,
  products,
} from "@/data/products";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};

  return {
    title: `${product.name} ${product.cardSpecs[0]?.value ?? ""}`.trim(),
    description: `${product.shortDescription} Request current price and availability from Next Solutions.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) notFound();

  const categoryDefinition = getCategoryDefinition(product.category);
  const keySpecs = product.specs.slice(0, 4);
  const requestProduct = {
    brand: product.brand,
    category: product.category,
    model: product.model,
    name: product.name,
    sku: product.sku,
    specs: product.specs,
  };
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    model: product.model,
    category: categoryDefinition.label,
    brand: { "@type": "Brand", name: product.brand },
  };

  return (
    <main className={styles.productPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <div className={styles.productPageInner}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/products">Products</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products/${product.category}`}>
            {categoryDefinition.label}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.model}</span>
        </nav>

        <div className={styles.productLayout}>
          <article className={styles.productShowcase}>
            <div className={styles.detailImageFrame}>
              <Image
                className={styles.detailImage}
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(max-width: 940px) 100vw, 62vw"
              />
            </div>

            <header className={styles.detailIdentity}>
              <p className={styles.detailBrand}>{product.brand}</p>
              <h1>{product.name}</h1>
              <p className={styles.detailSku}>{product.sku}</p>
              <p className={styles.detailDescription}>
                {product.shortDescription}
              </p>
            </header>

            <dl className={styles.keySpecs}>
              {keySpecs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.detailSections}>
              <section>
                <h2>Specifications</h2>
                <dl className={styles.specList}>
                  {product.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                {product.warranty ? (
                  <p className={styles.warrantyNote}>
                    Warranty: {product.warranty}. Confirm current terms with the
                    price request.
                  </p>
                ) : null}
              </section>

              <section>
                <h2>Compatibility checks</h2>
                <ul className={styles.compatibilityList}>
                  {product.compatibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.sourceNote}>
                  Specifications verified from the current retailer listing on{" "}
                  <time dateTime={product.verifiedOn}>{product.verifiedOn}</time>.{" "}
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View reference listing
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>

          <RequestPriceForm product={requestProduct} />
        </div>
      </div>
    </main>
  );
}
