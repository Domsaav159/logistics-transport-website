const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// Crear vehículo
router.post('/', async (req, res) => {
  try {
    const nuevoVehiculo = new Vehicle(req.body);
    await nuevoVehiculo.save();
    res.status(201).json({
      mensaje: '✅ Vehículo registrado',
      vehiculo: nuevoVehiculo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const vehiculos = await Vehicle.find().populate('driver');
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener vehículo por ID
router.get('/:id', async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id).populate('driver');
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar ubicación del vehículo
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude, address, speed, heading, accuracy } = req.body;
    
    const vehiculo = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: {
          latitude,
          longitude,
          address,
          speed,
          heading,
          accuracy,
          timestamp: new Date()
        },
        $push: {
          trackingHistory: {
            latitude,
            longitude,
            speed,
            heading,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({
      mensaje: '✅ Ubicación actualizada',
      vehiculo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado del vehículo
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const vehiculo = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ mensaje: '✅ Estado actualizado', vehiculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
