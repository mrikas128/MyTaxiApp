const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Driver = require('./models/Driver');

// 1. Double check: Replace ONLY the password part in the string
// If your password has special characters like @, #, or !, it might break!
const dbURI = "mongodb+srv://mrikas128:jA3ZwGm7JLBrvI8B@cluster0.aswl7e6.mongodb.net/?appName=Cluster0";

async function resetPassword() {
    try {
        console.log("--- STARTING RESET SCRIPT ---");
        
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(dbURI);
        console.log("Successfully connected to database!");

        const phoneNumber = "0710000003";
        const newPassword = "123456";

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log("Updating database...");
        const result = await Driver.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { password: hashedPassword }
        );

        if (result) {
            console.log("Success! Password for " + phoneNumber + " has been reset.");
        } else {
            console.log("Error: Driver with phone number " + phoneNumber + " not found.");
        }
        
        process.exit();
    } catch (err) {
        console.error("--- CRITICAL ERROR ---");
        console.error(err);
        process.exit(1);
    }
}

resetPassword();