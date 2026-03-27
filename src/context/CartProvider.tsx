import { useState, useCallback, type ReactNode } from 'react';
import { CartContext } from './CartContext';
import type { Cart } from '../types';
import { cartService } from '../services/api';

const MOCK_CART: Cart = {
  id: 'cart_mock',
  items: [],
  isConfirmed: false,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      // API not ready yet — use empty mock
      setCart(MOCK_CART);
    }
  }, []);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
