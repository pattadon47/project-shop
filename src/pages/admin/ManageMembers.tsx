import { useState, useEffect } from 'react';
import { memberService } from '../../services/api';
import type { User } from '../../types';

const ManageMembers = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await memberService.getAll();
        setMembers(data);
      } catch {
        setMsg('โหลดสมาชิกไม่สำเร็จ กรุณาตรวจสอบ connection');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const toggleRole = async (m: User) => {
    const newRole: 'admin' | 'member' = m.dutyId === 'member' ? 'admin' : 'member';
    const label = newRole === 'admin' ? 'Admin' : 'Member';
    if (!window.confirm(`เปลี่ยนสิทธิ์ของ ${m.memName} เป็น ${label}?`)) return;
    try {
      await memberService.changeRole(m.memEmail, newRole);
      setMembers(members.map(x => x.memEmail === m.memEmail ? { ...x, dutyId: newRole } : x));
      setMsg(`เปลี่ยนสิทธิ์ ${m.memName} เป็น ${label} สำเร็จ`);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(errMsg || 'เปลี่ยนสิทธิ์ไม่สำเร็จ');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const filtered = members.filter(m =>
    m.memEmail.toLowerCase().includes(search.toLowerCase()) ||
    m.memName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#8b5cf6' }}>👥 จัดการสมาชิก</h1>
        <input
          type="text"
          placeholder="ค้นหาตามชื่อหรืออีเมล..."
          className="input-field"
          style={{ maxWidth: '320px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ borderRadius: '1rem', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '1rem' }}>ชื่อผู้ใช้</th>
                <th style={{ padding: '1rem' }}>อีเมล</th>
                <th style={{ padding: '1rem' }}>สิทธิ์</th>
                <th style={{ padding: '1rem' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.memEmail} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={`/img_mem/${m.memEmail}.jpg`}
                        alt={m.memName}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/36x36?text=U'; }}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {m.memName}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{m.memEmail}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                      background: m.dutyId === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                      color: m.dutyId === 'admin' ? '#f59e0b' : '#818cf8',
                    }}>
                      {m.dutyId === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      className="btn-primary"
                      style={{
                        padding: '0.4rem 0.9rem', fontSize: '0.82rem',
                        background: m.dutyId === 'member' ? '#f59e0b' : '#64748b'
                      }}
                      onClick={() => toggleRole(m)}
                    >
                      {m.dutyId === 'member' ? 'เป็น Admin' : 'เป็น Member'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>ไม่พบสมาชิก</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
