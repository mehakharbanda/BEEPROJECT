// models/announcements.js
const mongoose = require('mongoose');

// Define schema for Announcement
const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // This field is required
    },
    description: {
        type: String,
        required: true // This field is required
    },
    type: {
        type: String,
        required: true,  // This field is required
        enum: ['Notice', 'Event', 'General'] // Only these types are allowed
    },
    file: {
        type: String,
        required: false // The file is optional
    }
});

// Create and export the Announcement model
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
