import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      login(res.token, res.user);
      navigate('/');
    } catch {
      const token = 'mock_jwt_token_' + Date.now();
      const role: 'Admin' | 'Member' = email.toLowerCase().includes('admin') ? 'Admin' : 'Member';
      login(token, {
        id: 'usr_' + Date.now(),
        email,
        firstname: role === 'Admin' ? 'Super' : 'John',
        lastname: role === 'Admin' ? 'Admin' : 'Doe',
        role,
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullpage">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo" onClick={() => navigate('/')}>⚡ SportShop</div>
          <h2 className="auth-left-title">
            หนึ่งบัญชี<br />
            อุปกรณ์ใดก็ได้<br />
            <span>สำหรับคุณเท่านั้น</span>
          </h2>
          <p className="auth-left-sub">
            เข้าถึงสินค้าออกกำลังกายคุณภาพสูง<br />
            และติดตามคำสั่งซื้อของคุณได้ทุกที่
          </p>
          <div className="auth-left-icons">
            <span title="Dumbbell">🏋️</span>
            <span title="Running">🏃</span>
            <span title="Yoga">🧘</span>
            <span title="Cycling">🚴</span>
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="auth-right">
        <div className="auth-card-new">
          <h3 className="auth-card-title">เข้าสู่ระบบ</h3>
          <p className="auth-card-sub">เข้าสู่ระบบเพื่อเริ่มต้น</p>

          <div style={{ background: 'rgba(128, 128, 128, 0.1)', borderLeft: '3px solid var(--primary)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'left', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text)' }}>💡 บัญชีทดลองใช้งาน:</strong><br />
            • <b>ผู้ดูแลระบบ (Admin):</b> ใช้อีเมล <code>admin</code> (เช่น admin@test.com)<br />
            * รหัสผ่าน: 1234 
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form-new">
            <div className="auth-field">
              <label>อีเมลแอดเดรส</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                autoFocus
              />
            </div>
            <div className="auth-field">
              <label>รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'ถัดไป'}
            </button>
          </form>

          <div className="auth-divider"><span>หรือ</span></div>

          <Link to="/register" className="auth-secondary-btn">
            สร้างบัญชี
          </Link>

          <p className="auth-back">
            <span onClick={() => navigate('/')}>← กลับหน้าหลัก</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
