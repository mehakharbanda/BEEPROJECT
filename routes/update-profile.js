const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

function loadUserData() {
    const filePath = path.join(__dirname, '..', 'data.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

router.get('/update-profile', (req, res) => {
    if (req.session.user) {
        const userData = loadUserData();
        const user = userData.find(u => u.email === req.session.user.email); 

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.render('update-profile', { user });
    } else {
        res.redirect('/login'); 
    }
});

router.post('/update-profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    const { name, dob, age, address } = req.body;
    const userData = loadUserData();
    const email = req.session.user.email;

    const user = userData.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name;
    user.dateOfBirth = dob;
    user.age = age;
    user.address = address;

    const filePath = path.join(__dirname, '..', 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');

    req.session.user = { ...req.session.user, name, dob, age, address };
    res.json({ success: true });
});

module.exports = router;
