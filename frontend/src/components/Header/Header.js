import React from 'react';
import Logo from '../Logo/Logo';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="header">
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo />
        </Link>
      </div>

      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link logout-button">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;