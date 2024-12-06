const express = require('express');
const Announcement = require('../models/announcements');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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

// Configure multer with custom storage engine
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

router.post('/create-announcement', upload.single('file'), (req, res) => {
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
      file: req.file ? '/uploads/' + req.file.filename : null
  });

  newAnnouncement.save((err) => {
      if (err) {
          console.error('Error saving announcement:', err);
          return res.status(500).send('Error saving announcement');
      }

      res.redirect('/dashboard');
  });
});

module.exports = router;
