const express = require('express');
const mongoose = require('mongoose');
const Driver = require('./models/Driver');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Database Connection
// Ensure MONGODB_URI is set in Render Environment Variables
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("FATAL ERROR: MONGODB_URI is not set.");
    process.exit(1);
}

mongoose.connect(dbURI)
    .then(() => console.log("Successfully connected to database!"))
    .catch((err) => console.error("Database connection error:", err));

// 2. Login Route
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const driver = await Driver.findOne({
            $or: [
                { email: identifier },
                { phoneNumber: identifier }
            ]
        });

        if (!driver) {
            return res.status(401).json({ message: "Account not found." });
        }

        const isMatch = await driver.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful!", driverId: driver._id });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// 3. Port Binding (The '0.0.0.0' is crucial for Render)
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});