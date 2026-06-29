import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, XCircle, Heart } from 'lucide-react';
import { truncateText, formatCurrency } from '../../utils/formatters';
import { useWishlistStore } from '../../stores/wishlistStore';
import type { Product } from '../../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();
  const toggle = useWishlistStore((state) => state.toggle);
  const isLiked = useWishlistStore((state) => state.isLiked(product.id));

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const handleToggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
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
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
            onClick={handleToggleLike}
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
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
