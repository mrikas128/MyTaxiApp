const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String },
  // Status helps us know who to send ride requests to
  status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Offline' },
  // Storing coordinates as an array [longitude, latitude]
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] 
  },
  createdAt: { type: Date, default: Date.now }
});

// Create a geospatial index so we can find drivers "near" a passenger later
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);