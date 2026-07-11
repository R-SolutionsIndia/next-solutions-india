import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import {
  parseCatalogSearchParams,
  type CatalogSearchParams,
} from "@/components/catalog/catalog-search";
import { catalogProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Search the current Next Solutions hardware catalogue by product, model, SKU, brand and verified specifications.",
};

type ProductsPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const initial = parseCatalogSearchParams(await searchParams);

  return (
    <CatalogExplorer
      products={catalogProducts}
      heading="Hardware for what you’re building."
      description="Explore our current catalogue, then shape the configuration around your system. We confirm availability and commercial details with every request."
      initialQuery={initial.query}
      initialBrands={initial.brands}
      initialFilters={initial.filters}
    />
  );
}
