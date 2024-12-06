const { MongoClient, ObjectId } = require('mongodb');

// Replace <username>, <password>, and <cluster-url> with your Atlas credentials
const uri = 'mongodb+srv://mpk160109:Mehak%401607@cluster0.io0zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const dbName = 'subscriptionDB'; // Your database name
let db;

// Connect to MongoDB Atlas
MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB Atlas in Subscription Model');
        db = client.db(dbName);
    })
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

class Subscription {
    // Save a new subscription
    static async save(subscriptionData) {
        try {
            const collection = db.collection('subscriptions');
            await collection.insertOne(subscriptionData);
        } catch (error) {
            console.error('Error saving subscription:', error);
            throw error;
        }
    }

    // Get all subscriptions
    static async getAll() {
        try {
            const collection = db.collection('subscriptions');
            return await collection.find().toArray();
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            throw error;
        }
    }

    // Get a subscription by ID
    static async getById(id) {
        try {
            const collection = db.collection('subscriptions');
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error('Error fetching subscription by ID:', error);
            throw error;
        }
    }
}

module.exports = Subscription;