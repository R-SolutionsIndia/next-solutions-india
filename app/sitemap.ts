import type { MetadataRoute } from "next";
import { productCategories, products } from "@/data/products";

const staticRoutes = ["", "/products", "/brands", "/about", "/contact", "/support", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryRoutes = productCategories.map(
    (category) => `/products/${category.slug}`,
  );
  const productRoutes = products.map(
    (product) => `/products/${product.category}/${product.slug}`,
  );

  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((route) => ({
    url: `https://solutionsind.com${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/products") ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
