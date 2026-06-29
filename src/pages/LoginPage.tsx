import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { demoUser, demoPassword } from '../data/demo';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(t('errors.invalidCredentials'));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('auth.loginTitle')}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            {t('auth.email')}
          </label>
          <input
            id="login-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            {t('auth.password')}
          </label>
          <input
            id="login-password"
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {t('auth.login')}
        </button>
      </form>

      <div className={styles.linkSection}>
        <span>{t('auth.noAccount')} </span>
        <Link to="/register">{t('auth.register')}</Link>
      </div>
    </div>
  );
}
