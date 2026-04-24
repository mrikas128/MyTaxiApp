const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Driver = require('./models/Driver'); // Ensure this points to your file

const app = express();

// Middleware: This is REQUIRED to read data sent from your login form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Connect to MongoDB (Replace with your actual string if needed)
const dbURI = "YOUR_MONGODB_CONNECTION_STRING_HERE"; 
mongoose.connect(dbURI)
    .then(() => console.log("Successfully connected to database!"))
    .catch((err) => console.log("Connection error:", err));

// 2. LOGIN ROUTE (The logic we discussed)
app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Search by phone OR email using the $or operator
        const driver = await Driver.findOne({
            $or: [
                { email: identifier },
                { phoneNumber: identifier }
            ]
        });

        // If driver doesn't exist
        if (!driver) {
            return res.status(400).json({ message: "Account not found." });
        }

        // Verify password using the method defined in Driver.js
        const isMatch = await driver.matchPassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful!", driverId: driver._id });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// 3. START SERVER (Dynamic port for Render)
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});