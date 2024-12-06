const jwt = require('jsonwebtoken');
const CreateError = require('../utils/createError'); // Import CreateError utility

const authenticate = (req, res, next) => {
    // Attempt to get the token from cookies instead of the Authorization header
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded; // Store user data in request
        next(); // Proceed to next middleware or route
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticate;