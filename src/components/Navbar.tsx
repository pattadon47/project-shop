import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User as UserIcon, Settings, Home } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <Home className="nav-icon" />
          <span>SportShop</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Products</Link>
          
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'Admin' && (
                <Link to="/admin" className="nav-link admin-link">
                  <Settings size={18} /> Admin Dashboard
                </Link>
              )}
              <Link to="/cart" className="nav-link">
                <ShoppingCart size={18} /> Cart
              </Link>
              <Link to="/profile" className="nav-link">
                <UserIcon size={18} /> {user.firstname}
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
