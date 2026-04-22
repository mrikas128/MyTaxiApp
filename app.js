const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import your new Model

const app = express();
app.use(express.json()); // Essential: Allows the app to read JSON data

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to Database!'))
  .catch((err) => console.log('Database Error: ', err));

// --- Test Route ---
// This route will allow you to manually test if you can save a user
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('User saved to database!');
  } catch (error) {
    res.status(400).send('Error saving user: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`My Taxi Server running on port ${PORT}`);
});