/**
 * Order-related utility functions.
 */

import type { CartItem } from '../types';

/**
 * Generates an order ID in the format "ORD-YYYYMMDD-XXXXX"
 * where YYYYMMDD is derived from the given date and XXXXX is 5 random digits.
 */
export function generateOrderId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  const randomPart = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  return `ORD-${datePart}-${randomPart}`;
}

/**
 * Calculates the estimated delivery date: 3-5 business days from the order date.
 * Business days exclude Saturdays (6) and Sundays (0).
 * Returns a date that is exactly 5 business days after the order date
 * (worst case for the "3-5 business days" range).
 */
export function calculateEstimatedDelivery(orderDate: Date): Date {
  const delivery = new Date(orderDate);
  let businessDaysAdded = 0;
  const targetDays = 5;

  while (businessDaysAdded < targetDays) {
    delivery.setDate(delivery.getDate() + 1);
    const dayOfWeek = delivery.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }

  return delivery;
}

/**
 * Calculates the total order amount including shipping fee.
 * Total = sum of (unit price × quantity) for all items + shipping fee.
 */
export function calculateOrderTotal(items: CartItem[], shippingFee: number): number {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return subtotal + shippingFee;
}
