import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { products } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import styles from './WishlistPage.module.css';

export function WishlistPage() {
  const { t } = useTranslation();
  const wishlistItems = useWishlistStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const likedProducts = products.filter((p) => wishlistItems.includes(p.id));

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.inStock) {
      addItem(product);
    }
  };

  if (likedProducts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          <Heart size={24} /> 좋아요 목록
        </h1>
        <div className={styles.emptyState}>
          <Heart size={48} className={styles.emptyIcon} />
          <p className={styles.emptyMessage}>좋아요한 상품이 없습니다</p>
          <Link to="/" className={styles.continueLink}>
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Heart size={24} /> 좋아요 목록 ({likedProducts.length})
      </h1>
      <div className={styles.grid}>
        {likedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
