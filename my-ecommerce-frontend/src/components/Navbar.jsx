// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, role, logout } = useAuth(); // Destructure role if not already

  return (
    <nav className="nav-bar">
      <div>
        <Link to="/">Home</Link>
        {token && <Link to="/products">Products</Link>}
        {token && <Link to="/cart">Cart</Link>} {/* <--- NEW: Cart Link */}
      </div>
      <div>
        {token ? (
          <>
            {/* Display role if available, e.g., "Logged in as Customer" */}
            <span>Logged in as {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}</span>
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