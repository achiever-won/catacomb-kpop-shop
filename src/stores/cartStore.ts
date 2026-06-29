import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { getProductById } from '../data/products';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  removeStaleItems: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id
          );

          if (existing) {
            if (existing.quantity >= 99) {
              return state;
            }
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { productId: product.id, product, quantity: 1 },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        const clamped = Math.max(1, Math.min(99, quantity));
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: clamped }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      removeStaleItems: () => {
        set((state) => {
          const validItems = state.items.filter((item) => {
            const product = getProductById(item.productId);
            if (!product) {
              console.warn(
                `[CartStore] Removing stale cart item: product "${item.productId}" no longer exists in catalog.`
              );
              return false;
            }
            return true;
          });
          if (validItems.length !== state.items.length) {
            return { items: validItems };
          }
          return state;
        });
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'catacomb-cart',
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (value === null) return null;
            return JSON.parse(value);
          } catch {
            console.error(
              `[CartStore] Failed to parse localStorage key "${name}". Resetting to empty cart.`
            );
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
