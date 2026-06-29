import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // product IDs
  toggle: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId: string) => {
        set((state) => {
          if (state.items.includes(productId)) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        });
      },

      isLiked: (productId: string) => {
        return get().items.includes(productId);
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    { name: 'catacomb-wishlist' }
  )
);
