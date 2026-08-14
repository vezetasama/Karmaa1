const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  label: { type: String, required: true },       // e.g. "100 Diamonds"
  amount: { type: Number, required: true },       // e.g. 100
  price: { type: Number, required: true },        // e.g. 120 (NPR)
  originalPrice: { type: Number },                // for showing discount
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['game-topup', 'gift-card'],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/images/default-product.png',
  },
  bannerColor: {
    type: String,
    default: '#6c5ce7',
  },
  packages: [packageSchema],
  inputFields: [{
    name: { type: String, required: true },       // e.g. "userId", "serverId"
    label: { type: String, required: true },       // e.g. "Player ID"
    placeholder: { type: String },                 // e.g. "Enter your Player ID"
    required: { type: Boolean, default: true },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
