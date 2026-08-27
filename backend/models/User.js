const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  role: {
    type: String,
    enum: ['Admin', 'Gestor', 'Conductor', 'Almacenero', 'Cliente'],
    default: 'Cliente'
  },
  status: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Suspendido'],
    default: 'Activo'
  },
  profileImage: String,
  address: String,
  city: String,
  postalCode: String,
  companyName: String,
  taxId: String,
  permissions: [String],
  deviceTokens: [String],
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);
