// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE_URL = 'https://anand-ecommerce-api.onrender.com/api'; // Changed to base API for cart

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState(''); // New state for cart messages
  const { token } = useAuth(); // Get token from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ensure token is present before fetching products if it's a protected route
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }
        // Set Authorization header for all requests using axios defaults in AuthContext
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err.response?.data || err.message);
        setError("Failed to load products. Please ensure API is running and you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token, navigate]); // Depend on token and navigate

  const handleAddToCart = async (productId, quantity = 1) => {
    setCartMessage(''); // Clear previous messages
    if (!token) {
      setCartMessage('Please log in to add items to your cart.');
      return;
    }
    try {
      // axios automatically uses the token set in defaults from AuthContext
      const res = await axios.post(`${API_BASE_URL}/cart/add`, { productId, quantity });
      setCartMessage(`"${res.data.cart.items[0].product.name}" added to cart successfully!`); // Assuming one item at a time
      setTimeout(() => setCartMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error('Add to cart error:', err.response?.data || err.message);
      setCartMessage(err.response?.data?.message || 'Failed to add item to cart.');
      setTimeout(() => setCartMessage(''), 3000);
    }
  };

  const productCardStyles = {
    card: {
      backgroundColor: '#3a3a3a',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    h3: { color: '#98fb98', marginTop: 0, fontSize: '1.4em' },
    p: { margin: '5px 0', lineHeight: '1.5' },
    price: { fontSize: '1.2em', fontWeight: 'bold', color: '#fdd835', marginTop: '10px' },
    stock: { fontSize: '0.9em', color: '#a0a0a0' },
    button: {
        marginTop: '15px',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s ease-in-out',
        width: '100%',
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center'}}>Loading products...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2>Available Products</h2>
      {cartMessage && <p className={cartMessage.includes('successfully') ? "success-message" : "error-message"} style={{textAlign: 'center', margin: '15px 0'}}>{cartMessage}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} style={productCardStyles.card}>
              <div> {/* Wrap content to keep button at bottom */}
                <h3 style={productCardStyles.h3}>{product.name}</h3>
                <p style={productCardStyles.p}>{product.description}</p>
                <p style={productCardStyles.price}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
                <p style={productCardStyles.stock}>In Stock: {product.stock}</p>
              </div>
              <button
                style={productCardStyles.button}
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0} // Disable if out of stock
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', width: '100%'}}>No products found. Please add some via Postman.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;