import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductById, getFallbackImageUrl } from '../data/products';
import { formatCurrency } from '../utils/formatters';
import { useCartStore } from '../stores/cartStore';
import styles from './ProductDetailPage.module.css';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [extIndex, setExtIndex] = useState(0);

  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <p className={styles.notFoundMessage}>
            {t('errors.productNotFound')}
          </p>
          <Link to="/" className={styles.homeLink}>
            {t('general.returnToHome')}
          </Link>
        </div>
      </div>
    );
  }

  const base = `${import.meta.env.BASE_URL}products/${product.name}`;
  const match = product.id.match(/(\d+)$/);
  const numIndex = match ? parseInt(match[1], 10) : 0;
  const fallbackUrl = getFallbackImageUrl(product.mainCategory, product.subCategory, numIndex);

  const imgSrc = extIndex < IMAGE_EXTENSIONS.length
    ? base + IMAGE_EXTENSIONS[extIndex]
    : fallbackUrl;

  const handleImageError = () => {
    if (extIndex < IMAGE_EXTENSIONS.length) {
      setExtIndex((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className={styles.container}>
      <div className={styles.productLayout}>
        <div className={styles.imageWrapper}>
          <img
            src={imgSrc}
            alt={product.name}
            className={styles.image}
            onError={handleImageError}
          />
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          <span
            className={`${styles.stockStatus} ${
              product.inStock ? styles.inStock : styles.outOfStock
            }`}
          >
            {product.inStock
              ? t('products.inStock')
              : t('products.outOfStock')}
          </span>
          <button
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
