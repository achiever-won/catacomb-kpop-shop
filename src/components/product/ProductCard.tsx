import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, XCircle, Heart } from 'lucide-react';
import { truncateText, formatCurrency } from '../../utils/formatters';
import { useWishlistStore } from '../../stores/wishlistStore';
import { getFallbackImageUrl } from '../../data/products';
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // Extract index from product ID (e.g., "kpop-albums-001" → 1)
    const match = product.id.match(/(\d+)$/);
    const index = match ? parseInt(match[1], 10) : 0;
    const fallback = getFallbackImageUrl(product.mainCategory, product.subCategory, index);
    if (img.src !== fallback) {
      img.src = fallback;
    }
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
            onError={handleImageError}
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
