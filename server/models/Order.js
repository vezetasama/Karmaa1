const mongoose = require('mongoose');

const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ts}-${rnd}`;
};

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  package: {
    label: String,
    amount: Number,
    price: Number,
  },
  gameInfo: {
    type: Map,
    of: String,       // e.g. { userId: "123456", serverId: "2001" }
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentProof: {
    method: String,
    transactionCode: String,
    screenshotName: String,
    screenshotDataUrl: String,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('validate', async function generateMissingOrderId(next) {
  if (this.orderId) return next();

  // Try a few times to avoid extremely rare collisions.
  for (let i = 0; i < 5; i += 1) {
    const candidate = generateOrderId();
    const exists = await this.constructor.exists({ orderId: candidate });
    if (!exists) {
      this.orderId = candidate;
      return next();
    }
  }

  return next(new Error('Failed to generate unique order ID'));
});

module.exports = mongoose.model('Order', orderSchema);
