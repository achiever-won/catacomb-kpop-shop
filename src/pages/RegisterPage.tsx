import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import type { RegistrationData } from '../types';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data: RegistrationData = {
      email,
      password,
      name,
      shippingAddress: {
        recipientName,
        street,
        city,
        postalCode,
        phone,
      },
    };

    const result = register(data);

    if (result.success) {
      navigate('/');
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('auth.registerTitle')}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-email">
            {t('auth.email')}
          </label>
          <input
            id="register-email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-password">
            {t('auth.password')}
          </label>
          <input
            id="register-password"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-name">
            {t('auth.name')}
          </label>
          <input
            id="register-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <h2 className={styles.sectionTitle}>{t('checkout.shipping')}</h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-recipient">
            {t('auth.recipientName')}
          </label>
          <input
            id="register-recipient"
            className={styles.input}
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-street">
            {t('auth.street')}
          </label>
          <input
            id="register-street"
            className={styles.input}
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            autoComplete="street-address"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-city">
            {t('auth.city')}
          </label>
          <input
            id="register-city"
            className={styles.input}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-postalCode">
            {t('auth.postalCode')}
          </label>
          <input
            id="register-postalCode"
            className={styles.input}
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            autoComplete="postal-code"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-phone">
            {t('auth.phone')}
          </label>
          <input
            id="register-phone"
            className={styles.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {t('auth.register')}
        </button>
      </form>

      <div className={styles.linkSection}>
        <span>{t('auth.haveAccount')} </span>
        <Link to="/login">{t('auth.login')}</Link>
      </div>
    </div>
  );
}
