import styles from './InfoPage.module.css';

export function ShippingInfoPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>배송 안내</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>배송 기간</h2>
        <p className={styles.text}>주문 확인 후 영업일 기준 3~5일 이내에 배송됩니다.</p>
        <p className={styles.text}>주말 및 공휴일은 배송일에서 제외되며, 도서산간 지역은 1~2일이 추가 소요될 수 있습니다.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>배송비</h2>
        <p className={styles.text}>전 상품 ₩3,000 (부가세 포함)</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>배송 추적</h2>
        <p className={styles.text}>배송이 시작되면 주문내역 페이지에서 배송 상태를 확인하실 수 있습니다.</p>
        <p className={styles.text}>배송 상태: 배송준비중 → 배송중 → 배송완료</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>주의사항</h2>
        <p className={styles.text}>• 부정확한 주소 입력으로 인한 배송 오류는 재발송이 어려울 수 있습니다.</p>
        <p className={styles.text}>• 천재지변 및 택배사 사정에 따라 배송이 지연될 수 있습니다.</p>
      </div>
    </div>
  );
}
