const express = require('express');
const Route = require('../models/Route');
const Shipment = require('../models/Shipment');
const router = express.Router();
const crypto = require('crypto');

// Crear ruta
router.post('/', async (req, res) => {
  try {
    const nuevaRuta = new Route({
      routeNumber: 'RUT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      ...req.body
    });

    await nuevaRuta.save();
    res.status(201).json({
      mensaje: '✅ Ruta creada',
      ruta: nuevaRuta
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las rutas
router.get('/', async (req, res) => {
  try {
    const rutas = await Route.find()
      .populate('vehicle')
      .populate('driver')
      .populate('shipments');
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ruta por ID
router.get('/:id', async (req, res) => {
  try {
    const ruta = await Route.findById(req.params.id)
      .populate('vehicle')
      .populate('driver')
      .populate('shipments');
    
    if (!ruta) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json(ruta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de la ruta
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const ruta = await Route.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('vehicle').populate('driver').populate('shipments');

    res.json({ mensaje: '✅ Estado actualizado', ruta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Asignar envíos a ruta
router.patch('/:id/assign-shipments', async (req, res) => {
  try {
    const { shipmentIds } = req.body;
    const ruta = await Route.findByIdAndUpdate(
      req.params.id,
      {
        shipments: shipmentIds,
        totalDeliveries: shipmentIds.length
      },
      { new: true }
    ).populate('shipments');

    res.json({ mensaje: '✅ Envíos asignados', ruta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
