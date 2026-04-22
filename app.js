// --- Add this below your /register route ---
app.post('/register-driver', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).send('Driver saved to database!');
  } catch (error) {
    res.status(400).send('Error saving driver: ' + error.message);
  }
});