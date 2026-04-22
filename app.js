const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Driver = require('./models/Driver'); // Add this

const app = express(); // <--- THIS MUST BE HERE BEFORE YOU USE IT
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to Database!'))
  .catch((err) => console.log('Database Error: ', err));

// Now that 'app' exists, you can safely use it for routes:
app.post('/register', async (req, res) => { /* ... */ });
app.post('/register-driver', async (req, res) => { /* ... */ });

app.listen(PORT, () => {
  console.log(`My Taxi Server running on port ${PORT}`);
});