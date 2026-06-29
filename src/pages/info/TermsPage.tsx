import styles from './InfoPage.module.css';

export function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이용약관</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
        <p className={styles.text}>이 약관은 카타콤(이하 "회사")이 운영하는 인터넷 쇼핑몰에서 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>제2조 (정의)</h2>
        <p className={styles.text}>① "쇼핑몰"이란 회사가 상품을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 상품을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</p>
        <p className={styles.text}>② "이용자"란 쇼핑몰에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>제3조 (약관의 게시와 개정)</h2>
        <p className={styles.text}>① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 쇼핑몰의 초기 서비스 화면에 게시합니다.</p>
        <p className={styles.text}>② 회사는 관련 법률을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>제4조 (서비스의 제공 및 변경)</h2>
        <p className={styles.text}>① 회사는 다음과 같은 업무를 수행합니다: 상품에 대한 정보 제공 및 구매계약의 체결, 구매계약이 체결된 상품의 배송, 기타 회사가 정하는 업무</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>제5조 (서비스의 중단)</h2>
        <p className={styles.text}>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
      </div>

      <p className={styles.text} style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
        ※ 본 약관은 데모 사이트용으로 작성된 것으로 법적 효력이 없습니다.
      </p>
    </div>
  );
}
