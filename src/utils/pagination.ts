/**
 * Pagination utility for splitting arrays into pages.
 */

import type { PaginatedResult } from '../types';

/**
 * Paginates an array of items into a page result.
 *
 * - page is 1-indexed (first page is 1)
 * - pageSize must be at least 1
 * - If page exceeds total pages, returns an empty items array with correct metadata
 * - If page < 1, treats it as page 1
 */
export function paginateItems<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  const startIndex = (safePage - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;
  const pageItems = items.slice(startIndex, endIndex);

  return {
    items: pageItems,
    currentPage: safePage,
    totalPages,
    totalItems,
  };
}
