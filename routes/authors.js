const express = require('express');
const router = express.Router();
const Author = require('../models/Author'); // Import the Author model

// Fetch all authors
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find();
        res.render('authors', { authors });
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).send('Error fetching authors');
    }
});

// Add a new author
router.post('/add', async (req, res) => {
    const { name, bio, image, birthdate, nationality, genres, description } = req.body;

    try {
        const newAuthor = new Author({
            name,
            bio,
            image,
            birthdate,
            nationality,
            genres: genres.split(','),
            description,
        });

        await newAuthor.save();
        res.redirect('/authors');
    } catch (error) {
        console.error('Error adding author:', error);
        res.status(500).send('Error adding author');
    }
});

// Update an author
router.post('/update', async (req, res) => {
    const { id, name, bio, image, birthdate, nationality, genres, description } = req.body;

    try {
        // Update the author in the database
        await Author.findByIdAndUpdate(id, {
            name,
            bio,
            image,
            birthdate,
            nationality,
            genres: genres.split(','), // Convert comma-separated genres to an array
            description,
        });

        res.redirect('/authors'); // Redirect back to the authors page
    } catch (error) {
        console.error(`Error updating author: ${error}`);
        res.status(500).send('Error updating author.');
    }
});


module.exports = router;
