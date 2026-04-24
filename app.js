// TEMPORARY RESET ROUTE
app.get('/admin/reset-password', async (req, res) => {
    try {
        const Driver = require('./models/Driver'); // Ensure this path matches yours
        const bcrypt = require('bcryptjs');
        
        const phoneNumber = "0710000003";
        const newPassword = "newPassword123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Driver.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { password: hashedPassword }
        );
        
        res.send("Password successfully reset to: " + newPassword);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});