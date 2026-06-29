import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.companySection}>
          <div className={styles.companyName}>카타콤</div>
          <address className={styles.companyAddress}>
            서울특별시 강남구 테헤란로 123<br />
            06234 대한민국
          </address>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linksTitle}>{t('footer.customerService')}</div>
          <ul className={styles.linksList}>
            <li><Link to="/info/faq">FAQ</Link></li>
            <li><Link to="/info/contact">1:1 문의</Link></li>
            <li><Link to="/info/shipping">배송 안내</Link></li>
            <li><Link to="/info/returns">반품/교환</Link></li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linksTitle}>{t('footer.companyInfo')}</div>
          <ul className={styles.linksList}>
            <li><Link to="/info/terms">이용약관</Link></li>
            <li><Link to="/info/privacy">개인정보처리방침</Link></li>
            <li><Link to="/info/company">사업자정보</Link></li>
          </ul>
        </div>

        <div className={styles.paymentSection}>
          <div className={styles.paymentTitle}>결제수단</div>
          <div className={styles.visaIcon} aria-label="Visa">VISA</div>
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} 카타콤 (Catacomb). All rights reserved.
      </div>
    </footer>
  );
}
