import styles from './InfoPage.module.css';

export function ReturnPolicyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>반품/교환 안내</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>반품/교환 가능 기간</h2>
        <p className={styles.text}>상품 수령일로부터 7일 이내에 반품/교환 신청이 가능합니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>반품/교환 가능 사유</h2>
        <p className={styles.text}>• 상품이 파손된 상태로 배송된 경우</p>
        <p className={styles.text}>• 주문한 상품과 다른 상품이 배송된 경우</p>
        <p className={styles.text}>• 상품의 하자가 있는 경우</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>반품/교환 불가 사유</h2>
        <p className={styles.text}>• 고객 변심으로 인한 반품 (포장 개봉 후)</p>
        <p className={styles.text}>• 포토카드, 앨범 등 랜덤 상품의 구성 불만</p>
        <p className={styles.text}>• 사용 흔적이 있는 상품</p>
        <p className={styles.text}>• 상품 수령 후 7일이 경과한 경우</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>반품 배송비</h2>
        <p className={styles.text}>• 판매자 귀책 (파손, 오배송): 무료</p>
        <p className={styles.text}>• 구매자 변심: 왕복 배송비 ₩6,000 부담</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>환불 안내</h2>
        <p className={styles.text}>반품 상품 확인 후 영업일 기준 3~5일 이내에 결제 수단으로 환불됩니다.</p>
      </div>
    </div>
  );
}
