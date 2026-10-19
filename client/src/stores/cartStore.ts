import { create } from 'zustand';
import { Cart } from '../types';
import { apiRequest } from '../services/api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const data = await apiRequest<{ cart: Cart }>('/cart');
      set({ cart: data.cart, isLoading: false });
    } catch (err) {
      set({ cart: null, isLoading: false });
    }
  },

  addItem: async (productId: string, quantity: number) => {
    try {
      set({ isLoading: true });
      const data = await apiRequest<{ cart: Cart }>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });
      set({ cart: data.cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const data = await apiRequest<{ cart: Cart }>(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      set({ cart: data.cart });
    } catch (err) {
      throw err;
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const data = await apiRequest<{ cart: Cart }>(`/cart/items/${itemId}`, {
        method: 'DELETE'
      });
      set({ cart: data.cart });
    } catch (err) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await apiRequest('/cart', { method: 'DELETE' });
      set({ cart: null });
    } catch (err) {
      // ignore
    }
  }
}));
