import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PaymentInfo, CartItem } from '../../types';
import { validatePaymentForm } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { demoCard } from '../../data/demo';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import styles from './PaymentForm.module.css';

interface PaymentFormProps {
  totalAmount: number;
  onSubmit: (data: PaymentInfo) => void;
  onPrevious?: () => void;
}

export function PaymentForm({ totalAmount, onSubmit, onPrevious }: PaymentFormProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartItems = useCartStore((state) => state.items);

  // Pre-fill with demo card info if user is in demo session
  const initialData: PaymentInfo = isAuthenticated
    ? { ...demoCard }
    : { cardNumber: '', cardholderName: '', expirationDate: '', cvv: '' };

  const [formData, setFormData] = useState<PaymentInfo>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isProcessing) return;

    const validationErrors = validatePaymentForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Show loading state for 2 seconds, then call onSubmit
    setIsProcessing(true);
    setTimeout(() => {
      onSubmit(formData);
    }, 2000);
  };

  const shippingFee = 3000;
  const subtotal = totalAmount - shippingFee;

  const getErrorMessage = (field: string): string => {
    const error = errors[field];
    if (!error) return '';

    // Map validator error messages to i18n keys
    switch (error) {
      case '필수 입력 항목입니다':
        return t('errors.requiredField');
      case '유효하지 않은 카드 번호입니다':
        return t('errors.invalidCardNumber');
      case '만료된 카드입니다':
        return t('errors.cardExpired');
      case 'CVV는 3자리 숫자여야 합니다':
        return t('errors.invalidCVV');
      default:
        return error;
    }
  };

  if (isProcessing) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>{t('errors.processingPayment')}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Visa Logo and Accepted Badge */}
      <div className={styles.visaHeader}>
        <div className={styles.visaLogo} aria-label="Visa">VISA</div>
        <span className={styles.acceptedBadge}>{t('checkout.acceptedPayment')}</span>
      </div>

      {/* Order Summary */}
      <div className={styles.orderSummary}>
        <h3 className={styles.orderSummaryTitle}>{t('checkout.orderSummary')}</h3>
        {cartItems.map((item: CartItem) => (
          <div key={item.productId} className={styles.orderItem}>
            <span className={styles.orderItemName}>{item.product.name}</span>
            <span className={styles.orderItemQty}>×{item.quantity}</span>
            <span className={styles.orderItemPrice}>
              {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
        <div className={styles.orderTotalRow}>
          <span>{t('cart.subtotal')}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.orderTotalRow}>
          <span>{t('checkout.shippingFee')}</span>
          <span>{formatCurrency(shippingFee)}</span>
        </div>
        <div className={`${styles.orderTotalRow} ${styles.orderGrandTotal}`}>
          <span>{t('cart.total')}</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Card Number */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="payment-cardNumber">
          {t('checkout.cardNumber')}
          <span className={styles.required}>*</span>
        </label>
        <input
          id="payment-cardNumber"
          name="cardNumber"
          type="text"
          className={`${styles.input}${errors.cardNumber ? ` ${styles.hasError}` : ''}`}
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="0000 0000 0000 0000"
          maxLength={16}
          autoComplete="cc-number"
        />
        {errors.cardNumber && (
          <p className={styles.errorMessage}>{getErrorMessage('cardNumber')}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="payment-cardholderName">
          {t('checkout.cardholderName')}
          <span className={styles.required}>*</span>
        </label>
        <input
          id="payment-cardholderName"
          name="cardholderName"
          type="text"
          className={`${styles.input}${errors.cardholderName ? ` ${styles.hasError}` : ''}`}
          value={formData.cardholderName}
          onChange={handleChange}
          maxLength={50}
          autoComplete="cc-name"
        />
        {errors.cardholderName && (
          <p className={styles.errorMessage}>{getErrorMessage('cardholderName')}</p>
        )}
      </div>

      {/* Expiration Date */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="payment-expirationDate">
          {t('checkout.expirationDate')}
          <span className={styles.required}>*</span>
        </label>
        <input
          id="payment-expirationDate"
          name="expirationDate"
          type="text"
          className={`${styles.input}${errors.expirationDate ? ` ${styles.hasError}` : ''}`}
          value={formData.expirationDate}
          onChange={handleChange}
          placeholder="MM/YY"
          maxLength={5}
          autoComplete="cc-exp"
        />
        {errors.expirationDate && (
          <p className={styles.errorMessage}>{getErrorMessage('expirationDate')}</p>
        )}
      </div>

      {/* CVV */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="payment-cvv">
          {t('checkout.cvv')}
          <span className={styles.required}>*</span>
        </label>
        <input
          id="payment-cvv"
          name="cvv"
          type="text"
          className={`${styles.input}${errors.cvv ? ` ${styles.hasError}` : ''}`}
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          maxLength={3}
          autoComplete="cc-csc"
        />
        {errors.cvv && (
          <p className={styles.errorMessage}>{getErrorMessage('cvv')}</p>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {onPrevious && (
          <button type="button" className={styles.prevButton} onClick={onPrevious}>
            {t('checkout.previous')}
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isProcessing}
        >
          {t('checkout.payment')} ({formatCurrency(totalAmount)})
        </button>
      </div>
    </form>
  );
}
