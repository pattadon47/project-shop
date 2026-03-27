import { useState } from 'react';

// Mock types
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  items: OrderItem[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1029',
    date: '2026-03-20',
    total: 150.00,
    status: 'Delivered',
    items: [
      { productId: '1', name: 'Pro Running Shoes', price: 120.00, quantity: 1 },
      { productId: '2', name: 'Yoga Mat', price: 30.00, quantity: 1 }
    ]
  },
  {
    id: 'ORD-1035',
    date: '2026-03-25',
    total: 85.00,
    status: 'Shipped',
    items: [
      { productId: '3', name: 'Dumbbell Set', price: 85.00, quantity: 1 }
    ]
  }
];

const OrderHistory = () => {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>Order History</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`glass ${selectedOrder?.id === order.id ? 'active-order' : ''}`}
              style={{ 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                cursor: 'pointer',
                border: selectedOrder?.id === order.id ? '1px solid var(--primary)' : '1px solid var(--border-glass)'
              }}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{order.id}</h3>
                <span style={{ 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.8rem',
                  background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: order.status === 'Delivered' ? 'var(--success)' : 'var(--primary)'
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Date: {order.date}</div>
              <div style={{ marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>Total: ${order.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Order Details View */}
        {selectedOrder && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', height: 'fit-content', position: 'sticky', top: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Order Details</h2>
              <button 
                className="btn-danger" 
                style={{ padding: '0.3rem 0.8rem', background: 'transparent', border: '1px solid var(--border-glass)' }}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>
            
            <h3 style={{ marginBottom: '1rem' }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>${selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default OrderHistory;
