import { useState } from 'react';
import type { User } from '../../context/AuthContext';

const MOCK_MEMBERS: User[] = [
  { id: 'usr_1', firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'Member', status: 'active' },
  { id: 'usr_2', firstname: 'Super', lastname: 'Admin', email: 'admin@example.com', role: 'Admin', status: 'active' },
  { id: 'usr_3', firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', role: 'Member', status: 'inactive' }
];

const ManageMembers = () => {
  const [members, setMembers] = useState<User[]>(MOCK_MEMBERS);

  const toggleStatus = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
  };

  const promoteToAdmin = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: 'Admin' } : m));
  };

  const demoteToMember = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: 'Member' } : m));
  };

  return (
    <div className="page-wrapper container">
      <h1 style={{ color: '#8b5cf6', marginBottom: '2rem' }}>Manage Members</h1>
      
      <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
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
            {members.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{member.firstname} {member.lastname}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{member.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: member.role === 'Admin' ? '#f59e0b' : 'inherit', fontWeight: member.role === 'Admin' ? 600 : 400 }}>
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.8rem',
                    background: member.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: member.status === 'active' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => toggleStatus(member.id)}
                  >
                    Toggle Status
                  </button>
                  {member.role === 'Member' ? (
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#f59e0b' }}
                      onClick={() => promoteToAdmin(member.id)}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#64748b' }}
                      onClick={() => demoteToMember(member.id)}
                    >
                      Make Member
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMembers;
