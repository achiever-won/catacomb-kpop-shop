import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateLuhn,
  validateCVV,
  validateCardExpiry,
  validateShippingForm,
  validatePaymentForm,
} from '../../../utils/validators';

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
    expect(validateEmail('demo@catacomb.kr')).toEqual({ valid: true });
    expect(validateEmail('test.user+tag@domain.co.kr')).toEqual({ valid: true });
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('올바른 이메일 형식이 아닙니다');
  });

  it('should reject email without @', () => {
    expect(validateEmail('userexample.com').valid).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('user@').valid).toBe(false);
  });

  it('should reject email without TLD', () => {
    expect(validateEmail('user@domain').valid).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept valid passwords (8-64 chars)', () => {
    expect(validatePassword('demo1234')).toEqual({ valid: true });
    expect(validatePassword('a'.repeat(64))).toEqual({ valid: true });
    expect(validatePassword('12345678')).toEqual({ valid: true });
  });

  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePassword('short');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('비밀번호는 최소 8자 이상이어야 합니다');
  });

  it('should reject passwords longer than 64 characters', () => {
    const result = validatePassword('a'.repeat(65));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('비밀번호는 최대 64자까지 가능합니다');
  });

  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('비밀번호는 최소 8자 이상이어야 합니다');
  });
});

describe('validateLuhn', () => {
  it('should accept valid Luhn numbers', () => {
    // Known valid Visa test numbers
    expect(validateLuhn('4111111111111111')).toBe(true);
    expect(validateLuhn('4532015112830366')).toBe(true);
  });

  it('should reject invalid Luhn numbers', () => {
    expect(validateLuhn('4111111111111112')).toBe(false);
    expect(validateLuhn('1234567890123456')).toBe(false);
  });

  it('should reject non-16-digit strings', () => {
    expect(validateLuhn('411111111111')).toBe(false);
    expect(validateLuhn('41111111111111111')).toBe(false);
    expect(validateLuhn('abcdefghijklmnop')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validateLuhn('')).toBe(false);
  });
});

describe('validateCVV', () => {
  it('should accept valid 3-digit CVV', () => {
    expect(validateCVV('123')).toBe(true);
    expect(validateCVV('000')).toBe(true);
    expect(validateCVV('999')).toBe(true);
  });

  it('should reject non-3-digit strings', () => {
    expect(validateCVV('12')).toBe(false);
    expect(validateCVV('1234')).toBe(false);
    expect(validateCVV('abc')).toBe(false);
    expect(validateCVV('')).toBe(false);
  });
});

describe('validateCardExpiry', () => {
  it('should accept future expiry dates', () => {
    const now = new Date(2024, 5, 15); // June 2024
    expect(validateCardExpiry('12/28', now)).toBe(true);
    expect(validateCardExpiry('07/24', now)).toBe(true);
  });

  it('should accept current month', () => {
    const now = new Date(2024, 5, 15); // June 2024
    expect(validateCardExpiry('06/24', now)).toBe(true);
  });

  it('should reject expired dates', () => {
    const now = new Date(2024, 5, 15); // June 2024
    expect(validateCardExpiry('05/24', now)).toBe(false);
    expect(validateCardExpiry('12/23', now)).toBe(false);
  });

  it('should reject invalid format', () => {
    expect(validateCardExpiry('1324', new Date())).toBe(false);
    expect(validateCardExpiry('13/24', new Date())).toBe(false);
    expect(validateCardExpiry('00/24', new Date())).toBe(false);
    expect(validateCardExpiry('', new Date())).toBe(false);
  });
});

describe('validateShippingForm', () => {
  it('should return no errors for complete valid form', () => {
    const data = {
      recipientName: '홍길동',
      street: '서울특별시 강남구 테헤란로 123',
      city: '서울',
      postalCode: '06234',
      phone: '010-1234-5678',
    };
    expect(validateShippingForm(data)).toEqual({});
  });

  it('should return errors for all empty required fields', () => {
    const errors = validateShippingForm({});
    expect(errors.recipientName).toBe('필수 입력 항목입니다');
    expect(errors.street).toBe('필수 입력 항목입니다');
    expect(errors.city).toBe('필수 입력 항목입니다');
    expect(errors.postalCode).toBe('필수 입력 항목입니다');
    expect(errors.phone).toBe('필수 입력 항목입니다');
  });

  it('should not require deliveryNotes', () => {
    const data = {
      recipientName: '홍길동',
      street: '서울특별시 강남구',
      city: '서울',
      postalCode: '06234',
      phone: '010-1234-5678',
    };
    const errors = validateShippingForm(data);
    expect(errors.deliveryNotes).toBeUndefined();
  });
});

describe('validatePaymentForm', () => {
  it('should return no errors for valid payment form', () => {
    const data = {
      cardNumber: '4111111111111111',
      cardholderName: 'Demo User',
      expirationDate: '12/28',
      cvv: '123',
    };
    expect(validatePaymentForm(data)).toEqual({});
  });

  it('should return errors for all empty fields', () => {
    const errors = validatePaymentForm({});
    expect(errors.cardNumber).toBe('필수 입력 항목입니다');
    expect(errors.cardholderName).toBe('필수 입력 항목입니다');
    expect(errors.expirationDate).toBe('필수 입력 항목입니다');
    expect(errors.cvv).toBe('필수 입력 항목입니다');
  });

  it('should return Luhn error for invalid card number', () => {
    const data = {
      cardNumber: '4111111111111112',
      cardholderName: 'Demo User',
      expirationDate: '12/28',
      cvv: '123',
    };
    const errors = validatePaymentForm(data);
    expect(errors.cardNumber).toBe('유효하지 않은 카드 번호입니다');
  });

  it('should return expired card error', () => {
    const data = {
      cardNumber: '4111111111111111',
      cardholderName: 'Demo User',
      expirationDate: '01/20',
      cvv: '123',
    };
    const errors = validatePaymentForm(data);
    expect(errors.expirationDate).toBe('만료된 카드입니다');
  });

  it('should return CVV error for invalid CVV', () => {
    const data = {
      cardNumber: '4111111111111111',
      cardholderName: 'Demo User',
      expirationDate: '12/28',
      cvv: '12',
    };
    const errors = validatePaymentForm(data);
    expect(errors.cvv).toBe('CVV는 3자리 숫자여야 합니다');
  });
});
