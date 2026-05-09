const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');
const { triggerDelivery } = require('../services/deliveryService');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      packageIndex,
      gameInfo,
      quantity = 1,
      paymentMethod,
      transactionCode,
      screenshotName,
      screenshotDataUrl,
      selectedPackage: selectedPackageInput,
    } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const toNumber = (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      const normalized = String(val).replace(/[^\d.-]/g, '');
      return Number(normalized);
    };

    // Resolve package robustly (supports stale cart snapshots)
    let selectedPackage = product.packages[packageIndex];
    if (!selectedPackage && selectedPackageInput) {
      const wantedLabel = String(selectedPackageInput.label || '').trim().toLowerCase();
      const wantedAmount = toNumber(selectedPackageInput.amount);
      const wantedPrice = toNumber(selectedPackageInput.price);

      selectedPackage = product.packages.find((p) => {
        const labelMatch =
          wantedLabel &&
          String(p.label || '').trim().toLowerCase() === wantedLabel;
        const amountMatch =
          Number.isFinite(wantedAmount) && Number(p.amount) === wantedAmount;
        const priceMatch =
          Number.isFinite(wantedPrice) && Number(p.price) === wantedPrice;

        return labelMatch || (amountMatch && priceMatch) || priceMatch;
      });
    }
    if (!selectedPackage) {
      return res.status(400).json({ success: false, message: 'Invalid package selected' });
    }

    // Validate game info
    for (const field of product.inputFields) {
      if (field.required && (!gameInfo || !gameInfo[field.name])) {
        return res.status(400).json({
          success: false,
          message: `${field.label} is required`,
        });
      }
    }

    const totalPrice = selectedPackage.price * quantity;
    const trimmedTransactionCode = String(transactionCode || '').trim();
    const trimmedScreenshotName = String(screenshotName || '').trim();
    const trimmedScreenshotDataUrl = String(screenshotDataUrl || '').trim();

    if (trimmedScreenshotDataUrl && trimmedScreenshotDataUrl.length > 2_000_000) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot is too large. Please upload a smaller image.',
      });
    }

    const order = await Order.create({
      user: req.user.id,
      product: productId,
      package: {
        label: selectedPackage.label,
        amount: selectedPackage.amount,
        price: selectedPackage.price,
      },
      gameInfo,
      quantity,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      paymentProof: {
        method: paymentMethod || 'manual',
        transactionCode: trimmedTransactionCode,
        screenshotName: trimmedScreenshotName,
        screenshotDataUrl: trimmedScreenshotDataUrl,
      },
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name slug image')
      .populate('user', 'name email');

    // ── Create admin notification ──
    try {
      const notification = await Notification.create({
        type: 'new_order',
        message: `New order: ${product.name} (${selectedPackage.label}) — Rs. ${totalPrice.toLocaleString()}`,
        orderId: order._id,
        userId: req.user.id,
        metadata: {
          productName: product.name,
          userName: req.user.name || 'Customer',
          amount: totalPrice,
        },
      });

      // Emit real-time notification to all admins
      const io = getIO();
      io.to('admins').emit('newOrder', {
        notification: notification.toObject(),
        order: populatedOrder.toObject(),
      });
    } catch (notifErr) {
      // Don't fail the order if notification fails
      console.error('Notification error:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: 'Order created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('product', 'name slug image bannerColor')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      message: `${orders.length} orders found`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name slug image')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'name slug image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      message: `${orders.length} orders found`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
