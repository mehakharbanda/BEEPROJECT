const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: String, default: '/default-book-image.jpg' },
    //price: { type: Number, required: true }
});

// Export Book model
module.exports = mongoose.model('Book', bookSchema);
