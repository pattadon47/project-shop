import { useState } from 'react';

// For simplicity, reusing same Mock structure as OrderHistory, with Member info appended
interface AdminOrder {
  id: string;
  memberEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  { id: 'ORD-1029', memberEmail: 'john@example.com', date: '2026-03-20', total: 150.00, status: 'Delivered' },
  { id: 'ORD-1035', memberEmail: 'jane@example.com', date: '2026-03-25', total: 85.00, status: 'Shipped' },
  { id: 'ORD-1042', memberEmail: 'john@example.com', date: '2026-03-27', total: 30.00, status: 'Pending' }
];

const MemberOrders = () => {
  const [orders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    o => o.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
         o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper container">
      <h1 style={{ color: '#10b981', marginBottom: '2rem' }}>Member Orders Overview</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search by Email or Order ID..." 
          className="input-field" 
          style={{ maxWidth: '400px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Member Email</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{order.id}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{order.memberEmail}</td>
                <td style={{ padding: '1rem' }}>{order.date}</td>
                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.8rem',
                    background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : order.status === 'Shipped' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Shipped' ? 'var(--primary)' : '#f59e0b'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => alert('View full order details popup / redirect')}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberOrders;
