const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logistics_db')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error conectando a MongoDB:', err));

// Importar rutas
const authRoutes = require('./routes/auth');
const shipmentsRoutes = require('./routes/shipments');
const vehiclesRoutes = require('./routes/vehicles');
const usersRoutes = require('./routes/users');
const scanRoutes = require('./routes/scan');
const routesRoutes = require('./routes/routes');
const gpsRoutes = require('./routes/gps');

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/gps', gpsRoutes);

// Socket.IO - Rastreo GPS en tiempo real
io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);

  // Recibir ubicación del vehículo
  socket.on('updateLocation', (data) => {
    io.emit('vehicleLocationUpdated', data);
  });

  // Actualizar estado del envío
  socket.on('shipmentStatusUpdate', (data) => {
    io.emit('shipmentUpdated', data);
  });

  // Escaneo de mercancía
  socket.on('scanPackage', (data) => {
    io.emit('packageScanned', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Sistema en funcionamiento' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = { app, io };
