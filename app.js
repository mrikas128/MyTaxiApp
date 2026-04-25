const express = require('express');
const app = express();
app.use(express.json());

// THIS IS WHERE YOUR NEW ROUTE MUST BE:
app.get('/driver/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: "Driver not found" });
        res.status(200).json({
            fullName: driver.fullName,
            phoneNumber: driver.phoneNumber,
            vehicleNumber: driver.vehicleNumber
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// ... your other routes (like /register and /login) ...

app.listen(10000, () => console.log("Server running on port 10000"));