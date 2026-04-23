const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name: String,
  phoneNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Added password field
  vehicleNumber: String,
  vehicleModel: String,
  status: { type: String, default: 'Available' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [lng, lat]
  }
});

// Hash password before saving
driverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);