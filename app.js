const express = require('express');
const mongoose = require('mongoose');
const Driver = require('./models/Driver'); // Make sure this file exists in /models

const app = express();

// 1. Middleware
app.use(express.json()); // Allows the server to read JSON data
app.use(express.urlencoded({ extended: true })); // Allows reading form data

// 2. Database Connection
// We use process.env.MONGODB_URI so your password is never hardcoded (Security)
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("FATAL ERROR: MONGODB_URI is not set in Render environment variables.");
    process.exit(1); // Stop the app if no database is found
}

mongoose.connect(dbURI)
    .then(() => console.log("Successfully connected to database!"))
    .catch((err) => console.error("Database connection error:", err));

// 3. Login Route
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find driver by EITHER email OR phone number using the $or operator
        const driver = await Driver.findOne({
            $or: [
                { email: identifier },
                { phoneNumber: identifier }
            ]
        });

        // If driver doesn't exist, stop here
        if (!driver) {
            return res.status(401).json({ message: "Invalid email, phone number, or password." });
        }

        // Verify password using the method we added to Driver.js
        const isMatch = await driver.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email, phone number, or password." });
        }

        // If successful
        res.status(200).json({ 
            message: "Login successful!", 
            driverId: driver._id,
            name: driver.fullName 
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// 4. Start Server
// Render will provide the PORT, otherwise we default to 10000
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});