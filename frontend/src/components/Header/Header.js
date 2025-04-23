import React from 'react';
import Logo from '../Logo/Logo';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <div>
                <Logo/>
            </div>

            <div className="nav-links">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Sign Up</Link>
            </div>
        </div>
    )
}

export default Header;