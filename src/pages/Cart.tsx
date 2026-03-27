import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService, orderService } from '../services/api';
import type { Cart, CartItem } from '../types';

const MOCK_CART: Cart = {
  id: 'cart_mock',
  isConfirmed: false,
  items: [
    { id: 'c1', productId: '1', name: 'Pro Running Shoes', price: 120.00, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
    { id: 'c2', productId: '2', name: 'Yoga Mat', price: 30.00, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1?w=200' },
  ],
};

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch {
        setCart(MOCK_CART);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (item: CartItem) => {
    if (!cart || cart.isConfirmed) return;
    try {
      const updated = await cartService.removeItem(item.id);
      setCart(updated);
    } catch {
      setCart({ ...cart, items: cart.items.filter(i => i.id !== item.id) });
    }
  };

  const clearCart = async () => {
    if (!cart || cart.isConfirmed) return;
    if (!confirm('Clear all items from cart?')) return;
    try {
      await cartService.clearCart();
      setCart({ ...cart, items: [] });
    } catch {
      setCart({ ...cart, items: [] });
    }
  };

  const confirmOrder = async () => {
    if (!cart || cart.items.length === 0 || cart.isConfirmed) return;
    setConfirming(true);
    try {
      const order = await orderService.confirmOrder();
      setCart({ ...cart, isConfirmed: true });
      alert(`✓ Order confirmed! Order ID: ${order.id}`);
      navigate('/orders');
    } catch {
      // Mock fallback
      setCart({ ...cart, isConfirmed: true });
      alert('✓ Order confirmed! (mock mode)');
      navigate('/orders');
    } finally {
      setConfirming(false);
    }
  };

  const total = (cart?.items || []).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isConfirmed = cart?.isConfirmed ?? false;

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading cart...</p>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

      {isConfirmed && (
        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>
          ✓ Order has been confirmed — this cart is now locked.
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.items.map(item => (
              <div key={item.id} className="glass" style={{ display: 'flex', padding: '1.2rem', borderRadius: '0.75rem', gap: '1.5rem', alignItems: 'center' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.4rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantity: {item.quantity}</p>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>฿{item.price.toFixed(2)} each</p>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                  ฿{(item.price * item.quantity).toFixed(2)}
                </div>
                {!isConfirmed && (
                  <button
                    className="btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flexShrink: 0 }}
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {!isConfirmed && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                <button
                  onClick={clearCart}
                  style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                  🗑️ Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', position: 'sticky', top: '6rem' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>฿{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', fontSize: '1.3rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>฿{total.toFixed(2)}</span>
            </div>

            {isConfirmed ? (
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', textAlign: 'center', fontWeight: 600 }}>
                ✓ Order Confirmed
              </div>
            ) : (
              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}
                onClick={confirmOrder}
                disabled={confirming}
              >
                {confirming ? 'Confirming...' : '✓ Confirm Order'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
