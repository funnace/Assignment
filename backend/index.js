const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const { connectToMongo } = require('./db_connection');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// CORS Configuration
app.use(cors());

app.options('*', cors());

// Middleware
app.use(express.json());  // To parse JSON bodies

connectToMongo();

// Routes
app.use('/api', routes); 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
