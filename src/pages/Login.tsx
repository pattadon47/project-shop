import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const [loginName, setLoginName] = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(loginName, password);
      if (res.login && res.user) {
        login(res.user);
        navigate('/');
      } else {
        setError(res.message || 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullpage">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo" onClick={() => navigate('/')}>⚡ YimHaikan</div>
          <h2 className="auth-left-title">
            หนึ่งบัญชี<br />อุปกรณ์ใดก็ได้<br />
            <span>สำหรับคุณเท่านั้น</span>
          </h2>
          <p className="auth-left-sub">
            เข้าถึงสินค้าออกกำลังกายคุณภาพสูง<br />และติดตามคำสั่งซื้อของคุณได้ทุกที่
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
          <p className="auth-card-sub">ใช้อีเมล หรือ ชื่อผู้ใช้ (memName) เพื่อเข้าสู่ระบบ</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form-new">
            <div className="auth-field">
              <label>อีเมล หรือ ชื่อผู้ใช้</label>
              <input
                type="text"
                value={loginName}
                onChange={e => setLoginName(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="auth-divider"><span>หรือ</span></div>
          <Link to="/register" className="auth-secondary-btn">สร้างบัญชีใหม่</Link>
          <p className="auth-back">
            <span onClick={() => navigate('/')}>← กลับหน้าหลัก</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
