import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../../stores/cartStore';
import type { Product } from '../../../types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'test-product-001',
  name: 'Test Album',
  description: 'A test product',
  price: 15000,
  imageUrl: '/images/test.jpg',
  mainCategory: 'K-POP Goods',
  subCategory: 'Albums',
  inStock: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  describe('addItem', () => {
    it('adds a new product with quantity 1', () => {
      const product = makeProduct();
      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('test-product-001');
      expect(items[0].quantity).toBe(1);
      expect(items[0].product).toEqual(product);
    });

    it('increments quantity when product already in cart', () => {
      const product = makeProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it('caps quantity at 99', () => {
      const product = makeProduct();
      useCartStore.setState({
        items: [{ productId: product.id, product, quantity: 99 }],
      });

      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(99);
    });

    it('adds different products as separate items', () => {
      const product1 = makeProduct({ id: 'prod-1', name: 'Product 1' });
      const product2 = makeProduct({ id: 'prod-2', name: 'Product 2' });

      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      expect(useCartStore.getState().items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes the specified item from the cart', () => {
      const product = makeProduct();
      useCartStore.setState({
        items: [{ productId: product.id, product, quantity: 3 }],
      });

      useCartStore.getState().removeItem(product.id);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('does not affect other items', () => {
      const product1 = makeProduct({ id: 'prod-1' });
      const product2 = makeProduct({ id: 'prod-2' });
      useCartStore.setState({
        items: [
          { productId: 'prod-1', product: product1, quantity: 1 },
          { productId: 'prod-2', product: product2, quantity: 2 },
        ],
      });

      useCartStore.getState().removeItem('prod-1');

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('prod-2');
    });
  });

  describe('updateQuantity', () => {
    it('sets quantity directly', () => {
      const product = makeProduct();
      useCartStore.setState({
        items: [{ productId: product.id, product, quantity: 1 }],
      });

      useCartStore.getState().updateQuantity(product.id, 5);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('clamps quantity to minimum of 1', () => {
      const product = makeProduct();
      useCartStore.setState({
        items: [{ productId: product.id, product, quantity: 5 }],
      });

      useCartStore.getState().updateQuantity(product.id, 0);

      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });

    it('clamps quantity to maximum of 99', () => {
      const product = makeProduct();
      useCartStore.setState({
        items: [{ productId: product.id, product, quantity: 5 }],
      });

      useCartStore.getState().updateQuantity(product.id, 150);

      expect(useCartStore.getState().items[0].quantity).toBe(99);
    });
  });

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      const product1 = makeProduct({ id: 'prod-1' });
      const product2 = makeProduct({ id: 'prod-2' });
      useCartStore.setState({
        items: [
          { productId: 'prod-1', product: product1, quantity: 1 },
          { productId: 'prod-2', product: product2, quantity: 2 },
        ],
      });

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('getTotal', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getTotal()).toBe(0);
    });

    it('calculates sum of price × quantity for all items', () => {
      const product1 = makeProduct({ id: 'prod-1', price: 10000 });
      const product2 = makeProduct({ id: 'prod-2', price: 25000 });
      useCartStore.setState({
        items: [
          { productId: 'prod-1', product: product1, quantity: 2 },
          { productId: 'prod-2', product: product2, quantity: 3 },
        ],
      });

      // 10000*2 + 25000*3 = 20000 + 75000 = 95000
      expect(useCartStore.getState().getTotal()).toBe(95000);
    });
  });

  describe('getItemCount', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });

    it('returns number of distinct products', () => {
      const product1 = makeProduct({ id: 'prod-1' });
      const product2 = makeProduct({ id: 'prod-2' });
      useCartStore.setState({
        items: [
          { productId: 'prod-1', product: product1, quantity: 5 },
          { productId: 'prod-2', product: product2, quantity: 10 },
        ],
      });

      expect(useCartStore.getState().getItemCount()).toBe(2);
    });
  });
});
