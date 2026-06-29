import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('general.notFoundTitle')}</h1>
      <p className={styles.message}>{t('general.notFoundMessage')}</p>
      <Link to="/" className={styles.homeLink}>
        {t('general.returnToHome')}
      </Link>
    </div>
  );
}
