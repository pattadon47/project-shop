import { useState, useEffect } from 'react';
import { memberService } from '../../services/api';
import type { Member } from '../../types';

const MOCK_MEMBERS: Member[] = [
  { id: 'usr_1', firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'Member', status: 'active' },
  { id: 'usr_2', firstname: 'Super', lastname: 'Admin', email: 'admin@example.com', role: 'Admin', status: 'active' },
  { id: 'usr_3', firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', role: 'Member', status: 'inactive' },
];

const ManageMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await memberService.getAll();
        setMembers(data);
      } catch {
        setMembers(MOCK_MEMBERS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleStatus = async (m: Member) => {
    const newStatus = m.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await memberService.changeStatus(m.id, newStatus);
      setMembers(members.map(x => x.id === m.id ? updated : x));
    } catch {
      setMembers(members.map(x => x.id === m.id ? { ...x, status: newStatus } : x));
    }
  };

  const toggleRole = async (m: Member) => {
    const newRole = m.role === 'Member' ? 'Admin' : 'Member';
    if (!confirm(`Change ${m.firstname}'s role to ${newRole}?`)) return;
    try {
      const updated = await memberService.changeRole(m.id, newRole);
      setMembers(members.map(x => x.id === m.id ? updated : x));
    } catch {
      setMembers(members.map(x => x.id === m.id ? { ...x, role: newRole } : x));
    }
  };

  const filtered = members.filter(m =>
    `${m.firstname} ${m.lastname} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#8b5cf6' }}>Manage Members</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input-field"
          style={{ maxWidth: '320px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ borderRadius: '1rem', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{m.firstname} {m.lastname}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{m.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: m.role === 'Admin' ? '#f59e0b' : 'inherit', fontWeight: m.role === 'Admin' ? 600 : 400 }}>
                      {m.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem',
                      background: m.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: m.status === 'active' ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', background: m.status === 'active' ? 'rgba(239,68,68,0.7)' : 'rgba(16,185,129,0.7)' }}
                        onClick={() => toggleStatus(m)}
                      >
                        {m.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', background: m.role === 'Member' ? '#f59e0b' : '#64748b' }}
                        onClick={() => toggleRole(m)}
                      >
                        {m.role === 'Member' ? 'Make Admin' : 'Make Member'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No members match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
