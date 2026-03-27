import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // MOCK REGISTRATION LOGIC
    const token = "mock_jwt_token_" + Date.now();
    
    login(token, {
      id: 'usr_' + Date.now(),
      email,
      firstname,
      lastname,
      role: 'Member',
      status: 'active'
    });
    
    navigate('/');
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-card glass">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div style={{ display: 'flex', gap: '1rem' }}>
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
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
