const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String },
  status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Offline' },
  
  // FIXED: Added default coordinates [0, 0] to satisfy the 2dsphere index requirements
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } 
  },
  
  createdAt: { type: Date, default: Date.now }
});

// This index allows you to search for drivers "near" a passenger later
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);