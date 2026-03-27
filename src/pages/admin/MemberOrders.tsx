import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/api';
import type { Order } from '../../types';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:   { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  Confirmed: { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa' },
  Shipped:   { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa' },
  Delivered: { bg: 'rgba(16,185,129,0.15)',  text: 'var(--success)' },
};

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1029', memberEmail: 'john@example.com', memberName: 'John Doe', date: '2026-03-20', total: 150.00, status: 'Delivered', items: [{ productId: '1', name: 'Pro Running Shoes', price: 120, quantity: 1 }, { productId: '2', name: 'Yoga Mat', price: 30, quantity: 1 }] },
  { id: 'ORD-1035', memberEmail: 'jane@example.com', memberName: 'Jane Smith', date: '2026-03-25', total: 85.00, status: 'Shipped', items: [{ productId: '3', name: 'Dumbbell Set', price: 85, quantity: 1 }] },
  { id: 'ORD-1042', memberEmail: 'john@example.com', memberName: 'John Doe', date: '2026-03-27', total: 30.00, status: 'Pending', items: [{ productId: '2', name: 'Yoga Mat', price: 30, quantity: 1 }] },
];

const MemberOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = orders.filter(o =>
    (o.memberEmail || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.memberName || '').toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#10b981' }}>Member Orders</h1>
        <input
          type="text"
          placeholder="Search by email, name, or order ID..."
          className="input-field"
          style={{ maxWidth: '360px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>
          <div className="glass" style={{ borderRadius: '1rem', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Member</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-glass)', background: selectedOrder?.id === order.id ? 'rgba(59,130,246,0.05)' : 'transparent' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{order.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 500 }}>{order.memberName || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.memberEmail}</div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{order.date}</td>
                      <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>฿{order.total.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', background: colors.bg, color: colors.text, fontWeight: 600 }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        >
                          {selectedOrder?.id === order.id ? 'Close' : 'Details'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Side detail panel */}
          {selectedOrder && (
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', position: 'sticky', top: '6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h3 style={{ margin: 0 }}>Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Member:</strong> {selectedOrder.memberName} ({selectedOrder.memberEmail})</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong> <span style={{ color: STATUS_COLORS[selectedOrder.status]?.text }}>{selectedOrder.status}</span></p>
              </div>
              <h4 style={{ marginBottom: '0.75rem' }}>Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ฿{item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>฿{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>฿{selectedOrder.total.toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(`/orders/${selectedOrder.id}`)}>
                View Full Page ↗
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberOrders;
