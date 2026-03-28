import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Users, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: '#f59e0b' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.firstname}. Manage your store efficiently.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Manage Products Card */}
        <Link to="/admin/products" className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Package size={40} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Manage Products</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Add, edit, or remove products. Update stock and manage images.</p>
        </Link>

        {/* Manage Members Card */}
        <Link to="/admin/members" className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Users size={40} color="var(--secondary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Manage Members</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>View all registered members and change roles.</p>
        </Link>

        {/* View Orders Card */}
        <Link to="/admin/orders" className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <ShoppingBag size={40} color="var(--success)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Member Orders</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Track all member transactions and view complete order history.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
