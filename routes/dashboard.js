// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// router.get('/dashboard', (req, res) => {
//     const token = req.cookies.token; 

//     if (!token) {
//         return res.redirect('/login'); 
//     }

//     jwt.verify(token, 'your-secret-key', (err, decoded) => {
//         if (err) {
//             return res.redirect('/login'); 
//         }
//         const message = req.query.message || '';
//         res.render('dashboard', { user: decoded,message });
//     });
// });

// module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const router = express.Router();
const Announcement = require('../models/announcements');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads'); // Ensure this directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

// Example route for displaying announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    const user = req.session.user; // Assume the user is stored in the session
    res.render('announcements', { announcements, user });
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create a new announcement
router.post('/create-announcement', upload.single('file'), async (req, res) => {
  const { title, description, type } = req.body;
  console.log(req.body); // Check if the data is coming in
  console.log(req.file);  // Check if the file data is coming in

  // Check if required fields are missing
  if (!title || !description || !type) {
    return res.status(400).send('All fields are required');
  }

  const newAnnouncement = new Announcement({
    title,
    description,
    type,
    file: req.file ? '/uploads/' + req.file.filename : null,
  });

  try {
    // Use async/await to save the announcement without a callback
    await newAnnouncement.save();
    console.log('Announcement saved successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error saving announcement:', err);
    res.status(500).send('Error saving announcement');
  }
});

// Route to display the dashboard
router.get('/dashboard', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }
    const message = req.query.message || '';
    res.render('dashboard', { user: decoded, message });
  });
});

// Route to add a new announcement (duplicate - needs to be fixed)
router.post('/add-announcement', async (req, res) => {
  try {
    const newAnnouncement = new Announcement({
      title: req.body.title,
      description: req.body.description,
      // other fields...
    });

    await newAnnouncement.save();  // Save to database
    res.redirect('/announcements');  // Redirect after successful save
  } catch (err) {
    console.error('Error saving announcement:', err);
    res.status(500).send('Error saving announcement');
  }
});

// Route to handle file upload for announcements (duplicate - needs to be fixed)
router.post('/announcements', upload.single('file'), async (req, res) => {
  const { type, title, description } = req.body;
  const file = req.file ? req.file.path : '';

  const newAnnouncement = new Announcement({
    type,
    title,
    description,
    file,
  });

  try {
    // Use async/await to save the announcement without a callback
    await newAnnouncement.save();
    res.redirect('/announcements');  // Redirect after successful save
  } catch (err) {
    console.error('Error saving announcement:', err);
    res.status(500).send('Error saving announcement');
  }
});

module.exports = router;
