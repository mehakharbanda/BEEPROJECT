const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Paths to your data files
const dataFilePath = path.join(__dirname, '..', 'data.json');
const loginFilePath = path.join(__dirname, '..', 'login.json');
const backupFilePath = path.join(__dirname, '..', 'login.json.bak');

// Helper function to read data from a JSON file
const readData = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (err) {
        console.error(`Error reading file ${filePath}:, err`);
    }
    return [];
};

// Helper function to write data to a JSON file
const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing to file ${filePath}:, err`);
    }
};

// Route for user registration
router.post('/register', (req, res) => {
    const { name, email, password, dob, age, address } = req.body;

    // Validation for missing fields
    if (!name || !email || !password || !dob || !age || !address) {
        return res.send('All fields are required!');
    }

    const users = readData(dataFilePath);

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.send('User already exists. Please login.');
    }

    // Add new user to the array
    const newUser = { name, email, password, dob, age, address };
    users.push(newUser);

    // Write the updated user data back to the data.json file
    writeData(dataFilePath, users);

    // Save login details to both login.json and login.json.bak
    const loginUsers = readData(loginFilePath);
    loginUsers.push({ email, password }); // Only saving login details here
    writeData(loginFilePath, loginUsers);
    writeData(backupFilePath, loginUsers);

    // Redirect to login page after successful registration
    res.redirect('/login'); // Assuming your login page is under /user/login
});

// Route for user login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readData(dataFilePath); // Use the same data.json for login

    let user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
        return res.send('Invalid email or password.');
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, 'your-secret-key', { expiresIn: '1h' });

    // Store the token in a cookie to maintain the session
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Redirect to dashboard after successful login
    res.redirect('/dashboard');
});

// Route to access dashboard
router.get('/dashboard', (req, res) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.redirect('/login'); // Redirect to login if token is not found
    }

    // Verify the token
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.redirect('/login'); // Redirect to login if token is invalid
        }

        // If token is valid, render the dashboard page
        res.render('dashboard', { user: decoded });
    });
});

// Route for logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.redirect('/login');
    });
});

module.exports = router;