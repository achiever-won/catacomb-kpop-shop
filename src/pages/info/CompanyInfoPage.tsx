import styles from './InfoPage.module.css';

export function CompanyInfoPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>사업자정보</h1>

      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <th>상호명</th>
            <td>주식회사 카타콤 (Catacomb Inc.)</td>
          </tr>
          <tr>
            <th>대표이사</th>
            <td>김카타</td>
          </tr>
          <tr>
            <th>사업자등록번호</th>
            <td>123-45-67890</td>
          </tr>
          <tr>
            <th>통신판매업 신고</th>
            <td>제2024-서울강남-12345호</td>
          </tr>
          <tr>
            <th>소재지</th>
            <td>서울특별시 강남구 테헤란로 123, 카타콤빌딩 5층</td>
          </tr>
          <tr>
            <th>우편번호</th>
            <td>06234</td>
          </tr>
          <tr>
            <th>대표전화</th>
            <td>02-1234-5678</td>
          </tr>
          <tr>
            <th>팩스</th>
            <td>02-1234-5679</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>info@catacomb.kr</td>
          </tr>
          <tr>
            <th>고객센터 운영시간</th>
            <td>평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00, 주말/공휴일 휴무)</td>
          </tr>
          <tr>
            <th>개인정보보호책임자</th>
            <td>홍길동 (privacy@catacomb.kr)</td>
          </tr>
        </tbody>
      </table>

      <p className={styles.text} style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
        ※ 본 정보는 데모 사이트용으로 작성된 것으로 실제 사업자 정보가 아닙니다.
      </p>
    </div>
  );
}
