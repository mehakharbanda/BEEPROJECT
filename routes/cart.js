const express = require('express');
const router = express.Router();
const Book = require('../models/books');
const Student = require('../models/Student');
//const Cart = require('../models/cart');
const mongoose = require('mongoose');

// Add book to cart
router.post('/add', async (req, res) => {
    const { bookId, price } = req.body;
    const userId = req.user._id;  // Assuming the user is authenticated

    try {
        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send('Book not found.');
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        // If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // Check if the book is already in the cart
        const existingItemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

        if (existingItemIndex !== -1) {
            // If the book is already in the cart, increase the quantity
            cart.items[existingItemIndex].quantity += 1;
        } else {
            // Otherwise, add the book to the cart
            cart.items.push({ bookId, price: parseFloat(price), quantity: 1 });
        }

        // Update the total price
        await cart.updateTotalPrice();

        // Save the cart
        await cart.save();

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding book to cart.');
    }
});


// Display the cart
router.get('/', async (req, res) => {
    const cart = req.session.cart || { items: [], totalPrice: 0 };

    res.render('cart', { cart: cart.items, totalPrice: cart.totalPrice });
});

// Clear cart
router.post('/clear', async (req, res) => {
    req.session.cart = null;  // Clear the cart from session

    res.redirect('/books');  // Redirect to the books page after clearing the cart
});

// POST route to save student details and proceed to payment
router.post('/student/details', async (req, res) => {
    const { fullName, email, phone, address, bookTitle, issuedDate, returnDate } = req.body;

    // Check if all required fields are provided
    if (!fullName || !email || !phone || !address || !bookTitle || !issuedDate || !returnDate) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Create a new student document in MongoDB
        const newStudent = new Student({
            fullName,
            email,
            phone,
            address,
            bookTitle,
            issuedDate,
            returnDate
        });

        // Save the student document to the database
        await newStudent.save();

        // Send a success response
        res.status(201).send('Student details saved successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch student details by ID
router.get('/student/details/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        // Fetch student data by ID from MongoDB
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Send the student details as the response
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET: Show the payment page
router.get('/cart/payment', (req, res) => {
    res.render('payment'); // Render the payment page view
});

// Remove an item from the cart
// Route to remove an item from the cart without using the item ID in the URL
router.post('/remove-item', async (req, res) => {
    const { bookId } = req.body;  // Get the bookId from the form submission
    const userId = req.user._id;  // Assuming the user is authenticated

    if (!bookId) {
        return res.status(400).send('Book ID is required');
    }

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Find the index of the item in the cart
        const itemIndex = cart.books.findIndex(item => item.toString() === bookId);

        if (itemIndex === -1) {
            return res.status(404).send('Item not found in cart');
        }

        // Remove the item from the cart
        cart.books.splice(itemIndex, 1);

        // Update the total price if needed
        // This could be done after removing the item if your cart calculates the total dynamically

        // Save the updated cart
        await cart.save();

        // Redirect to the cart page
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing item from cart');
    }
});


module.exports = router;
