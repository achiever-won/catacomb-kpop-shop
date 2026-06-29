import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import styles from './Header.module.css';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggle);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} aria-label="카타콤 홈">
        카타콤
      </Link>

      <div className={styles.searchBar}>
        <form className={styles.searchForm} onSubmit={handleSearch} role="search">
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('header.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('header.search')}
          />
          <button type="submit" className={styles.searchButton}>
            {t('header.search')}
          </button>
        </form>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.languageToggle}
          onClick={toggleLanguage}
          aria-label={t('language.' + (language === 'ko' ? 'en' : 'ko'))}
        >
          {language === 'ko' ? t('language.ko') : t('language.en')}
        </button>

        {isAuthenticated && user ? (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutButton} onClick={logout}>
              {t('header.logout')}
            </button>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login">{t('header.login')}</Link>
            <span>/</span>
            <Link to="/register">{t('header.register')}</Link>
          </div>
        )}

        <Link to="/cart" className={styles.cartLink} aria-label={t('header.cart')}>
          🛒
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
