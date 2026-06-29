import { useTranslation } from 'react-i18next';
import type { CartItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import styles from './CartItemRow.module.css';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const { t } = useTranslation();
  const subtotal = item.product.price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < 99) {
      onQuantityChange(item.productId, item.quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      onQuantityChange(item.productId, value);
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.imageWrapper}>
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{item.product.name}</h3>
        <span className={styles.unitPrice}>{formatCurrency(item.product.price)}</span>
      </div>

      <div className={styles.quantityControl}>
        <label className={styles.quantityLabel} htmlFor={`qty-${item.productId}`}>
          {t('cart.quantity')}
        </label>
        <div className={styles.quantitySelector}>
          <button
            className={styles.quantityButton}
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id={`qty-${item.productId}`}
            type="number"
            className={styles.quantityInput}
            value={item.quantity}
            onChange={handleInputChange}
            min={1}
            max={99}
            aria-label={`${t('cart.quantity')}: ${item.product.name}`}
          />
          <button
            className={styles.quantityButton}
            onClick={handleIncrease}
            disabled={item.quantity >= 99}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.subtotal}>
        <span className={styles.subtotalLabel}>{t('cart.subtotal')}</span>
        <span className={styles.subtotalValue}>{formatCurrency(subtotal)}</span>
      </div>

      <button
        className={styles.removeButton}
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.product.name}`}
      >
        ✕
      </button>
    </div>
  );
}
