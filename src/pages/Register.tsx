import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ memEmail: '', memName: '', password: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authService.register(form);
      if (res.regist) {
        setSuccess('สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.message || 'สมัครสมาชิกไม่สำเร็จ');
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
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo" onClick={() => navigate('/')}>⚡ YimHaikan</div>
          <h2 className="auth-left-title">
            เริ่มต้นการ<br />ออกกำลังกาย<br /><span>กับเราวันนี้</span>
          </h2>
          <p className="auth-left-sub">
            สินค้าอุปกรณ์ออกกำลังกายคุณภาพสูง<br />ครบครัน ส่งตรงถึงบ้านคุณ
          </p>
          <div className="auth-left-icons">
            <span>🏋️</span><span>🏃</span><span>🧘</span><span>🚴</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card-new">
          <h3 className="auth-card-title">สมัครสมาชิก</h3>
          <p className="auth-card-sub">สร้างบัญชีเพื่อเริ่มต้นช้อปปิ้ง</p>

          {error   && <div className="auth-error">{error}</div>}
          {success && (
            <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form-new">
            <div className="auth-field">
              <label>อีเมล</label>
              <input type="email" name="memEmail" value={form.memEmail} onChange={handleChange} placeholder="user@example.com" required />
            </div>
            <div className="auth-field">
              <label>ชื่อผู้ใช้ (memName)</label>
              <input type="text" name="memName" value={form.memName} onChange={handleChange} placeholder="ชื่อที่ใช้แสดง" required />
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
          <Link to="/login" className="auth-secondary-btn">เข้าสู่ระบบ</Link>
          <p className="auth-back">
            <span onClick={() => navigate('/')}>← กลับหน้าหลัก</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
