const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const { connectToMongo } = require('./db_connection')
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  // Use PORT from .env or default to 5000

// Middleware
app.use(express.json());  // To parse JSON bodies
app.use(cors());

// Call the MongoDB connection function
connectToMongo();

// Routes
app.use('/api', routes);  // All routes from routes.js will be prefixed with "/api"

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
