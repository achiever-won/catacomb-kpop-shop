import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../stores/cartStore';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import styles from './CartPage.module.css';

export function CartPage() {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const isEmpty = items.length === 0;
  const total = getTotal();

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('cart.title')}</h1>

      {isEmpty ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>{t('cart.empty')}</p>
          <Link to="/" className={styles.continueLink}>
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <aside className={styles.summaryWrapper}>
            <CartSummary total={total} isEmpty={isEmpty} />
          </aside>
        </div>
      )}
    </div>
  );
}
