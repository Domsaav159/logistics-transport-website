const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario
router.patch('/:id', async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    res.json({
      mensaje: '✅ Usuario actualizado',
      usuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuarios por rol
router.get('/role/:role', async (req, res) => {
  try {
    const usuarios = await User.find({ role: req.params.role }).select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
