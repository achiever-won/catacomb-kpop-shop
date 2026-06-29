import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setError(t('errors.searchMinLength'));
      return;
    }

    setError('');
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
          }}
          placeholder={t('header.search')}
          aria-label={t('header.search')}
        />
        <button type="submit" className={styles.button} aria-label={t('header.search')}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
