const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Needed to check product existence/stock
const { auth, authorizeRoles } = require('../middleware/auth');

// Helper function to get or create a user's cart
const getUserCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
    }
    return cart;
};

// Route 1: GET /api/cart - Get user's cart (Authenticated users only)
router.get('/', auth, async (req, res) => {
    try {
        const cart = await getUserCart(req.user.id);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 2: POST /api/cart/add - Add item to cart (Authenticated users only)
router.post('/add', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and a positive quantity are required.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
        }

        const cart = await getUserCart(req.user.id);
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Item exists, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Item does not exist, add new item
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully!', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 3: PUT /api/cart/update - Update item quantity in cart (Authenticated users only)
router.put('/update', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    try {
        const cart = await getUserCart(req.user.id);
        const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

        if (itemIndex > -1) {
            if (quantity === 0) {
                cart.items.splice(itemIndex, 1); // Remove item if quantity is 0
                await cart.save();
                return res.status(200).json({ message: 'Item removed from cart.', cart });
            } else {
                const product = await Product.findById(productId);
                if (!product) {
                    return res.status(404).json({ message: 'Product not found.' });
                }
                if (product.stock < quantity) {
                    return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
                }
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                return res.status(200).json({ message: 'Cart item quantity updated!', cart });
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 4: DELETE /api/cart/remove/:productId - Remove item from cart (Authenticated users only)
router.delete('/remove/:productId', auth, async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await getUserCart(req.user.id);
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

        if (cart.items.length < initialLength) {
            await cart.save();
            return res.status(200).json({ message: 'Item removed from cart.', cart });
        } else {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;