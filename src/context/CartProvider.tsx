import { useState, useCallback, type ReactNode } from 'react';
import { CartContext } from './CartContext';
import type { CartDetailItem } from '../types';
import { cartService } from '../services/api';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId]     = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartDetailItem[]>([]);

  const refreshCart = useCallback(async () => {
    try {
      const check = await cartService.checkCart();
      if (check.cartExist && check.carts.length > 0) {
        const activeCart = check.carts[0];
        setCartId(activeCart.cartId);
        const items: CartDetailItem[] = await cartService.getCartDetail(activeCart.cartId);
        setCartItems(items);
      } else {
        setCartId(null);
        setCartItems([]);
      }
    } catch {
      setCartId(null);
      setCartItems([]);
    }
  }, []);

  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cartId, cartItems, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
