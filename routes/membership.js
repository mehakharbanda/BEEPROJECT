const express = require('express');
const router = express.Router();

// Membership data (example)
const memberships = [
    { id: 1, name: "Basic Plan", price: "$10/month", benefits: ["Access to all books", "1 book rental/month","Support"] },
    { id: 2, name: "Standard Plan", price: "$20/month", benefits: ["Access to all books", "5 book rentals/month", "Priority Support"] },
    { id: 3, name: "Premium Plan", price: "$30/month", benefits: ["Unlimited book rentals", "Exclusive content", "Priority Support"] }
];

// Membership Page
// router.get('/memberships', (req, res) => {
//     if (req.session.user) {
//         res.render('memberships', { user: req.session.user, memberships });
//     } else {
//         res.redirect('/login');
//     }
// });

// Membership Page
router.get('/memberships', (req, res) => {
    const user = req.session.user || null; // Check if the user is logged in
    res.render('memberships', { user, memberships }); // Pass null for user if not logged in
});

module.exports = router;