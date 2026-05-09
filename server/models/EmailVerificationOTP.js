const mongoose = require('mongoose');
const crypto = require('crypto');

const emailVerificationOTPSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired OTPs via MongoDB TTL
emailVerificationOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash the OTP before comparing (never store plain OTP)
emailVerificationOTPSchema.statics.hashOTP = function (otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

module.exports = mongoose.model('EmailVerificationOTP', emailVerificationOTPSchema);
