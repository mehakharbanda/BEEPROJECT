const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Protected dashboard route
router.get('/dashboard', (req, res) => {
    const token = req.cookies.token; // Retrieve token from cookies

    if (!token) {
        return res.redirect('/login'); // If no token, redirect to login
    }

    // Verify the token
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.redirect('/login'); // If token verification fails, redirect to login
        }

        // If token is valid, render the dashboard view with user info
        res.render('dashboard', { user: decoded }); // Pass decoded user data to dashboard
    });
});

module.exports = router;
