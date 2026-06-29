import { describe, it, expect } from 'vitest';
import { products, getProductsByMainCategory, getProductsBySubCategory, getProductById } from './products';
import { categories } from './categories';
import { demoUser, demoPassword, demoCard, demoAddress, demoOrders } from './demo';

describe('Product Data Generation', () => {
  it('generates approximately 200 K-POP products', () => {
    const kpopProducts = getProductsByMainCategory('K-POP Goods');
    expect(kpopProducts.length).toBeGreaterThanOrEqual(180);
    expect(kpopProducts.length).toBeLessThanOrEqual(220);
  });

  it('generates approximately 200 K-WEBTOON products', () => {
    const webtoonProducts = getProductsByMainCategory('K-WEBTOON Goods');
    expect(webtoonProducts.length).toBeGreaterThanOrEqual(180);
    expect(webtoonProducts.length).toBeLessThanOrEqual(220);
  });

  it('distributes K-POP products across 7 sub-categories', () => {
    const kpopCategory = categories[0];
    expect(kpopCategory.subCategories).toHaveLength(7);

    for (const sub of kpopCategory.subCategories) {
      const count = getProductsBySubCategory('K-POP Goods', sub).length;
      expect(count).toBeGreaterThanOrEqual(28);
      expect(count).toBeLessThanOrEqual(30);
    }
  });

  it('distributes K-WEBTOON products across 7 sub-categories', () => {
    const webtoonCategory = categories[1];
    expect(webtoonCategory.subCategories).toHaveLength(7);

    for (const sub of webtoonCategory.subCategories) {
      const count = getProductsBySubCategory('K-WEBTOON Goods', sub).length;
      expect(count).toBeGreaterThanOrEqual(28);
      expect(count).toBeLessThanOrEqual(30);
    }
  });

  it('generates prices between ₩5,000 and ₩150,000', () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThanOrEqual(5000);
      expect(product.price).toBeLessThanOrEqual(150000);
    }
  });

  it('marks approximately 10% of products as out of stock', () => {
    const outOfStock = products.filter((p) => !p.inStock);
    const ratio = outOfStock.length / products.length;
    expect(ratio).toBeGreaterThanOrEqual(0.05);
    expect(ratio).toBeLessThanOrEqual(0.20);
  });

  it('generates deterministic data with seed', () => {
    // Products should be the same on each run
    const first = products[0];
    expect(first.id).toMatch(/^kpop-/);
    expect(first.mainCategory).toBe('K-POP Goods');
  });

  it('each product has valid fields', () => {
    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.name.length).toBeLessThanOrEqual(100);
      expect(product.description).toBeTruthy();
      expect(product.imageUrl).toBeTruthy();
      expect(product.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(['K-POP Goods', 'K-WEBTOON Goods']).toContain(product.mainCategory);
    }
  });

  it('getProductById returns correct product', () => {
    const first = products[0];
    expect(getProductById(first.id)).toEqual(first);
    expect(getProductById('nonexistent')).toBeUndefined();
  });
});

describe('Categories', () => {
  it('has exactly 2 main categories', () => {
    expect(categories).toHaveLength(2);
  });

  it('K-POP has correct sub-categories', () => {
    const kpop = categories[0];
    expect(kpop.name).toBe('K-POP Goods');
    expect(kpop.subCategories).toEqual([
      'Albums', 'Photocards', 'Light Sticks', 'Apparel', 'Accessories', 'Posters', 'Stationery',
    ]);
  });

  it('K-WEBTOON has correct sub-categories', () => {
    const webtoon = categories[1];
    expect(webtoon.name).toBe('K-WEBTOON Goods');
    expect(webtoon.subCategories).toEqual([
      'Figures', 'Art Books', 'Apparel', 'Phone Cases', 'Stickers', 'Keychains', 'Home Decor',
    ]);
  });
});

describe('Demo Data', () => {
  it('demo user has correct credentials', () => {
    expect(demoUser.email).toBe('demo@catacomb.kr');
    expect(demoPassword).toBe('demo1234');
    expect(demoUser.name).toBe('데모 사용자');
  });

  it('demo address is correct', () => {
    expect(demoAddress.city).toBe('서울특별시 강남구');
    expect(demoAddress.street).toBe('테헤란로 123');
    expect(demoAddress.postalCode).toBe('06234');
  });

  it('demo card has valid Luhn number', () => {
    expect(demoCard.cardNumber).toBe('4111111111111111');
    expect(demoCard.cardholderName).toBe('Demo User');
    expect(demoCard.expirationDate).toBe('12/28');
    expect(demoCard.cvv).toBe('123');
  });

  it('has 3 demo orders with distinct statuses', () => {
    expect(demoOrders).toHaveLength(3);
    const statuses = demoOrders.map((o) => o.status);
    expect(statuses).toContain('배송준비중');
    expect(statuses).toContain('배송중');
    expect(statuses).toContain('배송완료');
  });

  it('demo orders have valid structure', () => {
    for (const order of demoOrders) {
      expect(order.orderId).toMatch(/^ORD-\d{8}-\d{5}$/);
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.shippingFee).toBe(3000);
      expect(order.totalAmount).toBeGreaterThan(0);
      expect(order.orderDate).toBeTruthy();
      expect(order.estimatedDelivery).toBeTruthy();
    }
  });

  it('demo order totals include items + shipping', () => {
    for (const order of demoOrders) {
      const itemsTotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
      expect(order.totalAmount).toBe(itemsTotal + order.shippingFee);
    }
  });
});
