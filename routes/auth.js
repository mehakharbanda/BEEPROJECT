// In your router file (e.g., auth.routes.js)

const { login, logout } = require("../controllers/auth.controller");

const auth = require("express").Router();

// Route to handle login form submission (GET request to show the login form)
auth.get("/login", (req, res) => {
    res.render("login");  // Render login page
});

// Route to handle login form submission (POST request)
auth.post("/login", login);

// Route to handle logout and clear the session/token
auth.get("/logout", logout);

module.exports = auth;