const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shipments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment'
    }
  ],
  startPoint: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  endPoint: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  waypoints: [
    {
      order: Number,
      latitude: Number,
      longitude: Number,
      address: String,
      shipmentId: mongoose.Schema.Types.ObjectId
    }
  ],
  status: {
    type: String,
    enum: ['Planificada', 'En Ruta', 'Completada', 'Cancelada'],
    default: 'Planificada'
  },
  startTime: Date,
  endTime: Date,
  plannedDistance: Number,
  actualDistance: Number,
  plannedDuration: Number,
  actualDuration: Number,
  totalDeliveries: Number,
  completedDeliveries: Number,
  failedDeliveries: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', routeSchema);
