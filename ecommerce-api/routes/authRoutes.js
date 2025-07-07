const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // For JSON Web Tokens

// Route 1: POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        // Create new user (password will be hashed by pre-save middleware)
        user = new User({ username, password, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 2: POST /api/auth/login - Login a user and get JWT
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials (User not found)' });
        }

        // Compare provided password with hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials (Password mismatch)' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload: user ID and role
            process.env.JWT_SECRET,            // Secret key from .env
            { expiresIn: '1h' }                // Token expires in 1 hour
        );

        res.json({ token, message: 'Logged in successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;