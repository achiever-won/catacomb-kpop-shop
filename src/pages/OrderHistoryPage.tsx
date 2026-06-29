import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderStore } from '../stores/orderStore';
import { useLanguageStore } from '../stores/languageStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { OrderStatus } from '../types';
import styles from './OrderHistoryPage.module.css';

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case '배송준비중':
      return styles.statusPreparing;
    case '배송중':
      return styles.statusShipping;
    case '배송완료':
      return styles.statusDelivered;
    case '주문취소':
      return styles.statusCancelled;
    default:
      return '';
  }
}

function getStatusLabel(status: OrderStatus, t: (key: string) => string): string {
  switch (status) {
    case '배송준비중':
      return t('orders.preparing');
    case '배송중':
      return t('orders.shipping');
    case '배송완료':
      return t('orders.delivered');
    case '주문취소':
      return t('orders.cancelled');
    default:
      return status;
  }
}

export function OrderHistoryPage() {
  const { t } = useTranslation();
  const orders = useOrderStore((state) => state.orders);
  const language = useLanguageStore((state) => state.language);

  const isEmpty = orders.length === 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('orders.title')}</h1>

      {isEmpty ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>{t('orders.empty')}</p>
          <Link to="/" className={styles.continueLink}>
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <Link
              key={order.orderId}
              to={`/orders/${order.orderId}`}
              className={styles.orderRow}
            >
              <span className={styles.orderNumber}>{order.orderId}</span>
              <span className={styles.orderDate}>
                {formatDate(new Date(order.orderDate), language)}
              </span>
              <span className={styles.orderTotal}>
                {formatCurrency(order.totalAmount)}
              </span>
              <span
                className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}
              >
                {getStatusLabel(order.status, t)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
