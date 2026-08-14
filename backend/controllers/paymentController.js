const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { triggerDelivery } = require('../services/deliveryService');
const { generateTransactionId } = require('../services/paymentService');
const { getApiBaseUrl, getClientUrl } = require('../utils/appUrl');

// @desc    Initiate payment
// @route   POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;

    if (!orderId || !method) {
      return res.status(400).json({ success: false, message: 'Order ID and payment method are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
    }

    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      user: req.user.id,
      method,
      amount: order.totalPrice,
      status: 'initiated',
    });

    // In production, this would redirect to eSewa/Khalti
    // For MVP, we simulate the payment gateway response
    const paymentData = {
      paymentId: payment._id,
      amount: order.totalPrice,
      method,
      // Mock payment URL - in production, integrate real gateway
      paymentUrl: `${getApiBaseUrl()}/api/payments/simulate/${payment._id}`,
    };

    res.json({
      success: true,
      data: paymentData,
      message: 'Payment initiated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify/complete payment (simulate for MVP)
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Simulate payment verification
    // In production: verify with eSewa/Khalti API
    const transactionId = generateTransactionId();

    payment.status = 'completed';
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    // Update order payment status
    const order = await Order.findById(payment.order);
    order.paymentStatus = 'completed';
    order.status = 'processing';
    await order.save();

    // Trigger delivery
    const deliveryResult = await triggerDelivery(order._id);

    const updatedOrder = await Order.findById(order._id).populate('product', 'name slug image');

    res.json({
      success: true,
      data: {
        payment: {
          id: payment._id,
          transactionId,
          status: payment.status,
          method: payment.method,
        },
        order: updatedOrder,
        delivery: deliveryResult,
      },
      message: 'Payment verified and delivery initiated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate payment success (dev only)
// @route   GET /api/payments/simulate/:id
exports.simulatePayment = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Auto-verify the payment
    const transactionId = generateTransactionId();
    payment.status = 'completed';
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.order);
    order.paymentStatus = 'completed';
    order.status = 'processing';
    await order.save();

    // Trigger delivery
    await triggerDelivery(order._id);

    // Redirect back to frontend
    res.redirect(`${getClientUrl()}/dashboard?payment=success`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
