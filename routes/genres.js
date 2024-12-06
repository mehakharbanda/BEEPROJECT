const express = require('express');
const Genre = require('../models/Genre'); // MongoDB model for genres
const User = require('../models/User'); // MongoDB model for users (for personalized recommendations)
const router = express.Router();

// Get all genres with optional filtering by tags
router.get('/', async (req, res) => {
    const { tag } = req.query;
    try {
        let genres = await Genre.find();
        if (tag) {
            genres = genres.filter(genre => genre.tags.includes(tag));
        }
        res.render('genres', { genres, tag });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching genres');
    }
});

// Add new genre
router.post('/add', async (req, res) => {
    const { name, tags, books } = req.body;
    if (!name || !tags || !books) {
        return res.status(400).send('All fields are required');
    }
    const newGenre = new Genre({
        name,
        tags: tags.split(','),
        books: books.split(',').map(title => ({ title }))
    });
    try {
        await newGenre.save();
        res.redirect('/genres');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding genre');
    }
});

// Genre click to show detailed page
router.get('/:genreName', async (req, res) => {
    const { genreName } = req.params;
    try {
        const genre = await Genre.findOne({ name: genreName });
        if (!genre) {
            return res.status(404).send('Genre not found');
        }

        // Fetch personalized recommendations based on user interests
        const user = req.user; // Assuming the user is stored in the session
        let personalizedBooks = [];
        if (user && user.genreInterests.includes(genreName)) {
            personalizedBooks = await Genre.find({ name: { $in: user.genreInterests } }).select('books');
        }

        // Upcoming events/books and featured authors
        const upcomingBooks = [
            { title: 'New Book The Starlit Maze', releaseDate: '2025-01-01', author: 'Ethan Harper' },
            { title: 'New Book A Symphony of Secrets', releaseDate: '2025-03-15', author: 'Amelia Frost' }
        ];
        const featuredAuthors = [
            { name: 'F. Scott Fitzgerald', bio: 'American novelist, best known for "The Great Gatsby".', picture: '/uploads/auth1.png', notableBooks: ['The Great Gatsby', 'Tender Is the Night'] },
            { name: 'George Orwell', bio: 'English novelist, known for "1984" and "Animal Farm".', picture: '/uploads/auth2.png', notableBooks: ['1984', 'Animal Farm'] }
        ];

        res.render('genre-detail', {
            genre,
            personalizedBooks,
            upcomingBooks,
            featuredAuthors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching genre details');
    }
});

module.exports = router;
