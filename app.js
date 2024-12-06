const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3212;

// MongoDB connection URI (Replace <db_password> with your actual password)
// const mongoURI = 'mongodb+srv://mpk160109:Mehak%401607@cluster0.io0zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoURI = 'mongodb+srv://mpk160109:Mehak%401607@cluster0.io0zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb+srv://mehakms06:mypass123@cluster0.jk2hf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Session setup
app.use(
    session({
        secret: 'thisisyourtokenhere',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const filePath = path.join(__dirname, 'data', 'subscribedMembers.json');
function loadSubscriptions() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const booksRouter = require('./routes/books');
const authorsRouter = require('./routes/authors');
const updateProfileRouter = require('./routes/update-profile');
const profileRouter = require('./routes/profile');
const borrowalsRouter = require('./routes/borrowals');
const membershipRouter = require('./routes/membership');
const subscribeRouter = require('./routes/subscribe');
const genresRoutes = require('./routes/genres');
//const cartRoutes = require('./routes/cartRoutes');
const cartRoutes = require('./routes/cart');

// Use Routes
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', dashboardRouter);
app.use('/', booksRouter);
app.use('/authors', authorsRouter);
app.use('/', updateProfileRouter);
app.use('/profile', profileRouter);
app.use('/borrowals', borrowalsRouter);
app.use('/genres', genresRoutes);
app.use('/', membershipRouter);
app.use('/', subscribeRouter);
 // Adjust the path if needed
app.use('/cart', cartRoutes); // Mount the cart routes on '/cart'

app.get('/subscribed-members', (req, res) => {
    const subscribedMembers = loadSubscriptions();
    res.render('subscribed-members', { user: req.session.user, subscribedMembers });
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
