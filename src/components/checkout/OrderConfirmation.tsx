import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../stores/languageStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Order } from '../../types';
import styles from './OrderConfirmation.module.css';

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  const estimatedDeliveryDate = new Date(order.estimatedDelivery);
  const subtotal = order.totalAmount - order.shippingFee;

  return (
    <div className={styles.container}>
      {/* Success checkmark */}
      <div className={styles.successIcon} aria-hidden="true">
        <svg
          className={styles.checkmark}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className={styles.successMessage}>
        {t('confirmation.successMessage')}
      </p>

      <p className={styles.orderId}>{order.orderId}</p>

      {/* Ordered items summary */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('confirmation.orderedItems')}</h3>
        {order.items.map((item) => (
          <div key={item.productId} className={styles.itemRow}>
            <span className={styles.itemName}>{item.productName}</span>
            <span className={styles.itemQty}>×{item.quantity}</span>
            <span className={styles.itemPrice}>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}

        <div className={styles.totalRow}>
          <span>{t('cart.subtotal')}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>{t('checkout.shippingFee')}</span>
          <span>{formatCurrency(order.shippingFee)}</span>
        </div>
        <div className={styles.totalRow}>
          <span className={styles.grandTotal}>{t('cart.total')}</span>
          <span className={styles.grandTotal}>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* Estimated delivery */}
      <div className={styles.deliveryInfo}>
        <p className={styles.deliveryLabel}>{t('confirmation.estimatedDelivery')}</p>
        <p className={styles.deliveryDate}>
          {formatDate(estimatedDeliveryDate, language)}
        </p>
      </div>

      {/* Navigation links */}
      <div className={styles.actions}>
        <Link to="/orders" className={styles.ordersLink}>
          {t('confirmation.viewOrders')}
        </Link>
        <Link to="/" className={styles.continueLink}>
          {t('cart.continueShopping')}
        </Link>
      </div>
    </div>
  );
}
