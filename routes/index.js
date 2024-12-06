const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Paths to your files
const dataFilePath = path.join(__dirname, '..', 'data.json');
const backupFilePath = path.join(__dirname, '..', 'data.json.bak');

// Redirect root URL to login page
router.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Serve the login page
router.get('/login', (req, res) => {
    const errorMessage = req.query.error || null;
    res.render('login', { error: errorMessage });
});

// Handle POST request for login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(dataFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data file", err);
            return res.redirect('/login?error=Internal server error.');
        }

        let users;
        try {
            users = JSON.parse(data);
        } catch (e) {
            console.error("Error parsing data file", e);
            return res.redirect('/login?error=Internal server error.');
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            return res.redirect('/login?error=User not found.');
        } else if (user.password !== password) {
            return res.redirect('/login?error=Invalid password.');
        }

        const token = jwt.sign(
            { email: user.email, name: user.name, userId: user.id },
            'your-secret-key',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false });
        req.session.user = { email: user.email, name: user.name }; // Save user to session
        res.redirect('/dashboard'); // Redirect to the dashboard
    });
});

// Handle POST request for registration
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const saveDataToFiles = (users) => {
        const newUser = { id: users.length + 1, name, email, password };
        users.push(newUser);

        // Write data to both files
        const writeData = (filePath) => {
            fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8', (err) => {
                if (err) console.error(`Error writing to ${filePath}:, err`);
            });
        };

        writeData(dataFilePath);
        writeData(backupFilePath);

        return newUser;
    };

    fs.readFile(dataFilePath, 'utf-8', (err, data) => {
        let users = [];
        if (err && err.code !== 'ENOENT') {
            console.error("Error reading data file", err);
            return res.status(500).send("Internal server error.");
        }

        if (!err) {
            try {
                users = JSON.parse(data);
            } catch (e) {
                console.error("Error parsing data file", e);
                return res.status(500).send("Internal server error.");
            }
        }

        if (users.some(user => user.email === email)) {
            return res.redirect('/register?error=Email already exists.');
        }

        const newUser = saveDataToFiles(users);
        res.redirect('/login');
    });
});

module.exports = router;