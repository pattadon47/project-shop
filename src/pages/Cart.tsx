import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions for mock cart
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const MOCK_CART: CartItem[] = [
  { id: 'c1', productId: '1', name: 'Pro Running Shoes', price: 120.00, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 'c2', productId: '2', name: 'Yoga Mat', price: 30.00, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1' }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const removeItem = (id: string) => {
    if (isConfirmed) return; // Cannot delete if confirmed
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (isConfirmed) return; 
    setCartItems([]);
  };

  const confirmOrder = () => {
    if (cartItems.length === 0) return;
    setIsConfirmed(true);
    alert('Order confirmed successfully! You can no longer edit this cart.');
  };

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem' }}>
          <h2>Your cart is empty</h2>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass" style={{ display: 'flex', padding: '1rem', borderRadius: '0.5rem', gap: '1.5rem', alignItems: 'center' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
                
                {!isConfirmed && (
                  <button className="btn-danger" onClick={() => removeItem(item.id)} style={{ padding: '0.4rem 0.8rem' }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            {!isConfirmed && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                <button className="btn-danger" onClick={clearCart} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', height: 'fit-content' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
            
            {isConfirmed ? (
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--success)', color: 'white', borderRadius: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                Order Formally Confirmed!
              </div>
            ) : (
              <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} onClick={confirmOrder}>
                Confirm Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
