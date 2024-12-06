const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    bookTitle: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    returnedOnDate: { type: Date, default: null },
    fine: { type: Number, default: 0 }
});

// Check if the model already exists to avoid overwriting
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;
