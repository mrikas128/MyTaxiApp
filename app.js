const bcrypt = require('bcryptjs'); // Make sure this is at the top of your file

app.post('/register', async (req, res) => {
    try {
        const { fullName, phoneNumber, email, password, vehicleNumber } = req.body;

        // Hash the password before saving
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