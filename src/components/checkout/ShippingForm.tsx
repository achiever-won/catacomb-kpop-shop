import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShippingAddress } from '../../types';
import { validateShippingForm } from '../../utils/validators';
import styles from './ShippingForm.module.css';

interface ShippingFormProps {
  initialData?: ShippingAddress;
  onSubmit: (data: ShippingAddress) => void;
}

export function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ShippingAddress>({
    recipientName: initialData?.recipientName ?? '',
    street: initialData?.street ?? '',
    city: initialData?.city ?? '',
    postalCode: initialData?.postalCode ?? '',
    phone: initialData?.phone ?? '',
    deliveryNotes: initialData?.deliveryNotes ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    const validationErrors = validateShippingForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (
    name: keyof ShippingAddress,
    labelKey: string,
    required: boolean,
    isTextarea = false
  ) => {
    const hasError = !!errors[name];
    const inputClass = `${styles.input}${hasError ? ` ${styles.hasError}` : ''}${isTextarea ? ` ${styles.textarea}` : ''}`;

    return (
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={`shipping-${name}`}>
          {t(labelKey)}
          {required && <span className={styles.required}>*</span>}
        </label>
        {isTextarea ? (
          <textarea
            id={`shipping-${name}`}
            name={name}
            className={inputClass}
            value={formData[name] ?? ''}
            onChange={handleChange}
          />
        ) : (
          <input
            id={`shipping-${name}`}
            name={name}
            type="text"
            className={inputClass}
            value={formData[name] ?? ''}
            onChange={handleChange}
          />
        )}
        {hasError && (
          <p className={styles.errorMessage}>{t('errors.requiredField')}</p>
        )}
      </div>
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {renderField('recipientName', 'checkout.recipientName', true)}
      {renderField('street', 'checkout.address', true)}
      {renderField('city', 'checkout.city', true)}
      {renderField('postalCode', 'checkout.postalCode', true)}
      {renderField('phone', 'checkout.phone', true)}
      {renderField('deliveryNotes', 'checkout.deliveryNotes', false, true)}

      <div className={styles.actions}>
        <button type="submit" className={styles.nextButton}>
          {t('checkout.next')}
        </button>
      </div>
    </form>
  );
}
