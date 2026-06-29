/**
 * Product search, filter, and sort utilities.
 * All functions are pure — no side effects or external state.
 */

import type { Product, SortOption } from '../types';

/**
 * Searches products by case-insensitive partial match on name and description.
 * Returns all products where name OR description contains the query substring.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filters products by main category and optionally by sub-category.
 * If subCategory is not provided, returns all products in the main category.
 */
export function filterByCategory(
  products: Product[],
  mainCategory: string,
  subCategory?: string
): Product[] {
  return products.filter((product) => {
    if (product.mainCategory !== mainCategory) {
      return false;
    }
    if (subCategory && product.subCategory !== subCategory) {
      return false;
    }
    return true;
  });
}

/**
 * Sorts products by the given sort option.
 * - 'price-asc': price low to high
 * - 'price-desc': price high to low
 * - 'name-asc': alphabetical A-Z by name
 * - 'newest': most recent createdAt first (descending)
 *
 * Returns a new sorted array (does not mutate the input).
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return sorted;
}
