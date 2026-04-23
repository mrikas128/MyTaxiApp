const express = require('express');
const mongoose = require('mongoose');
const Driver = require('./models/Driver');

// 1. Initialize App
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const dbURI = process.env.MONGO_URI;

// 2. Connect to Database & Start Server
// We only start the server AFTER the database connection is successful
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

// Registration Route (Handles Location)
app.post('/register-driver', async (req, res) => {
  try {
    const { name, phoneNumber, vehicleNumber, vehicleModel, status, lat, lng } = req.body;

    const newDriver = new Driver({
      name,
      phoneNumber,
      vehicleNumber,
      vehicleModel,
      status: status || 'Available',
      location: {
        type: "Point",
        // CRITICAL: MongoDB uses [longitude, latitude] order
        coordinates: [parseFloat(lng || 80.6250), parseFloat(lat || 7.3590)] 
      }
    });

    await newDriver.save();
    res.status(201).send('Driver saved to database with location!');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send('Error: A driver with this phone number already exists.');
    }
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
            coordinates: [parseFloat(lng), parseFloat(lat)] // [lng, lat]
          },
          $maxDistance: 5000 // 5km
        }
      }
    });

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error finding drivers:", error);
    res.status(500).send('Server Error: ' + error.message);
  }
});