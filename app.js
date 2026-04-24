const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Driver = require('./models/Driver');

// 1. Initialize 'app' FIRST
const app = express();

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Database Connection
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("FATAL ERROR: MONGODB_URI is not set.");
    process.exit(1);
}

mongoose.connect(dbURI)
    .then(() => console.log("Successfully connected to database!"))
    .catch((err) => console.error("Database connection error:", err));

// 4. Routes (Order doesn't matter here, but they must be after 'const app')

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const driver = await Driver.findOne({
            $or: [{ email: identifier }, { phoneNumber: identifier }]
        });

        if (!driver) return res.status(401).json({ message: "Account not found." });

        const isMatch = await driver.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password." });

        res.status(200).json({ message: "Login successful!", driverId: driver._id });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { fullName, phoneNumber, email, password, vehicleNumber } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDriver = new Driver({
            fullName,
            phoneNumber,
            email,
            password: hashedPassword,
            vehicleNumber
        });

        await newDriver.save();
        res.status(201).json({ message: "Driver registered successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Registration failed: " + err.message });
    }
});

// 5. Start Server
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});