import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { truncateText, formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product.id);
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{truncateText(product.name, 40)}</h3>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
        </div>
      </Link>
      <div className={styles.actions}>
        <button
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={
            product.inStock
              ? t('products.addToCart')
              : t('products.outOfStock')
          }
        >
          {product.inStock
            ? t('products.addToCart')
            : t('products.outOfStock')}
        </button>
      </div>
    </article>
  );
}
