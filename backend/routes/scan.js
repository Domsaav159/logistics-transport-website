const express = require('express');
const Scan = require('../models/Scan');
const Shipment = require('../models/Shipment');
const router = express.Router();
const QRCode = require('qrcode');

// Generar código QR
router.post('/generate-qr', async (req, res) => {
  try {
    const { data } = req.body;
    const qrCode = await QRCode.toDataURL(data);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Escanear paquete
router.post('/scan', async (req, res) => {
  try {
    const { barcode, shipmentId, scanType, location, scannedBy, photoEvidence, notes } = req.body;

    // Crear registro de escaneo
    const nuevoEscaneo = new Scan({
      barcode,
      shipmentId,
      scanType,
      location,
      scannedBy,
      photoEvidence,
      notes
    });

    await nuevoEscaneo.save();

    // Actualizar envío
    const envio = await Shipment.findById(shipmentId);
    if (envio) {
      const paquete = envio.packages.find(p => p.barcode === barcode);
      if (paquete) {
        paquete.scannedAt = new Date();
        paquete.scannedBy = scannedBy;
      }
      await envio.save();
    }

    res.status(201).json({
      mensaje: '✅ Escaneo registrado',
      escaneo: nuevoEscaneo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial de escaneos
router.get('/shipment/:shipmentId', async (req, res) => {
  try {
    const escaneos = await Scan.find({ shipmentId: req.params.shipmentId })
      .populate('scannedBy')
      .sort({ timestamp: -1 });
    res.json(escaneos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener escaneo por barcode
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const escaneo = await Scan.findOne({ barcode: req.params.barcode })
      .populate('scannedBy')
      .sort({ timestamp: -1 });
    
    if (!escaneo) {
      return res.status(404).json({ error: 'Escaneo no encontrado' });
    }

    res.json(escaneo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
