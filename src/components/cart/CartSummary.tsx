import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  total: number;
  isEmpty: boolean;
}

export function CartSummary({ total, isEmpty }: CartSummaryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={styles.summary}>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>{t('cart.total')}</span>
        <span className={styles.totalValue}>{formatCurrency(total)}</span>
      </div>
      <button
        className={styles.checkoutButton}
        onClick={handleCheckout}
        disabled={isEmpty}
      >
        {t('cart.checkout')}
      </button>
    </div>
  );
}
