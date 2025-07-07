// src/components/CartPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://anand-ecommerce-api.onrender.com/api';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // New state for messages
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => { // Moved fetch logic to a separate function
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true); // Set loading true before fetching
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      setCart(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error("Failed to fetch cart:", err.response?.data || err.message);
      setError("Failed to load cart. Please ensure API is running and you are logged in.");
      setCart(null); // Clear cart if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(); // Call fetchCart when component mounts or token changes
  }, [token, navigate]);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    try {
      const res = await axios.put(`${API_BASE_URL}/cart/update`, { productId, quantity: newQuantity });
      setMessage(`Quantity updated for "${res.data.cart.items.find(item => item.product._id === productId)?.product.name}"`);
      setCart(res.data); // Update cart state with the new data
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Update quantity error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to update quantity.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`); // Use DELETE with product ID
      setMessage(`Item removed from cart!`);
      setCart(res.data); // Update cart state
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Remove item error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to remove item.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const cartItemStyles = {
    itemCard: {
      backgroundColor: '#3a3a3a',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column', // Changed to column for better layout with buttons
      gap: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    },
    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    itemName: { color: '#98fb98', fontSize: '1.2em', margin: 0 },
    itemDetails: { color: '#e0e0e0', fontSize: '0.9em' },
    itemPrice: { color: '#fdd835', fontWeight: 'bold', fontSize: '1.1em' },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    quantityButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em'
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        alignSelf: 'flex-end', // Align remove button to bottom right
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center'}}>Loading cart...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  const totalAmount = cart?.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0) || 0;

  return (
    <div className="container">
      <h2>Your Shopping Cart</h2>
      {message && <p className={message.includes('success') ? "success-message" : "error-message"} style={{textAlign: 'center', margin: '15px 0'}}>{message}</p>}
      {cart && cart.items.length > 0 ? (
        <>
          {cart.items.map(item => (
            <div key={item._id} style={cartItemStyles.itemCard}>
              <div style={cartItemStyles.itemHeader}>
                <h3 style={cartItemStyles.itemName}>{item.product.name}</h3>
                <p style={cartItemStyles.itemPrice}>Total: ₹{(item.quantity * item.product.price).toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={cartItemStyles.quantityControls}>
                  <button style={cartItemStyles.quantityButton} onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}>-</button>
                  <span style={cartItemStyles.itemDetails}>Quantity: {item.quantity}</span>
                  <button style={cartItemStyles.quantityButton} onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}>+</button>
                </div>
                <button style={cartItemStyles.removeButton} onClick={() => handleRemoveItem(item.product._id)}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{textAlign: 'right', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444'}}>
            <h3>Cart Total: <span style={cartItemStyles.itemPrice}>₹{totalAmount.toFixed(2)}</span></h3>
            {/* Placeholder for checkout - will not implement fully in this session */}
            <button
                style={{
                    marginTop: '15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    opacity: 0.7, // Visual cue for not implemented
                    pointerEvents: 'none', // Make it unclickable
                }}
            >
                Proceed to Checkout (Not Implemented)
            </button>
          </div>
        </>
      ) : (
        <p style={{textAlign: 'center'}}>Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartPage;