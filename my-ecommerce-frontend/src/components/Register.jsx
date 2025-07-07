// src/components/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default to customer
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await register(username, password, role);
    if (result.success) {
      setSuccess(result.message);
      setUsername('');
      setPassword('');
      setRole('customer'); // Reset role after successful registration
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{marginBottom: '15px', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: '#e0e0e0', width: 'calc(100% - 0px)'}}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;