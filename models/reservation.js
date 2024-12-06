const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userName: { type: String, required: true },
    reservationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
