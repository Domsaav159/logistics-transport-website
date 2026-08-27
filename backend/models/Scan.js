const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    index: true
  },
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  scanType: {
    type: String,
    enum: ['Entrada', 'Salida', 'Recepción', 'Entrega', 'Devolución'],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    warehouseId: String
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    deviceId: String,
    deviceType: String,
    userAgent: String
  },
  photoEvidence: String,
  signature: String,
  notes: String,
  status: {
    type: String,
    enum: ['Exitoso', 'Fallido', 'Revisión Pendiente'],
    default: 'Exitoso'
  }
});

module.exports = mongoose.model('Scan', scanSchema);
