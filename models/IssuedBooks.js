const IssuedBooks = mongoose.model(
    'IssuedBooks',
    new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        bookTitle: { type: String, required: true },
        issuedDate: { type: Date, required: true },
        returnDate: { type: Date, required: true },
        books: [
            {
                title: { type: String, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
    })
);
