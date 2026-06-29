import styles from './InfoPage.module.css';

export function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>개인정보처리방침</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 수집하는 개인정보 항목</h2>
        <p className={styles.text}>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
        <p className={styles.text}>• 필수항목: 이메일, 비밀번호, 이름, 배송주소, 연락처</p>
        <p className={styles.text}>• 결제 시: 카드번호, 카드 소유자명, 유효기간, CVV (결제 처리 후 즉시 파기)</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 개인정보의 수집 및 이용 목적</h2>
        <p className={styles.text}>• 회원 가입 및 관리</p>
        <p className={styles.text}>• 상품 주문 및 배송</p>
        <p className={styles.text}>• 결제 및 환불 처리</p>
        <p className={styles.text}>• 고객 문의 응대</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용 기간</h2>
        <p className={styles.text}>회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
        <p className={styles.text}>• 계약 또는 청약철회에 관한 기록: 5년</p>
        <p className={styles.text}>• 대금결제 및 재화 등의 공급에 관한 기록: 5년</p>
        <p className={styles.text}>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. 개인정보의 파기</h2>
        <p className={styles.text}>보유 기간이 경과하거나 처리 목적이 달성된 경우, 지체 없이 해당 개인정보를 파기합니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. 개인정보 보호 책임자</h2>
        <p className={styles.text}>성명: 홍길동</p>
        <p className={styles.text}>직위: 개인정보보호팀장</p>
        <p className={styles.text}>이메일: privacy@catacomb.kr</p>
      </div>

      <p className={styles.text} style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
        ※ 본 방침은 데모 사이트용으로 작성된 것으로 법적 효력이 없습니다.
      </p>
    </div>
  );
}
