import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, BookOpen, Truck, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useCartStore } from '../stores/cartStore';
import styles from './HomePage.module.css';

export function HomePage() {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

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
        <div className={styles.heroContent}>
          <h1 className={styles.heroBrand}>카타콤</h1>
          <p className={styles.heroTagline}>{t('home.tagline')}</p>
          <Link to="/category/K-POP Goods" className={styles.heroButton}>
            쇼핑 시작하기 <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustBadges}>
        <div className={styles.badge}>
          <Truck size={24} />
          <span>빠른 배송</span>
        </div>
        <div className={styles.badge}>
          <Shield size={24} />
          <span>안전한 결제</span>
        </div>
        <div className={styles.badge}>
          <CreditCard size={24} />
          <span>Visa 지원</span>
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
              <div className={styles.categoryIconWrapper}>
                {category.name === 'K-POP Goods' ? <Music size={32} /> : <BookOpen size={32} />}
              </div>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {category.subCategories.length} categories
                </span>
              </div>
              <ArrowRight size={20} className={styles.categoryArrow} />
            </Link>
          ))}
        </div>
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
    </div>
  );
}
