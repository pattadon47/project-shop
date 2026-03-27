import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import type { Order } from '../types';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:   { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  Confirmed: { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa' },
  Shipped:   { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa' },
  Delivered: { bg: 'rgba(16,185,129,0.15)',  text: 'var(--success)' },
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1029', date: '2026-03-20', total: 150.00, status: 'Delivered',
    items: [
      { productId: '1', name: 'Pro Running Shoes', price: 120.00, quantity: 1 },
      { productId: '2', name: 'Yoga Mat', price: 30.00, quantity: 1 },
    ]
  },
  {
    id: 'ORD-1035', date: '2026-03-25', total: 85.00, status: 'Shipped',
    items: [{ productId: '3', name: 'Dumbbell Set', price: 85.00, quantity: 1 }]
  },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading orders...</p>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>Order History</h1>

      {orders.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h2>No orders yet</h2>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Orders list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  className="glass"
                  onClick={() => setSelectedOrder(isSelected ? null : order)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                    transition: 'border 0.2s, transform 0.2s',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0 }}>{order.id}</h3>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', background: colors.bg, color: colors.text, fontWeight: 600 }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📅 {order.date}</p>
                  <p style={{ fontWeight: 700, fontSize: '1.15rem' }}>฿{order.total.toFixed(2)}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{order.items.length} item(s) — click to view details</p>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedOrder && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', position: 'sticky', top: '6rem', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h2 style={{ margin: 0 }}>Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer' }}>✕ Close</button>
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong>{' '}
                  <span style={{ color: STATUS_COLORS[selectedOrder.status]?.text }}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>

              <h3 style={{ marginBottom: '1rem' }}>Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ฿{item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>฿{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--primary)' }}>฿{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
