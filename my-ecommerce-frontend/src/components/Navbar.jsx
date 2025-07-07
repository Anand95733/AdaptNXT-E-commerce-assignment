// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, role, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <div>
        <Link to="/">Home</Link>
        {token && <Link to="/products">Products</Link>}
      </div>
      <div>
        {token ? (
          <>
            <span>Logged in as {role}</span>
            <button onClick={logout} style={{marginLeft: '20px'}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;