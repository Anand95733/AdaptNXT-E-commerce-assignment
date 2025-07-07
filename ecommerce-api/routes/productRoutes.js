const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/auth'); // <-- NEW LINE: Import auth middleware

// Route 1: GET /api/products - Get all products
// Publicly accessible
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 2: POST /api/products - Add a new product (Admin only)
// Add 'auth' middleware to verify token and 'authorizeRoles('admin')' to check role
router.post('/', auth, authorizeRoles('admin'), async (req, res) => { // <-- MODIFIED LINE
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;