import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductGrid } from '../components/product/ProductGrid';
import { searchProducts } from '../utils/search';
import { paginateItems } from '../utils/pagination';
import { products } from '../data/products';
import styles from './SearchResultsPage.module.css';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const query = searchParams.get('q') || '';

  // Validate minimum query length
  if (query.length < 2) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          <p>{t('errors.searchMinLength')}</p>
        </div>
      </div>
    );
  }

  const results = searchProducts(products, query);

  // No results found
  if (results.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>'{query}' {t('search.resultsTitle', '검색 결과')}</h1>
        <div className={styles.message}>
          <p>{t('errors.noResults')}</p>
        </div>
      </div>
    );
  }

  const paginated = paginateItems(results, page, 20);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>'{query}' {t('search.resultsTitle', '검색 결과')}</h1>
      <p className={styles.resultCount}>
        {t('search.resultCount', '{{count}}개의 상품', { count: results.length })}
      </p>
      <ProductGrid
        products={paginated.items}
        currentPage={paginated.currentPage}
        totalPages={paginated.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
