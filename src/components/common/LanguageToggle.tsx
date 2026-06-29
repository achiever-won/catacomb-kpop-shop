import { useLanguageStore } from '../../stores/languageStore';
import styles from './LanguageToggle.module.css';

export function LanguageToggle() {
  const { language, toggle } = useLanguageStore();

  const label = language === 'ko' ? '한국어' : 'English';

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Current language: ${label}. Click to switch.`}
    >
      {label}
    </button>
  );
}
