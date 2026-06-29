import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, LogOut, Globe, Search } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import styles from './Header.module.css';

export function Header() {
  const { t } = useTranslation();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggle);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>♪</span>
          <span className={styles.logoText}>카타콤</span>
        </Link>

        <form className={styles.searchForm} action="#/search" method="get" role="search">
          <input
            type="text"
            name="q"
            className={styles.searchInput}
            placeholder={t('header.search') + '...'}
            aria-label={t('header.search')}
          />
          <button type="submit" className={styles.searchButton} aria-label={t('header.search')}>
            <Search size={18} />
          </button>
        </form>

        <nav className={styles.actions}>
          <button
            className={styles.iconButton}
            onClick={toggleLanguage}
            title={language === 'ko' ? 'English' : '한국어'}
          >
            <Globe size={20} />
            <span className={styles.iconLabel}>{language === 'ko' ? 'KO' : 'EN'}</span>
          </button>

          {isAuthenticated && user ? (
            <div className={styles.userMenu}>
              <Link to="/orders" className={styles.iconButton} title={user.name}>
                <User size={20} />
                <span className={styles.iconLabel}>{user.name.slice(0, 4)}</span>
              </Link>
              <button className={styles.iconButton} onClick={logout} title={t('header.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.iconButton} title={t('header.login')}>
              <User size={20} />
              <span className={styles.iconLabel}>{t('header.login')}</span>
            </Link>
          )}

          <Link to="/cart" className={styles.cartButton} title={t('header.cart')}>
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className={styles.cartBadge}>{cartItemCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
