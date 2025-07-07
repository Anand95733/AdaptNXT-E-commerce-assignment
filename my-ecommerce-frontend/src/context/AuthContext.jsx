// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'https://anand-ecommerce-api.onrender.com/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load token and role from localStorage on initial render
        if (token) {
            // Optional: Validate token here if time permits (decode, check expiry)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // If user data is part of the token, you could decode it here
            // For now, assume if token exists, user is logged in
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, { username, password });
            const { token: newToken, message, role: newRole } = res.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('role', newRole);
            setToken(newToken);
            setRole(newRole);
            setUser({ username, role: newRole }); // Set user based on login
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            return { success: true, message: message };
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (username, password, role = 'customer') => {
        try {
            const res = await axios.post(`${API_BASE_URL}/register`, { username, password, role });
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Register error:', err.response?.data || err.message);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, role, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);