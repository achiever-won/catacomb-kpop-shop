import { useState } from 'react';
import styles from './InfoPage.module.css';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>1:1 문의</h1>
        <div className={styles.section}>
          <p className={styles.text}>✅ 문의가 접수되었습니다. 영업일 기준 1~2일 이내에 답변 드리겠습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>1:1 문의</h1>
      <p className={styles.text}>궁금한 점이나 불편한 사항을 남겨주세요. 빠르게 답변 드리겠습니다.</p>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>제목</label>
          <input className={styles.formInput} type="text" placeholder="문의 제목을 입력해주세요" required />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>이메일</label>
          <input className={styles.formInput} type="email" placeholder="답변 받으실 이메일" required />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>문의 내용</label>
          <textarea className={styles.formTextarea} placeholder="문의 내용을 상세히 적어주세요" required />
        </div>
        <button type="submit" className={styles.submitButton}>문의 접수</button>
      </form>
    </div>
  );
}
