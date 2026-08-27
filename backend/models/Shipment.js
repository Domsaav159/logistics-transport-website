const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  sender: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },
  receiver: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },
  packages: [{
    barcode: String,
    description: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    fragile: Boolean,
    scannedAt: Date,
    scannedBy: String
  }],
  status: {
    type: String,
    enum: ['Pendiente', 'Cargado', 'En Tránsito', 'En Almacén', 'En Reparto', 'Entregado', 'No Entregado'],
    default: 'Pendiente'
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    updatedAt: Date
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  cost: Number,
  notes: String,
  history: [{
    status: String,
    timestamp: Date,
    location: String,
    notes: String
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

module.exports = mongoose.model('Shipment', shipmentSchema);
