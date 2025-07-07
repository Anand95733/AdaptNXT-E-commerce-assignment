// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage'; // <--- NEW: Import CartPage

// A simple PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading authentication...</div>; // Or a spinner
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} /> {/* <--- NEW: Route for CartPage */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function Home() {
  return (
    <div className="container" style={{textAlign: 'center'}}>
      <h1>Welcome to Anand's E-commerce Site!</h1>
      <p>Please log in or register to view products.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container" style={{textAlign: 'center'}}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;