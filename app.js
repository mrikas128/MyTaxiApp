// GET DRIVER PROFILE
app.get('/driver/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: "Driver not found" });
        
        // Return only the public details (exclude password for security!)
        res.status(200).json({
            fullName: driver.fullName,
            phoneNumber: driver.phoneNumber,
            vehicleNumber: driver.vehicleNumber
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});