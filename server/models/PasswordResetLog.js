const mongoose = require('mongoose');

const PasswordResetLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  ip: {
    type: String,
    default: 'unknown',
  },
  userFound: {
    type: Boolean,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PasswordResetLog', PasswordResetLogSchema);
