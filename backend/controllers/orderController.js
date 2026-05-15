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
      quantity: rawQuantity,
      paymentMethod,
      transactionCode,
      screenshotName,
      screenshotDataUrl,
      selectedPackage: selectedPackageInput,
    } = req.body;

    const quantity = Math.max(1, parseInt(String(rawQuantity ?? 1), 10) || 1);

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

    const normalizeLabel = (label) =>
      String(label || '')
        .trim()
        .toLowerCase()
        .replace(/[\u2013\u2014\u2212]/g, '-')
        .replace(/\s+/g, ' ');

    const amountFromLabel = (label) => {
      const match = String(label || '').match(/(\d[\d,]*)/);
      return match ? toNumber(match[1]) : NaN;
    };

    const packageMatches = (pkg, input) => {
      if (!pkg || !input) return false;
      const wantedLabel = normalizeLabel(input.label);
      const wantedAmount = toNumber(input.amount);
      const wantedPrice = toNumber(input.price);
      const labelAmount = amountFromLabel(input.label);

      if (wantedLabel && normalizeLabel(pkg.label) === wantedLabel) return true;
      if (Number.isFinite(wantedAmount) && Number(pkg.amount) === wantedAmount) return true;
      if (Number.isFinite(labelAmount) && Number(pkg.amount) === labelAmount) return true;
      if (Number.isFinite(wantedPrice) && Number(pkg.price) === wantedPrice) return true;
      return false;
    };

    const findPackage = (input) => {
      if (!input || !product.packages?.length) return null;

      const wantedLabel = normalizeLabel(input.label);
      const wantedAmount = toNumber(input.amount);
      const wantedPrice = toNumber(input.price);
      const labelAmount = amountFromLabel(input.label);

      let match = product.packages.find(
        (p) => wantedLabel && normalizeLabel(p.label) === wantedLabel
      );
      if (match) return match;

      if (Number.isFinite(wantedAmount)) {
        match = product.packages.find((p) => Number(p.amount) === wantedAmount);
        if (match) return match;
      }

      if (Number.isFinite(labelAmount)) {
        match = product.packages.find((p) => Number(p.amount) === labelAmount);
        if (match) return match;
      }

      if (Number.isFinite(wantedPrice)) {
        match = product.packages.find((p) => Number(p.price) === wantedPrice);
        if (match) return match;
      }

      return null;
    };

    // Resolve package robustly (supports stale cart snapshots)
    const parsedIndex = Number.parseInt(String(packageIndex ?? ''), 10);
    let selectedPackage =
      Number.isInteger(parsedIndex) &&
      parsedIndex >= 0 &&
      parsedIndex < product.packages.length
        ? product.packages[parsedIndex]
        : null;

    if (selectedPackage && selectedPackageInput && !packageMatches(selectedPackage, selectedPackageInput)) {
      selectedPackage = null;
    }

    if (!selectedPackage && selectedPackageInput) {
      selectedPackage = findPackage(selectedPackageInput);
    }
    if (!selectedPackage) {
      return res.status(400).json({ success: false, message: 'Invalid package selected' });
    }

    // Validate game info
    for (const field of product.inputFields || []) {
      if (field.required && (!gameInfo || !gameInfo[field.name])) {
        return res.status(400).json({
          success: false,
          message: `${field.label} is required`,
        });
      }
    }

    const unitPrice = Number(selectedPackage.price);
    const totalPrice = unitPrice * quantity;
    if (!Number.isFinite(unitPrice) || !Number.isFinite(totalPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package price. Refresh the page and try again.',
      });
    }

    const safeGameInfo =
      gameInfo && typeof gameInfo === 'object' && !Array.isArray(gameInfo)
        ? Object.fromEntries(
            Object.entries(gameInfo).map(([k, v]) => [
              k,
              v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v),
            ])
          )
        : {};

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
      gameInfo: safeGameInfo,
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
    console.error('createOrder:', error);
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: msgs.length ? msgs.join(' ') : 'Invalid order data',
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate order reference. Please submit again.',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Could not create order',
    });
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
