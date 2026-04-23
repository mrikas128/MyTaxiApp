const express = require('express');
const mongoose = require('mongoose');
const Driver = require('./models/Driver');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const dbURI = process.env.MONGO_URI;

// Connect to DB first, then start the server
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to Database!');
    // Only listen for requests after DB is connected
    app.listen(PORT, () => {
      console.log(`My Taxi Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Stop the app if DB connection fails
  });

// Routes
app.post('/register-driver', async (req, res) => {
  // ... your existing logic ...
});