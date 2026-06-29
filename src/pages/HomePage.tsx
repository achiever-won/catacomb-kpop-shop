import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/product/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useCartStore } from '../stores/cartStore';
import styles from './HomePage.module.css';

export function HomePage() {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  // Get first 8 in-stock products as featured
  const featuredProducts = products.filter((p) => p.inStock).slice(0, 8);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.hero} aria-label="Hero banner">
        <h1 className={styles.heroBrand}>카타콤</h1>
        <p className={styles.heroTagline}>{t('home.tagline')}</p>
      </section>

      {/* Featured Products */}
      <section className={styles.section} aria-labelledby="featured-heading">
        <div className={styles.sectionHeader}>
          <h2 id="featured-heading" className={styles.sectionTitle}>
            {t('home.featuredProducts')}
          </h2>
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Category Quick Links */}
      <section className={styles.section} aria-labelledby="categories-heading">
        <div className={styles.sectionHeader}>
          <h2 id="categories-heading" className={styles.sectionTitle}>
            {t('home.shopByCategory')}
          </h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryIcon} aria-hidden="true">
                {category.name === 'K-POP Goods' ? '🎵' : '📚'}
              </span>
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryCount}>
                {category.subCategories.length} {t('home.viewAll')}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
