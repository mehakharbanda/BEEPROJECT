const express = require('express');
const Subscription = require('../models/Subscription'); // Import the Subscription model
const router = express.Router();

// Route to display subscription page
router.get('/subscribe', (req, res) => {
    if (req.session.user) {
        const { planId, planName, planPrice } = req.query;
        res.render('subscribe', { user: req.session.user, planId, planName, planPrice });
    } else {
        res.redirect('/login');
    }
});

// Route to handle subscription
router.post('/subscribe', async (req, res) => {
    const { planId, name, email, paymentMethod, planName } = req.body;

    const subscriptionData = {
        planId,
        planName,
        name,
        email,
        paymentMethod,
        subscribedAt: new Date()
    };

    try {
        await Subscription.save(subscriptionData); // Save using the model
        res.render('dashboard', { 
            user: req.session.user, 
            message: 'User has subscribed successfully!' 
        });
    } catch (error) {
        console.error('Error processing subscription:', error);
        res.status(500).send('Error processing subscription');
    }
});

module.exports = router;
