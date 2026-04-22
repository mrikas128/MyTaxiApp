const express = require('express');
const fs = require('fs');
const app = express(); // <--- This line is critical!
const port = 3000;

app.use(express.json());

// Load data file
const DB_FILE = './rides.json';
let rideHistory = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/rides', (req, res) => {
  res.json(rideHistory);
});

app.post('/api/ride', (req, res) => {
  const { pickup, destination, distance } = req.body;
  
  // Pricing Business Logic
  const baseFare = 50.00;
  const ratePerKm = 80.00;
  const totalFare = baseFare + (distance * ratePerKm);

  const newRide = { 
    pickup, 
    destination, 
    distance, 
    totalFare 
  };

  rideHistory.push(newRide);
  fs.writeFileSync(DB_FILE, JSON.stringify(rideHistory, null, 2));
  
  res.json({ message: "Ride booked!", fare: totalFare });
});

app.listen(port, () => {
  console.log(`My Taxi Server running on port ${port}`);
});