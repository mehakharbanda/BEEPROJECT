const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
    name: String,
    description: String,
    tags: [String],
    books: [{
        title: String,
        author: String,
        description: String
    }],
    sampleExcerpt: String
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
