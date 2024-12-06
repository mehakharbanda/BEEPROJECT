// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');

// // File paths
// const booksFilePath = path.join(__dirname, '../books.json');
// const reservationsFilePath = path.join(__dirname, '../reservations.json');

// // Helper function to read JSON data from a file
// const readJSON = (filePath) => {
//     try {
//         return JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     } catch (error) {
//         console.error(`Error reading ${filePath}:, error`);
//         return [];
//     }
// };

// //Helper function to write JSON data to a file
// const writeJSON = (filePath, data) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//     } catch (error) {
//         console.error(`Error writing to ${filePath}:, error`);
//     }
// };

// // Wrapper for reading books
// const readBooks = () => readJSON(booksFilePath);

// // Wrapper for writing books
// const writeBooks = (books) => {
//     try {
//         fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
//         console.log('Books updated:', books); // Debugging line
//     } catch (error) {
//         console.error(`Error writing to ${booksFilePath}:, error`);
//     }
// };

// //router.use(authenticate);
// router.use((err, req, res, next) => {
//     console.error('Error:', err.message); // Log the error for debugging
//     const statusCode = err.statusCode || 500; // Default to 500 if no status code set
//     const message = err.message || 'Something went wrong';
//     res.status(statusCode).json({ error: message });
// });
// // Render books page with the list of books
// router.get('/books',(req, res) => {
//     const books = readBooks();
//     res.render('books', { books });
// });

// // API to get all books
// // router.get('/api/books', (req, res) => {
// //     const books = readBooks();
// //     res.json(books);
// // });

// router.post('/books', (req, res) => {
//     const { title, author, genre, status, imageUrl } = req.body;

//     if (!title || !author || !genre || status === undefined) {
//         return res.status(400).send('Missing required fields');
//     }

//     const books = readBooks();
//     const newBook = {
//         id: books.length + 1,
//         title,
//         author,
//         genre,
//         available: status === 'true',
//         imageUrl: imageUrl || '/default-book-image.jpg' // Default image if not provided
//     };

//     books.push(newBook);
//     writeBooks(books);
//     res.redirect('/books'); // Redirect to books list
// });


// router.delete('/books/:id', (req, res) => {
//     const bookId = parseInt(req.params.id); // Ensure id is an integer
//     let books = readBooks();
//     // Filter out the book with the specified ID
//     books = books.filter(book => book.id !== bookId);
    
//     writeBooks(books); // Update the books file with the new list
//     res.status(200).send('Book removed');
// });


// // Route to render the update page for a specific book
// router.get('/update-book/:id', (req, res) => {
//     const bookId = parseInt(req.params.id);
//     const books = readBooks();

//     // Find the book with the given ID
//     const book = books.find(b => b.id === bookId);

//     if (!book) {
//         return res.status(404).send('Book not found');
//     }

//     // Render the update-book page and pass the book data to it
//     res.render('update-book', { book });
// });
// router.put('/books/:id', (req, res) => {
//     const bookId = parseInt(req.params.id);
//     const { title, author, genre, status } = req.body;
//     const books = readBooks();

//     // Find the book by ID
//     const book = books.find((b) => b.id === bookId);
//     if (!book) {
//         return res.status(404).json({ error: 'Book not found.' });
//     }

//     // Update the book details
//     book.title = title || book.title;
//     book.author = author || book.author;
//     book.genre = genre || book.genre;
//     if (status !== undefined && (status === 'true' || status === 'false')) {
//         book.available = status === 'true';
//     }

//     writeBooks(books); // Save the updated books
//     res.status(200).json(book); // Send the updated book as the response
// });



// // API to search books by title, author, or genre
// router.get('/api/search', (req, res) => {
//     const { query } = req.query; // Get the search query from the URL
//     if (!query) {
//         return res.status(400).send('Search query is required');
//     }

//     const books = readBooks();
//     const filteredBooks = books.filter(book => {
//         return book.title.toLowerCase().includes(query.toLowerCase()) ||
//                book.author.toLowerCase().includes(query.toLowerCase()) ||
//                book.genre.toLowerCase().includes(query.toLowerCase());
//     });

//     res.json(filteredBooks);
// });
// // router.post('/books/update', (req, res) => {
// //     const updatedBook = req.body;

// //     if (!updatedBook.bookId) {
// //         return res.status(400).json({ error: 'Book ID is required.' });
// //     }

// //     // Read the existing books
// //     const books = readBooks();
// //     const bookIndex = books.findIndex(book => book.id === updatedBook.bookId);

// //     if (bookIndex === -1) {
// //         return res.status(404).json({ error: 'Book not found.' });
// //     }

// //     // Update the book details
// //     books[bookIndex] = {
// //         ...books[bookIndex],
// //         title: updatedBook.title || books[bookIndex].title,
// //         author: updatedBook.author || books[bookIndex].author,
// //         genre: updatedBook.genre || books[bookIndex].genre,
// //         status: updatedBook.status === 'true',
// //     };

// //     // Write the updated list back to the file
// //     writeBooks(books);

// //     return res.json(books[bookIndex]);
// // });



// // API to reserve a book
// router.post('/reserve', (req, res) => {
//     const { bookId, userName } = req.body;
//     const reservations = readJSON(reservationsFilePath);

//     reservations.push({ bookId, userName, reservationDate: new Date() });
//     writeJSON(reservationsFilePath, reservations);
//     res.status(201).send('Book reserved successfully');
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/books');
const Cart = require('../models/cart'); // Adjust the path to where Cart model is located

const { bookSchema } = require('../models/books');  // adjust the path accordingly

//const Book = mongoose.model('Book', bookSchema);
const Reservation = require('../models/reservation');

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('books', { books });
    } catch (err) {
        res.status(500).send('Error fetching books');
    }
});


router.post('/books', async (req, res) => {
    const { title, author, genre, status, imageUrl } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            genre,
            available: status === 'true',  // Convert string to boolean
            imageUrl: imageUrl || '/default-book-image.jpg',  // Default image if not provided
            // price: parseFloat(price) || 0,  // Ensure price is a valid number
        });

        await newBook.save();
        res.redirect('/books'); // Redirect to book listing page after successful addition
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error adding book.');
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).send('Book removed');
    } catch (err) {
        res.status(500).send('Error deleting book');
    }
});


// Render update book page
router.get('/update-book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.render('update-book', { book });
    } catch (err) {
        res.status(500).send('Error fetching book');
    }
});
// router.put('/books/:id', async (req, res) => {
//     const { title, author, genre, status } = req.body;

//     try {
//         const updatedBook = await Book.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title,
//                 author,
//                 genre,
//                 available: status === 'true'
//             },
//             { new: true }
//         );

//         if (!updatedBook) {
//             return res.status(404).send('Book not found');
//         }

//         res.status(200).json(updatedBook);
//     } catch (err) {
//         res.status(500).send('Error updating book');
//     }
// });

router.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send('Search query is required');
    }

    try {
        const books = await Book.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { author: new RegExp(query, 'i') },
                { genre: new RegExp(query, 'i') }
            ]
        });

        res.json(books);
    } catch (err) {
        res.status(500).send('Error searching books');
    }
});

router.post('/reserve', async (req, res) => {
    const { bookId, userName } = req.body;

    try {
        const reservation = new Reservation({ bookId, userName });
        await reservation.save();

        res.status(201).send('Book reserved successfully');
    } catch (err) {
        res.status(500).send('Error reserving book');
    }
});
router.post('/add-to-cart', async (req, res) => {
    const { bookId } = req.body;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Initialize cart in session if not already set
        if (!req.session.cart) {
            req.session.cart = [];
        }

        const bookInCart = req.session.cart.find(item => item._id.toString() === book._id.toString());
        
        if (bookInCart) {
            return res.status(400).send('This book is already in the cart');
        }

        req.session.cart.push(book);
        // Store the book title in session for prefill
        req.session.selectedBookTitle = book.title;

        res.redirect('/cart');
    } catch (err) {
        res.status(500).send('Error adding book to cart');
    }
});

router.get('/cart', (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.render('cart', { cart: [], totalPrice: 0, selectedBookTitle: null });
    }

    const totalPrice = req.session.cart.reduce((total, book) => total + (book.price || 0), 0);

    // Pass the selected book title to the view if it's stored in session
    res.render('cart', { 
        cart: req.session.cart, 
        totalPrice,
        selectedBookTitle: req.session.selectedBookTitle || null
    });
});

// Clear cart after payment (optional)
router.post('/cart/clear', (req, res) => {
    req.session.cart = []; // Clear the cart from the session
    res.redirect('/books'); // Redirect back to the books page
});
router.post('/remove-item/:id', (req, res) => {
    const bookId = req.params.id;
    
    // Remove the book with the specified id from the session cart
    req.session.cart = req.session.cart.filter(book => book._id.toString() !== bookId);

    // If the book was removed, clear the selected book title
    if (req.session.cart.length === 0) {
        req.session.selectedBookTitle = null;
    }

    // Redirect to the cart page after removal
    res.redirect('/cart');
});

// Increase the quantity of a book
router.put('/books/increase/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Increase quantity by 1
        book.quantity += 1;
        await book.save();

        res.status(200).json({ success: true, quantity: book.quantity }); // Return updated quantity
    } catch (err) {
        res.status(500).send('Error increasing book quantity');
    }
});
router.put('/books/:id', async (req, res) => {
    const { title, author, genre, available, imageUrl } = req.body;
    const bookId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send('Invalid book ID');
    }

    try {
        // Find the book by ID and update it
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                title,
                author,
                genre,
                available,
                imageUrl: imageUrl || '/default-book-image.jpg',
            },
            { new: true }  // Ensures the updated document is returned
        );

        // If no book is found with the given ID
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }

        // Return the updated book
        res.status(200).json(updatedBook);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating book');
    }
});


// Decrease the quantity of a book
router.put('/books/decrease/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        if (book.quantity > 0) {
            // Decrease quantity by 1, but ensure it's not less than 0
            book.quantity = Math.max(0, book.quantity - 1);
            await book.save();

            res.status(200).json({ success: true, quantity: book.quantity }); // Return updated quantity
        } else {
            res.status(400).send('No more copies available to decrease');
        }
    } catch (err) {
        res.status(500).send('Error decreasing book quantity');
    }
});

router.post('/updateQuantity/:id', (req, res) => {
    const bookId = req.params.id;
    const delta = parseInt(req.query.delta, 10);

    if (isNaN(delta)) {
        return res.status(400).json({ error: 'Invalid quantity change' });
    }

    const cart = readJSON(cartFilePath);
    const bookIndex = cart.findIndex(book => book._id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found in cart' });
    }

    // Update the quantity
    const book = cart[bookIndex];
    book.quantity += delta;

    if (book.quantity < 1) {
        book.quantity = 1; // Ensure quantity can't be less than 1
    }

    // Save the updated cart
    writeJSON(cartFilePath, cart);

    // Respond with the updated book details
    res.json(book);
});
// Function to update quantity in the MongoDB database
router.put('/cart/updateQuantity/:id', async (req, res) => {
    const { id } = req.params;  // Book ID
    const { delta } = req.query;  // Delta (1 or -1)

    try {
        const cartItem = await Cart.findOne({ _id: id });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        let newQuantity = cartItem.quantity + parseInt(delta);

        if (newQuantity < 1) {
            return res.status(400).json({ error: 'Quantity cannot be less than 1' });
        }

        cartItem.quantity = newQuantity;
        await cartItem.save();  // Save the updated cart item

        // Optionally, calculate the total price again if necessary
        const totalPrice = await Cart.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$price"] } } } }
        ]);

        res.json({ success: true, newQuantity, totalPrice: totalPrice[0].total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});



module.exports = router;
