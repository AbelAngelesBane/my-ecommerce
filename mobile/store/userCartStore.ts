import { create } from 'zustand';
import { Product } from '@/types/types';

interface CartState {
  items: Product[];
  // Action to add item
  addItem: (product: Product) => void;
  // Action to clear cart
  clearCart: () => void;
  // Computed value (like useMemo, but built-in)
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product) => 
    set((state) => ({ 
      items: [...state.items, product] 
    })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    //snowball
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));