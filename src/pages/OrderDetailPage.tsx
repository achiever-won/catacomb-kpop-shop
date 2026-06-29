import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderStore } from '../stores/orderStore';
import { useCartStore } from '../stores/cartStore';
import { useLanguageStore } from '../stores/languageStore';
import { getProductById } from '../data/products';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { OrderStatus } from '../types';
import styles from './OrderDetailPage.module.css';

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

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const addItem = useCartStore((state) => state.addItem);
  const language = useLanguageStore((state) => state.language);

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorMessage}>{t('orders.notFound')}</p>
          <Link to="/orders" className={styles.backLink}>
            {t('orders.title')}
          </Link>
        </div>
      </div>
    );
  }

  const handleReorder = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('orders.orderNumber')}: {order.orderId}</h1>

      {/* Order Header Meta */}
      <div className={styles.orderHeader}>
        <div className={styles.orderMeta}>
          <span className={styles.orderMetaLabel}>{t('orders.orderDate')}</span>
          <span className={styles.orderMetaValue}>
            {formatDate(new Date(order.orderDate), language)}
          </span>
        </div>
        <div className={styles.orderMeta}>
          <span className={styles.orderMetaLabel}>{t('orders.deliveryStatus')}</span>
          <span
            className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}
          >
            {getStatusLabel(order.status, t)}
          </span>
        </div>
      </div>

      {/* Items Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('orders.items')}</h2>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>{t('orders.productName')}</th>
              <th>{t('cart.quantity')}</th>
              <th>{t('orders.unitPrice')}</th>
              <th>{t('cart.subtotal')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(item.subtotal)}</td>
                <td>
                  <button
                    className={styles.reorderButton}
                    onClick={() => handleReorder(item.productId)}
                  >
                    {t('orders.reorder')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>{t('cart.total')}</span>
          <span className={styles.totalAmount}>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('orders.shippingAddress')}</h2>
        <div className={styles.addressBlock}>
          <p className={styles.addressLine}>{order.shippingAddress.recipientName}</p>
          <p className={styles.addressLine}>{order.shippingAddress.street}</p>
          <p className={styles.addressLine}>
            {order.shippingAddress.city} {order.shippingAddress.postalCode}
          </p>
          <p className={styles.addressLine}>{order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
}
