const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();

// Database Connection
const dbURI = process.env.MONGO_URI; 

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch((err) => {
    console.log('Database Error: ', err);
  });

// Your existing routes (keep these)
app.get('/', (req, res) => {
  res.send('My Taxi App is running!');
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`My Taxi Server running on port ${PORT}`);
});