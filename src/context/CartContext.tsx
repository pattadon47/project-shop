import { createContext, useContext } from 'react';
import type { Cart } from '../types';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
