const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Driver = require('./models/Driver');

const app = express();
app.use(express.json()); // <--- CRITICAL: Without this, req.body will be empty!

const PORT = process.env.PORT || 10000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to Database!'))
  .catch((err) => console.log('Database Error: ', err));

// --- Your Routes ---
app.post('/register', async (req, res) => { /* your registration logic */ });

// Your debug-enabled driver route
app.post('/register-driver', async (req, res) => {
  console.log("Received request for /register-driver");
  console.log("Request Body:", req.body);

  try {
    const newDriver = new Driver(req.body);
    console.log("Attempting to save to DB...");
    await newDriver.save();
    console.log("Save successful!");
    res.status(201).send('Driver saved to database!');
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).send('Error saving driver: ' + error.message);
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`My Taxi Server running on port ${PORT}`);
});