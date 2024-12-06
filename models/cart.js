// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
// });


// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;


