const mongoose = require('mongoose');

// Define the schema for authors
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true }, // URL of the author's image
    birthdate: { type: Date, required: true },
    nationality: { type: String, required: true },
    genres: { type: [String], required: true }, // Array of genres
    description: { type: String, required: true }
});

// Export the model
module.exports = mongoose.model('Author', authorSchema);
