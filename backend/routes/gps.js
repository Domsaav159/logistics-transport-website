const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// Actualizar ubicación GPS en tiempo real
router.post('/update-location', async (req, res) => {
  try {
    const { vehicleId, latitude, longitude, address, speed, heading, accuracy } = req.body;

    const vehiculo = await Vehicle.findByIdAndUpdate(
      vehicleId,
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
      vehiculo: vehiculo.currentLocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ubicación actual de vehículo
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.vehicleId);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({
      vehicleId: vehiculo._id,
      licensePlate: vehiculo.licensePlate,
      currentLocation: vehiculo.currentLocation,
      status: vehiculo.status,
      driver: vehiculo.driver
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial de rastreo
router.get('/history/:vehicleId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const vehiculo = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    let historial = vehiculo.trackingHistory;

    if (startDate && endDate) {
      const inicio = new Date(startDate);
      const fin = new Date(endDate);
      historial = historial.filter(h => h.timestamp >= inicio && h.timestamp <= fin);
    }

    res.json({
      vehicleId: vehiculo._id,
      licensePlate: vehiculo.licensePlate,
      historial: historial.sort((a, b) => b.timestamp - a.timestamp)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los vehículos en mapa
router.get('/all/active-vehicles', async (req, res) => {
  try {
    const vehiculos = await Vehicle.find({ status: 'En Ruta' })
      .select('licensePlate currentLocation driver status');
    
    const vehiculosEnMapa = vehiculos.map(v => ({
      vehicleId: v._id,
      licensePlate: v.licensePlate,
      location: v.currentLocation,
      status: v.status
    }));

    res.json(vehiculosEnMapa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
