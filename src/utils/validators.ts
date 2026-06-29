import type { ShippingAddress, PaymentInfo } from '../types';

/**
 * Validates an email address using a simplified RFC 5322 pattern.
 * Checks for: local@domain.tld format with basic structure validation.
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: '올바른 이메일 형식이 아닙니다' };
  }

  // Simplified RFC 5322 email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return { valid: false, error: '올바른 이메일 형식이 아닙니다' };
  }

  return { valid: true };
}

/**
 * Validates a password for length constraints (8-64 characters).
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: '비밀번호는 최소 8자 이상이어야 합니다' };
  }

  if (password.length > 64) {
    return { valid: false, error: '비밀번호는 최대 64자까지 가능합니다' };
  }

  return { valid: true };
}

/**
 * Validates a card number using the Luhn algorithm.
 * The card number must be a string of exactly 16 digits.
 */
export function validateLuhn(cardNumber: string): boolean {
  // Must be exactly 16 digits
  if (!/^\d{16}$/.test(cardNumber)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < cardNumber.length; i++) {
    let digit = parseInt(cardNumber[cardNumber.length - 1 - i], 10);

    // Double every second digit from the right (index 1, 3, 5, ...)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Validates a CVV code — must be exactly 3 digits.
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3}$/.test(cvv);
}

/**
 * Validates a card expiration date in MM/YY format.
 * Returns true if the card is not expired (expiry month/year >= current month/year).
 * @param mmyy - Expiration date in "MM/YY" format
 * @param now - Optional current date for testing (defaults to new Date())
 */
export function validateCardExpiry(mmyy: string, now?: Date): boolean {
  // Validate format
  if (!/^\d{2}\/\d{2}$/.test(mmyy)) {
    return false;
  }

  const [monthStr, yearStr] = mmyy.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000; // Convert YY to YYYY

  // Validate month range
  if (month < 1 || month > 12) {
    return false;
  }

  const currentDate = now || new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
  const currentYear = currentDate.getFullYear();

  // Card is valid if expiry is in the current month or later
  if (year > currentYear) {
    return true;
  }
  if (year === currentYear && month >= currentMonth) {
    return true;
  }

  return false;
}

/**
 * Validates a shipping form, returning an object with field-specific error messages.
 * Returns an empty object if all fields are valid.
 */
export function validateShippingForm(data: Partial<ShippingAddress>): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: (keyof ShippingAddress)[] = [
    'recipientName',
    'street',
    'city',
    'postalCode',
    'phone',
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      errors[field] = '필수 입력 항목입니다';
    }
  }

  return errors;
}

/**
 * Validates a payment form, returning an object with field-specific error messages.
 * Checks: required fields, Luhn validation, CVV format, and card expiry.
 * Returns an empty object if all fields are valid.
 */
export function validatePaymentForm(data: Partial<PaymentInfo>): Record<string, string> {
  const errors: Record<string, string> = {};

  // Check required fields first
  if (!data.cardNumber || data.cardNumber.trim().length === 0) {
    errors.cardNumber = '필수 입력 항목입니다';
  } else if (!validateLuhn(data.cardNumber)) {
    errors.cardNumber = '유효하지 않은 카드 번호입니다';
  }

  if (!data.cardholderName || data.cardholderName.trim().length === 0) {
    errors.cardholderName = '필수 입력 항목입니다';
  }

  if (!data.expirationDate || data.expirationDate.trim().length === 0) {
    errors.expirationDate = '필수 입력 항목입니다';
  } else if (!validateCardExpiry(data.expirationDate)) {
    errors.expirationDate = '만료된 카드입니다';
  }

  if (!data.cvv || data.cvv.trim().length === 0) {
    errors.cvv = '필수 입력 항목입니다';
  } else if (!validateCVV(data.cvv)) {
    errors.cvv = 'CVV는 3자리 숫자여야 합니다';
  }

  return errors;
}
