import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, Settings, ClipboardList, LogOut, ChevronRight } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount, refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) refreshCart();
  }, [user, refreshCart]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Scroll to a section on home page, or navigate home first
  const scrollToSection = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-brand">
          <span className="brand-icon">⚡</span>
          YimHaikan
        </Link>

        {/* Center nav links */}
        <div className="nav-links">
          <button
            className="nav-link nav-link-btn"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              }
            }}
          >
            Home
          </button>
          <button className="nav-link nav-link-btn" onClick={() => scrollToSection('products-section')}>Shop</button>
          <button className="nav-link nav-link-btn" onClick={() => scrollToSection('about-section')}>About</button>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="nav-link nav-link-admin">
              Admin
            </Link>
          )}
        </div>

        {/* Right icon group */}
        <div className="nav-actions">
          {/* Cart icon */}
          <Link to={user ? '/cart' : '/login'} className="nav-icon-btn cart-icon-btn">
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {/* User icon + dropdown */}
          <div className="user-dropdown-wrap" ref={dropdownRef}>
            <button
              className="nav-icon-btn"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-label="User menu"
            >
              <UserIcon size={20} />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                {!user ? (
                  /* Guest dropdown */
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item dropdown-item-main"
                      onClick={() => setDropdownOpen(false)}
                    >
                      เข้าสู่ระบบ / สมัครสมาชิก
                      <ChevronRight size={14} />
                    </Link>
                    <div className="dropdown-divider" />
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      to="/register"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      สมัครสมาชิก
                    </Link>
                  </>
                ) : (
                  /* Logged-in dropdown */
                  <>
                    <div className="dropdown-user-info">
                      <span className="dropdown-user-name">{user.firstname}</span>
                      <span className="dropdown-user-role">{user.role}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon size={14} /> โปรไฟล์
                    </Link>
                    {user.role !== 'Admin' && (
                      <Link
                        to="/orders"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ClipboardList size={14} /> ประวัติการสั่งซื้อ
                      </Link>
                    )}
                    {user.role === 'Admin' && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <LogOut size={14} /> ออกจากระบบ
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
