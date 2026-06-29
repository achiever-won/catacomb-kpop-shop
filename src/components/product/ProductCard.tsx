import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, XCircle } from 'lucide-react';
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
            loading="lazy"
          />
          {!product.inStock && (
            <div className={styles.soldOutOverlay}>
              <XCircle size={24} />
              <span>{t('products.outOfStock')}</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{product.subCategory}</span>
          <h3 className={styles.name}>{truncateText(product.name, 40)}</h3>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
        </div>
      </Link>
      <div className={styles.actions}>
        <button
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingBag size={16} />
          <span>
            {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
          </span>
        </button>
      </div>
    </article>
  );
}
