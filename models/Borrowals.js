const mongoose = require('mongoose');

const borrowalSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    bookName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date }, // Optional, will be set when the book is returned
    fine: { type: String }, // Fine will be calculated and added based on the overdue period
    paymentStatus: { type: String, default: 'Unpaid' } // Default payment status is 'Unpaid'
});

module.exports = mongoose.model('Borrowal', borrowalSchema);
