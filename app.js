const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('./models/Driver');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const dbURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Set this in Render!

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// 1. Register (Public)
app.post('/register-driver', async (req, res) => {
  try {
    const { name, phoneNumber, password, vehicleNumber, vehicleModel, lat, lng } = req.body;
    const newDriver = new Driver({
      name, phoneNumber, password, vehicleNumber, vehicleModel,
      location: { type: "Point", coordinates: [parseFloat(lng || 80.6250), parseFloat(lat || 7.3590)] }
    });
    await newDriver.save();
    res.status(201).send('Driver registered successfully');
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

// 2. Login (Public)
app.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  const driver = await Driver.findOne({ phoneNumber });
  if (!driver || !(await bcrypt.compare(password, driver.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ phoneNumber: driver.phoneNumber }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// 3. Nearby Search (Protected)
app.get('/drivers/nearby', authenticateToken, async (req, res) => {
  const { lat, lng } = req.query;
  const drivers = await Driver.find({
    status: 'Available',
    location: { $near: { $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: 5000 } }
  });
  res.json(drivers);
});

// Database & Server Setup
mongoose.connect(dbURI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));