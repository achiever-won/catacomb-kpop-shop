import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductById } from '../data/products';
import { formatCurrency } from '../utils/formatters';
import { useCartStore } from '../stores/cartStore';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

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

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className={styles.container}>
      <div className={styles.productLayout}>
        <div className={styles.imageWrapper}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
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
