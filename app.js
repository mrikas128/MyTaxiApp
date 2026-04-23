app.get('/drivers/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  // Validate inputs
  if (!lat || !lng) {
    return res.status(400).send('Please provide latitude and longitude');
  }

  try {
    const drivers = await Driver.find({
      status: 'Available', // Only find drivers who are free
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)] // Note: GeoJSON uses [lng, lat]
          },
          $maxDistance: 5000 // 5,000 meters (5km radius)
        }
      }
    });

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error finding drivers:", error);
    res.status(500).send('Server Error: ' + error.message);
  }
});