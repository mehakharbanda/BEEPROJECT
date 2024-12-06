const mongoose = require('mongoose');
const Genre = require('./models/Genre'); // Adjust the path if needed
const User = require('./models/User'); // Adjust the path if needed

// MongoDB connection
// const mongoURI = 'mongodb://localhost:27017';
// const mongoURI = 'mongodb+srv://mehakms06:mypass123@cluster0.jk2hf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoURI = 'mongodb+srv://mpk160109:Mehak%401607@cluster0.io0zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Data to be seeded
const genres = [
    {
        name: "Fiction",
        tags: ["Trending", "Staff Picks"],
        books: [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
            { title: "1984", author: "George Orwell" },
            { title: "To Kill a Mockingbird", author: "Harper Lee" }
        ]
    },
    {
        name: "Non-fiction",
        tags: ["Trending", "New Additions"],
        books: [
            { title: "Sapiens", author: "Yuval Noah Harari" },
            { title: "Educated", author: "Tara Westover" },
            { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot" }
        ]
    },
    {
        name: "Science Fiction",
        tags: ["Trending", "New Additions"],
        books: [
            { title: "Dune", author: "Frank Herbert" },
            { title: "Ender's Game", author: "Orson Scott Card" },
            { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" }
        ]
    }
];

const users = [
    {
        name: "Ram",
        email: "ram.1@gmail.com",
        profilePicture: "prof1.png",
        genreInterests: ["Non-fiction", "Biography", "Fiction"],
        notifications: [
            "New books added in your favorite genre: Fiction.",
            "A new author has joined the platform: F. Scott Fitzgerald."
        ]
    },
    {
        name: "Mehak",
        email: "mehak.s@gmail.com",
        profilePicture: "prof2.png",
        genreInterests: ["Non-fiction", "Mystery", "Fiction"],
        notifications: [
            "New books added in your favorite genre: Non-fiction.",
            "A new book has been added to the Fiction genre: 1984."
        ]
    },
    {
        name: "Rishi",
        email: "rishi123@gmail.com",
        profilePicture: "default1.png",
        genreInterests: ["Mystery", "Thriller"],
        notifications: [
            "New books added in your favorite genre: Mystery.",
            "The mystery novel 'The Silent Patient' is now available for borrowing."
        ]
    },
    {
        name: "Mannat",
        email: "mannat@gmail.com",
        profilePicture: "prof3.png",
        genreInterests: ["Drama", "Horror"],
        notifications: [
            "New books added in your favorite genre: Horror.",
            "Check out the newly available Drama series: 'The Crown'."
        ]
    },
    {
        name: "Ariana",
        email: "ari123@gmail.com",
        profilePicture: "prof3.png",
        genreInterests: ["Drama", "Suspense","Thriller"],
        notifications: [
            "New books added in your favorite genre: Drama.",
            "Check out the newly available Drama series: 'The Crown'."
        ]
    },
    {
        name: "Ajuni",
        email: "ajuni@gmail.com",
        profilePicture: "prof3.png",
        genreInterests: ["Drama", "Romance"],
        notifications: [
            "New books added in your favorite genre: Romance.",
            "Check out the newly available Drama series: 'The Crown'."
        ]
    },
    {
        name: "Veda",
        email: "veda@gmail.com",
        profilePicture: "prof3.png",
        genreInterests: ["Fiction", "Horror"],
        notifications: [
            "New books added in your favorite genre: Horror.",
            "Check out the newly available Drama series: 'The Crown'."
        ]
    },
    {
        name: "Viha",
        email: "viha@gmail.com",
        profilePicture: "prof3.png",
        genreInterests: ["Non-Fiction", "Mystery","Spiritual"],
        notifications: [
            "New books added in your favorite genre: Spiritual.",
            "Check out the newly available Drama series: 'The Crown'."
        ]
    }
];

// Seed database
async function seedDatabase() {
    try {
        await Genre.deleteMany(); // Clear existing genres
        await User.deleteMany(); // Clear existing users

        await Genre.insertMany(genres);
        console.log('Genres seeded successfully.');

        await User.insertMany(users);
        console.log('Users seeded successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
