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
            <li><a href="#">FAQ</a></li>
            <li><a href="#">1:1 문의</a></li>
            <li><a href="#">배송 안내</a></li>
            <li><a href="#">반품/교환</a></li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linksTitle}>{t('footer.companyInfo')}</div>
          <ul className={styles.linksList}>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">사업자정보</a></li>
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
