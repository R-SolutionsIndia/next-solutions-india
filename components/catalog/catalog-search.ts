import {
  categoryFilters,
  type ProductCategory,
} from "@/data/products";

export type CatalogSearchParams = Record<
  string,
  string | string[] | undefined
>;

function asValues(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

export function parseCatalogSearchParams(
  params: CatalogSearchParams,
  activeCategory?: ProductCategory,
) {
  const query = asValues(params.q)[0] ?? "";
  const brands = asValues(params.brand);
  const filters: Record<string, string[]> = {};

  if (activeCategory) {
    for (const definition of categoryFilters[activeCategory]) {
      const values = asValues(params[definition.key]);
      if (values.length > 0) filters[definition.key] = values;
    }
  }

  return { query, brands, filters };
}
