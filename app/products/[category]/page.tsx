import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import {
  parseCatalogSearchParams,
  type CatalogSearchParams,
} from "@/components/catalog/catalog-search";
import {
  getCategoryDefinition,
  getProductsByCategory,
  isProductCategory,
  productCategories,
  type CatalogProduct,
} from "@/data/products";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<CatalogSearchParams>;
};

export function generateStaticParams() {
  return productCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isProductCategory(category)) return {};

  const definition = getCategoryDefinition(category);
  return {
    title: definition.label,
    description: `Compare ${definition.singularLabel.toLocaleLowerCase()} options in the current Next Solutions catalogue and prepare a price request.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  if (!isProductCategory(category)) notFound();

  const definition = getCategoryDefinition(category);
  const categoryProducts: readonly CatalogProduct[] = getProductsByCategory(
    category,
  );
  const initial = parseCatalogSearchParams(await searchParams, category);
  const finderHeading: Record<typeof category, string> = {
    ssd: "Find your SSD.",
    hdd: "Find your hard drive.",
    ram: "Find the right memory.",
    graphics: "Find your graphics card.",
    nas: "Plan your NAS.",
    printers: "Find your printer.",
  };

  return (
    <CatalogExplorer
      products={categoryProducts}
      activeCategory={category}
      heading={finderHeading[category]}
      description={`Choose the requirements that matter to you. We’ll narrow the current ${definition.singularLabel.toLocaleLowerCase()} options as you build your configuration.`}
      initialQuery={initial.query}
      initialBrands={initial.brands}
      initialFilters={initial.filters}
    />
  );
}
