"use client";

import {
  useDeferredValue,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";

import {
  categoryFilters,
  productCategories,
  type CatalogProduct,
  type ProductCategory,
} from "@/data/products";

import { ProductCard } from "./ProductCard";
import styles from "./catalog.module.css";

type CatalogExplorerProps = {
  products: readonly CatalogProduct[];
  activeCategory?: ProductCategory;
  heading: string;
  description: string;
  initialQuery?: string;
  initialBrands?: string[];
  initialFilters?: Record<string, string[]>;
};

type FilterGroup = {
  key: string;
  label: string;
  values: string[];
};

type SortMode = "featured" | "name" | "brand";

const configuratorEyebrows: Record<ProductCategory, string> = {
  ssd: "Storage finder",
  hdd: "Capacity planner",
  ram: "Memory matcher",
  graphics: "Graphics selector",
  nas: "NAS planner",
  printers: "Printer finder",
};

function slugId(value: string) {
  return value.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

export function CatalogExplorer({
  products,
  activeCategory,
  heading,
  description,
  initialQuery = "",
  initialBrands = [],
  initialFilters = {},
}: CatalogExplorerProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState(initialBrands[0] ?? "");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(initialFilters)
        .filter(([, values]) => values.length > 0)
        .map(([key, values]) => [key, values[0]]),
    ),
  );
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [isRouting, startRouting] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const basePath = activeCategory
    ? `/products/${activeCategory}`
    : "/products";

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].toSorted(),
    [products],
  );

  const groups = useMemo<FilterGroup[]>(() => {
    if (!activeCategory) return [];

    return categoryFilters[activeCategory].map((definition) => ({
      ...definition,
      values: [
        ...new Set(
          products
            .map((product) => product.filters[definition.key])
            .filter((value): value is string => Boolean(value)),
        ),
      ].toSorted((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    }));
  }, [activeCategory, products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      if (selectedBrand && product.brand !== selectedBrand) return false;

      for (const [key, value] of Object.entries(selectedFilters)) {
        if (value && product.filters[key] !== value) return false;
      }

      if (!normalizedQuery) return true;

      const searchable = [
        product.brand,
        product.name,
        product.model,
        product.sku,
        product.category,
        ...Object.values(product.filters),
        ...product.cardSpecs.flatMap((spec) => [spec.label, spec.value]),
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(normalizedQuery);
    });

    if (sortMode === "name") {
      return filtered.toSorted((a, b) => a.name.localeCompare(b.name));
    }

    if (sortMode === "brand") {
      return filtered.toSorted(
        (a, b) =>
          a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name),
      );
    }

    return filtered;
  }, [deferredQuery, products, selectedBrand, selectedFilters, sortMode]);

  const hasActiveConfiguration =
    selectedBrand.length > 0 ||
    Object.values(selectedFilters).some(Boolean) ||
    query.trim().length > 0;

  function updateUrl(
    nextBrand: string,
    nextFilters: Record<string, string>,
    nextQuery = query,
  ) {
    const params = new URLSearchParams();
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (nextBrand) params.set("brand", nextBrand);
    for (const [key, value] of Object.entries(nextFilters)) {
      if (value) params.set(key, value);
    }

    const suffix = params.size > 0 ? `?${params.toString()}` : "";
    startRouting(() => router.replace(`${basePath}${suffix}`, { scroll: false }));
  }

  function selectOption(key: string, value: string) {
    const nextFilters = { ...selectedFilters };

    if (!value || selectedFilters[key] === value) delete nextFilters[key];
    else nextFilters[key] = value;

    setSelectedFilters(nextFilters);
    updateUrl(selectedBrand, nextFilters);
  }

  function selectBrand(brand: string) {
    const nextBrand = selectedBrand === brand ? "" : brand;
    setSelectedBrand(nextBrand);
    updateUrl(nextBrand, selectedFilters);
  }

  function clearConfiguration() {
    setQuery("");
    setSelectedBrand("");
    setSelectedFilters({});
    startRouting(() => router.replace(basePath, { scroll: false }));
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl(selectedBrand, selectedFilters, query);
  }

  return (
    <main className={styles.catalogPage}>
      <div className={styles.catalogInner}>
        <header className={styles.catalogHeader}>
          <div className={styles.catalogIntro}>
            <p className={styles.catalogEyebrow}>
              {activeCategory
                ? configuratorEyebrows[activeCategory]
                : "Next Solutions catalogue"}
            </p>
            <h1>{heading}</h1>
            <p className={styles.catalogDescription}>{description}</p>
          </div>

          <form
            className={styles.searchForm}
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <label className={styles.srOnly} htmlFor="catalog-search">
              Search products, models, SKUs or brands
            </label>
            <Search aria-hidden="true" size={19} strokeWidth={1.7} />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search model, SKU or brand"
            />
            <button type="submit">Search</button>
          </form>
        </header>

        <nav className={styles.categoryTabs} aria-label="Product categories">
          <Link
            href="/products"
            className={!activeCategory ? styles.activeCategory : undefined}
            aria-current={!activeCategory ? "page" : undefined}
          >
            <span>00</span>
            All hardware
          </Link>
          {productCategories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className={
                activeCategory === category.slug
                  ? styles.activeCategory
                  : undefined
              }
              aria-current={
                activeCategory === category.slug ? "page" : undefined
              }
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {category.label}
            </Link>
          ))}
        </nav>

        {activeCategory ? (
          <section
            className={styles.configurator}
            aria-labelledby="configuration-title"
          >
            <div className={styles.configuratorHeader}>
              <div>
                <p>Configure your requirements</p>
                <h2 id="configuration-title">
                  Build the setup you need.
                </h2>
              </div>
              <p className={styles.configuratorHint}>
                Pick one option per row. Results update as you decide.
              </p>
            </div>

            <div className={styles.configurationRows}>
              {groups.map((group, groupIndex) => (
                <div className={styles.optionGroup} key={group.key}>
                  <p
                    className={styles.optionLabel}
                    id={`${slugId(group.key)}-label`}
                  >
                    <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                    {group.label}
                  </p>
                  <div
                    className={styles.optionList}
                    role="group"
                    aria-labelledby={`${slugId(group.key)}-label`}
                  >
                    <button
                      type="button"
                      className={
                        !selectedFilters[group.key]
                          ? styles.selectedOption
                          : undefined
                      }
                      aria-pressed={!selectedFilters[group.key]}
                      onClick={() => selectOption(group.key, "")}
                    >
                      Any
                    </button>
                    {group.values.map((value) => {
                      const selected = selectedFilters[group.key] === value;
                      return (
                        <button
                          type="button"
                          key={value}
                          id={`${slugId(group.key)}-${slugId(value)}`}
                          className={selected ? styles.selectedOption : undefined}
                          aria-pressed={selected}
                          onClick={() => selectOption(group.key, value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className={styles.optionGroup}>
                <p className={styles.optionLabel} id="preferred-brand-label">
                  <span>{String(groups.length + 1).padStart(2, "0")}</span>
                  Preferred brand
                </p>
                <div
                  className={styles.optionList}
                  role="group"
                  aria-labelledby="preferred-brand-label"
                >
                  <button
                    type="button"
                    className={!selectedBrand ? styles.selectedOption : undefined}
                    aria-pressed={!selectedBrand}
                    onClick={() => selectBrand("")}
                  >
                    Any
                  </button>
                  {brands.map((brand) => {
                    const selected = brand === selectedBrand;
                    return (
                      <button
                        type="button"
                        key={brand}
                        className={selected ? styles.selectedOption : undefined}
                        aria-pressed={selected}
                        onClick={() => selectBrand(brand)}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.matchStrip} aria-live="polite">
              <div>
                <strong>{visibleProducts.length}</strong>
                <span>
                  {visibleProducts.length === 1
                    ? "matching option"
                    : "matching options"}
                </span>
                {isRouting ? <em>Updating…</em> : null}
              </div>
              {hasActiveConfiguration ? (
                <button type="button" onClick={clearConfiguration}>
                  <RotateCcw aria-hidden="true" size={15} />
                  Start again
                </button>
              ) : (
                <span>All current options are shown</span>
              )}
            </div>
          </section>
        ) : null}

        <section className={styles.results} aria-labelledby="catalog-results">
          <div className={styles.resultsToolbar}>
            <div>
              <p>{activeCategory ? "Your matches" : "Current catalogue"}</p>
              <h2 id="catalog-results">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "product" : "products"}
              </h2>
            </div>

            <label className={styles.sortControl}>
              <span>Sort by</span>
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as SortMode)
                }
              >
                <option value="featured">Featured</option>
                <option value="name">Name A–Z</option>
                <option value="brand">Brand</option>
              </select>
            </label>
          </div>

          {visibleProducts.length > 0 ? (
            <div className={styles.productGrid} aria-busy={isRouting}>
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No exact match yet</p>
              <h2>Try opening one requirement.</h2>
              <span>
                We only show combinations represented in the current catalogue.
              </span>
              <button type="button" onClick={clearConfiguration}>
                Reset configuration
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
