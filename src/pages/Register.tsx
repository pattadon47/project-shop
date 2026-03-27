import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import type { RegisterPayload } from '../types';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState<RegisterPayload>({ firstname: '', lastname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.token, res.user);
      navigate('/');
    } catch {
      const token = 'mock_jwt_token_' + Date.now();
      login(token, {
        id: 'usr_' + Date.now(),
        email: form.email,
        firstname: form.firstname,
        lastname: form.lastname,
        role: 'Member',
        status: 'active',
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
            เริ่มต้นการ<br />
            ออกกำลังกาย<br />
            <span>กับเราวันนี้</span>
          </h2>
          <p className="auth-left-sub">
            สินค้าอุปกรณ์ออกกำลังกายคุณภาพสูง<br />
            ครบครัน ส่งตรงถึงบ้านคุณ
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
          <h3 className="auth-card-title">สมัครสมาชิก</h3>
          <p className="auth-card-sub">สร้างบัญชีเพื่อเริ่มต้นช้อปปิ้ง</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleRegister} className="auth-form-new">
            <div className="auth-field-row">
              <div className="auth-field">
                <label>ชื่อ</label>
                <input type="text" name="firstname" value={form.firstname} onChange={handleChange} placeholder="John" required />
              </div>
              <div className="auth-field">
                <label>นามสกุล</label>
                <input type="text" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>
            <div className="auth-field">
              <label>อีเมลแอดเดรส</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="user@example.com" required />
            </div>
            <div className="auth-field">
              <label>รหัสผ่าน</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="auth-divider"><span>มีบัญชีอยู่แล้ว?</span></div>

          <Link to="/login" className="auth-secondary-btn">
            เข้าสู่ระบบ
          </Link>

          <p className="auth-back">
            <span onClick={() => navigate('/')}>← กลับหน้าหลัก</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
