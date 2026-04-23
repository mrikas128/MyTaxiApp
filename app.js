const express = require('express');
const mongoose = require('mongoose');
const Driver = require('./models/Driver');

// 1. Initialize App
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const dbURI = process.env.MONGO_URI;

// 2. Connect to Database & Start Server
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to Database!');
    app.listen(PORT, () => {
      console.log(`My Taxi Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// 3. --- ROUTES ---

// Registration Route
app.post('/register-driver', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).send('Driver saved to database!');
  } catch (error) {
    console.error("Error saving driver:", error);
    res.status(400).send('Error saving driver: ' + error.message);
  }
});

// Nearby Search Route
app.get('/drivers/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).send('Please provide latitude and longitude');
  }

  try {
    const drivers = await Driver.find({
      status: 'Available',
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000
        }
      }
    });

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error finding drivers:", error);
    res.status(500).send('Server Error: ' + error.message);
  }
});