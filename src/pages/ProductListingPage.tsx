import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductGrid } from '../components/product/ProductGrid';
import { filterByCategory, sortProducts } from '../utils/search';
import { paginateItems } from '../utils/pagination';
import { products } from '../data/products';
import type { SortOption } from '../types';
import styles from './ProductListingPage.module.css';

const PAGE_SIZE = 20;

export function ProductListingPage() {
  const { mainCategory, subCategory } = useParams<{ mainCategory: string; subCategory?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // Filter products by category
  const filtered = filterByCategory(products, mainCategory || '', subCategory);

  // Apply sorting
  const sorted = sortProducts(filtered, sortOption);

  // Paginate
  const paginated = paginateItems(sorted, page, PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
    // Reset to page 1 when sort changes
    setSearchParams({ page: '1' });
  };

  const categoryTitle = subCategory || mainCategory || '';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{categoryTitle}</h1>
        <div className={styles.sortContainer}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            {t('products.sort')}
          </label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="newest">{t('products.newest')}</option>
            <option value="price-asc">{t('products.priceAsc')}</option>
            <option value="price-desc">{t('products.priceDesc')}</option>
            <option value="name-asc">{t('products.nameAsc')}</option>
          </select>
        </div>
      </div>

      {paginated.items.length > 0 ? (
        <ProductGrid
          products={paginated.items}
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className={styles.emptyState}>
          {t('errors.noResults')}
        </div>
      )}
    </div>
  );
}
