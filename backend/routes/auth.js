const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      name,
      email,
      password,
      phone,
      role: role || 'Cliente'
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, email: nuevoUsuario.email, role: nuevoUsuario.role },
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: '✅ Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esValido = await usuario.comparePassword(password);
    if (!esValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '7d' }
    );

    // Actualizar último login
    usuario.lastLogin = new Date();
    await usuario.save();

    res.json({
      mensaje: '✅ Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro');
    res.json({ válido: true, usuario: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
