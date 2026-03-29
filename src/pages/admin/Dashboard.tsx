import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Users, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: '#f59e0b' }}>⚙️ Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          ยินดีต้อนรับ, <strong style={{ color: 'var(--text)' }}>{user?.memName}</strong> — จัดการร้านค้าของคุณได้ที่นี่
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <Link
          to="/admin/products"
          className="glass"
          style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}
        >
          <div style={{ background: 'rgba(59,130,246,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Package size={40} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>จัดการสินค้า</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>เพิ่ม แก้ไข ลบสินค้า และจัดการรูปภาพ</p>
        </Link>

        <Link
          to="/admin/members"
          className="glass"
          style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}
        >
          <div style={{ background: 'rgba(139,92,246,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Users size={40} color="var(--secondary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>จัดการสมาชิก</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>ดูสมาชิกทั้งหมดและเปลี่ยนสิทธิ์</p>
        </Link>

        <Link
          to="/admin/orders"
          className="glass"
          style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}
        >
          <div style={{ background: 'rgba(16,185,129,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <ShoppingBag size={40} color="var(--success)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>คำสั่งซื้อทั้งหมด</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>ดูประวัติคำสั่งซื้อของสมาชิกทุกคน</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
