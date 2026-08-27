const express = require('express');
const Shipment = require('../models/Shipment');
const router = express.Router();
const crypto = require('crypto');

// Generar número de rastreo
const generarNumeroRastreo = () => {
  return 'LOG-' + crypto.randomBytes(6).toString('hex').toUpperCase();
};

// Crear envío
router.post('/', async (req, res) => {
  try {
    const nuevoEnvio = new Shipment({
      trackingNumber: generarNumeroRastreo(),
      ...req.body,
      history: [{
        status: 'Pendiente',
        timestamp: new Date(),
        notes: 'Envío creado'
      }]
    });

    await nuevoEnvio.save();
    res.status(201).json({
      mensaje: '✅ Envío creado exitosamente',
      envio: nuevoEnvio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los envíos
router.get('/', async (req, res) => {
  try {
    const envios = await Shipment.find()
      .populate('driver')
      .populate('vehicle')
      .populate('route');
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener envío por tracking number
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const envio = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
      .populate('driver')
      .populate('vehicle');
    
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }

    res.json(envio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado del envío
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, location, notes } = req.body;
    const envio = await Shipment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        currentLocation: location,
        $push: {
          history: {
            status,
            timestamp: new Date(),
            location: location?.address,
            notes
          }
        }
      },
      { new: true }
    );

    res.json({
      mensaje: '✅ Estado actualizado',
      envio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener envío por ID
router.get('/:id', async (req, res) => {
  try {
    const envio = await Shipment.findById(req.params.id)
      .populate('driver')
      .populate('vehicle')
      .populate('route');
    
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }

    res.json(envio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
