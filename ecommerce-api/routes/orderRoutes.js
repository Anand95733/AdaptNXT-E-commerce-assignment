const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/auth');

// Route: POST /api/orders - Create a new order from the user's cart (Authenticated users only)
router.post('/', auth, async (req, res) => {
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country) {
        return res.status(400).json({ message: 'Shipping address is incomplete.' });
    }

    try {
        // 1. Find the user's cart and populate product details
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot create an order.' });
        }

        let totalAmount = 0;
        const orderItems = [];
        const productUpdates = [];

        // 2. Validate stock and prepare order items
        for (const cartItem of cart.items) {
            const product = cartItem.product;
            const requestedQuantity = cartItem.quantity;

            if (!product) { // Should not happen with populate, but good check
                return res.status(404).json({ message: `Product not found for item in cart.` });
            }

            if (product.stock < requestedQuantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${requestedQuantity}` });
            }

            // Add to order items
            orderItems.push({
                product: product._id,
                quantity: requestedQuantity,
                price: product.price // Capture current price
            });

            totalAmount += product.price * requestedQuantity;

            // Prepare stock update
            productUpdates.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { stock: -requestedQuantity } }
                }
            });
        }

        // 3. Create the order
        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress
        });

        await order.save();

        // 4. Update product stocks (perform all at once for efficiency)
        if (productUpdates.length > 0) {
            await Product.bulkWrite(productUpdates);
        }

        // 5. Clear the user's cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully!', order });

    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route: GET /api/orders - Get all orders for the authenticated user (Customers only)
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: GET /api/orders/:id - Get a single order by ID (Authenticated user or Admin)
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        // Ensure only owner or admin can view order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: You do not own this order and are not an admin.' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', auth, authorizeRoles('admin'), async (req, res) => {
    const { status } = req.body;
    if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid order status provided.' });
    }
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        order.status = status;
        await order.save();
        res.json({ message: 'Order status updated successfully!', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;