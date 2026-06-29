import styles from './InfoPage.module.css';

export function FaqPage() {
  const faqs = [
    { q: '주문 후 배송까지 얼마나 걸리나요?', a: '주문 확인 후 영업일 기준 3~5일 이내에 배송됩니다. 주말 및 공휴일은 배송일에서 제외됩니다.' },
    { q: '해외 배송이 가능한가요?', a: '현재 국내 배송만 지원하고 있습니다. 해외 배송 서비스는 준비 중입니다.' },
    { q: '결제 수단은 어떤 것이 있나요?', a: 'Visa 카드 결제를 지원합니다.' },
    { q: '주문 취소는 어떻게 하나요?', a: '배송 준비 전 단계에서만 취소가 가능합니다. 마이페이지 > 주문내역에서 취소 요청을 해주세요.' },
    { q: '품절 상품은 재입고 되나요?', a: '인기 상품의 경우 재입고를 진행하고 있습니다. 상품 페이지에서 재입고 알림을 신청해주세요.' },
    { q: '포토카드는 랜덤인가요?', a: '네, 포토카드는 랜덤 발송되며 멤버 지정이 불가합니다.' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FAQ - 자주 묻는 질문</h1>
      {faqs.map((faq, i) => (
        <div key={i} className={styles.faqItem}>
          <p className={styles.faqQuestion}>Q. {faq.q}</p>
          <p className={styles.faqAnswer}>A. {faq.a}</p>
        </div>
      ))}
    </div>
  );
}
