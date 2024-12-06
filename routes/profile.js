const express = require('express');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const User = require('../models/User');
const Genre = require('../models/Genre'); // Added for genre updates
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/search', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('profile', { user: null, notifications: [] });
        }
        req.session.email = email;
        res.render('profile', { user, notifications: user.notifications || [] });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error searching for user');
    }
});

router.get('/', async (req, res) => {
    const userEmail = req.session.email;
    if (!userEmail) {
        return res.render('profile', { user: null, notifications: [] });
    }
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.render('profile', { user: null, notifications: [] });
        }
        res.render('profile', { user, notifications: user.notifications || [] });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching user profile');
    }
});

// Handle notification clearing
router.post('/clear-notifications', async (req, res) => {
    const email = req.session.email;
    if (!email) {
        return res.redirect('/profile');
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.notifications = [];
            await user.save();
        }
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error clearing notifications');
    }
});

// Genre update handling
router.post('/update-genre', async (req, res) => {
    const email = req.session.email;
    if (!email) {
        return res.redirect('/profile');
    }
    const { genreInterest } = req.body;
    const genres = genreInterest.split(',').map(genre => genre.trim());
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.genreInterests = genres;
            user.notifications.push(`You updated your genre interests: ${genres.join(', ')}`);
            await user.save();
        }
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating genre interests');
    }
});

// Profile picture upload
router.post('/upload', upload.single('profilePicture'), async (req, res) => {
    const email = req.session.email;
    if (!email) {
        return res.redirect('/profile');
    }
    const profilePicture = req.file ? req.file.filename : null;
    if (!profilePicture) {
        return res.status(400).send('No file uploaded');
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.profilePicture = profilePicture;
            await user.save();
        }
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error uploading profile picture');
    }
});

module.exports = router;
