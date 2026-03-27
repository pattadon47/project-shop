import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call e.g: const res = await api.post('/login')
    // For now we mock login parsing email to resolve roles
    
    // MOCK LOGIN LOGIC based on criteria
    const token = "mock_jwt_token_" + Date.now();
    const role: 'Admin' | 'Member' = email.includes('admin') ? 'Admin' : 'Member';
    
    login(token, {
      id: 'usr_' + Date.now(),
      email,
      firstname: role === 'Admin' ? 'Super' : 'John',
      lastname: role === 'Admin' ? 'Admin' : 'Doe',
      role,
      status: 'active'
    });
    
    navigate('/');
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-card glass">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to SportShop</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com (use 'admin' for Admin role)"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
