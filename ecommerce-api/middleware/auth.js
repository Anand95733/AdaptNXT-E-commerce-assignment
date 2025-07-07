const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
    // Get token from header (e.g., 'Bearer TOKEN')
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using our JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user payload (id, role) to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        // If token is invalid (e.g., expired, malformed)
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to authorize user based on roles
const authorizeRoles = (...roles) => { // Takes an array of allowed roles
    return (req, res, next) => {
        // req.user.role comes from the 'auth' middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient role' });
        }
        next(); // User has required role, proceed
    };
};

module.exports = { auth, authorizeRoles };