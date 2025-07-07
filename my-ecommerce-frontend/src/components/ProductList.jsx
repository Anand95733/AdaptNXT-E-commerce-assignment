// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://anand-ecommerce-api.onrender.com/api/products';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err.response?.data || err.message);
        setError("Failed to load products. Ensure API is running and you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
    stock: { fontSize: '0.9em', color: '#a0a0a0' }
  };

  if (loading) return <div className="container" style={{textAlign: 'center'}}>Loading products...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2>Available Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} style={productCardStyles.card}>
              <h3 style={productCardStyles.h3}>{product.name}</h3>
              <p style={productCardStyles.p}>{product.description}</p>
              <p style={productCardStyles.price}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
              <p style={productCardStyles.stock}>In Stock: {product.stock}</p>
              {/* No Add to Cart button for now to save time */}
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