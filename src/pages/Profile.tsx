import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, memberService } from '../services/api';
import './Auth.css';

const Profile = () => {
  const { user, login } = useAuth();
  const [memName,  setMemName]  = useState(user?.memName  || '');
  const [password, setPassword] = useState('');
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string>('');
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    // โหลดรูปโปรไฟล์ปัจจุบัน
    if (user?.memEmail) {
      setPreview(`/img_mem/${user.memEmail}.jpg`);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setLoading(true);

    const formData = new FormData();
    if (memName.trim() && memName !== user.memName) formData.append('memName', memName);
    if (password.trim()) formData.append('password', password);
    if (file) formData.append('file', file);

    if (!memName.trim() && !password.trim() && !file) {
      setError('กรุณากรอกข้อมูลที่ต้องการแก้ไข');
      setLoading(false);
      return;
    }

    try {
      await memberService.updateProfile(formData);
      // re-fetch profile to get updated memName
      const updated = await authService.getProfile();
      if (updated.login) {
        login({ memEmail: updated.memEmail, memName: updated.memName, dutyId: updated.dutyId });
      }
      setPassword('');
      setFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="auth-card glass" style={{ marginTop: '2rem', maxWidth: '480px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>👤 โปรไฟล์สมาชิก</h2>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src={preview}
            alt="profile"
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=User'; }}
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
          />
        </div>

        {saved && (
          <div style={{ padding: '0.8rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            ✓ อัปเดตโปรไฟล์สำเร็จ!
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleUpdate} className="auth-form">
          <div className="form-group">
            <label>อีเมล (ไม่สามารถเปลี่ยนได้)</label>
            <input type="email" className="input-field" value={user?.memEmail || ''} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label>สิทธิ์</label>
            <input
              type="text"
              className="input-field"
              value={user?.dutyId === 'admin' ? 'Admin' : 'Member'}
              disabled
              style={{ opacity: 0.6, color: user?.dutyId === 'admin' ? '#f59e0b' : 'inherit' }}
            />
          </div>
          <div className="form-group">
            <label>ชื่อผู้ใช้ (memName)</label>
            <input
              type="text"
              className="input-field"
              value={memName}
              onChange={e => setMemName(e.target.value)}
              placeholder="ชื่อที่ต้องการแสดง"
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>รูปโปรไฟล์</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
