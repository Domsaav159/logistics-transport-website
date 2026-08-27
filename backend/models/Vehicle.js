const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Van', 'Camión', 'Bicicleta', 'Moto'],
    required: true
  },
  brand: String,
  model: String,
  year: Number,
  capacity: {
    weight: Number,
    volume: Number
  },
  status: {
    type: String,
    enum: ['Disponible', 'En Ruta', 'En Mantenimiento', 'Inactivo'],
    default: 'Disponible'
  },
  gpsDevice: {
    deviceId: String,
    status: String,
    lastUpdate: Date
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    accuracy: Number,
    heading: Number,
    speed: Number,
    timestamp: Date
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fuelLevel: Number,
  odometer: Number,
  lastMaintenance: Date,
  nextMaintenance: Date,
  documents: [{
    type: String,
    expiryDate: Date
  }],
  trackingHistory: [{
    latitude: Number,
    longitude: Number,
    speed: Number,
    heading: Number,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
