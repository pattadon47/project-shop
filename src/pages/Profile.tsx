import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Profile = () => {
  const { user, login, token } = useAuth();
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    
    // MOCK update profile logic
    const updatedUser = { ...user, firstname, lastname };
    login(token, updatedUser); // Re-login strictly to update Context & Storage
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="auth-card glass" style={{ marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Member Profile</h2>
        
        {saved && (
          <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdate} className="auth-form">
          <div className="form-group">
            <label>Email (Read-only)</label>
            <input 
              type="email" 
              className="input-field" 
              value={user?.email || ''}
              disabled 
              style={{ opacity: 0.6 }}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input 
              type="text" 
              className="input-field" 
              value={user?.role || ''}
              disabled 
              style={{ opacity: 0.6, color: user?.role === 'Admin' ? '#f59e0b' : 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>First Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
