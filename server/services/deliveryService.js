const Order = require('../models/Order');

/**
 * Delivery Service
 * Simulates instant delivery of digital products.
 * In production, this would integrate with game APIs (Garena, Tencent, Moonton).
 */

const triggerDelivery = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('product');

    if (!order) {
      throw new Error('Order not found');
    }

    console.log(`⚡ Delivering: ${order.package.label} for ${order.product.name}`);
    console.log(`   Game Info:`, Object.fromEntries(order.gameInfo));

    // Simulate delivery delay (< 60 seconds as per PRD)
    // In production, call the actual game top-up API here
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mark as delivered
    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();

    console.log(`✅ Delivered successfully! Order: ${orderId}`);

    return {
      success: true,
      deliveredAt: order.deliveredAt,
      message: `${order.package.label} delivered to player`,
    };
  } catch (error) {
    console.error(`❌ Delivery failed for order ${orderId}:`, error.message);

    // Mark as failed for manual support
    await Order.findByIdAndUpdate(orderId, { status: 'failed' });

    return {
      success: false,
      message: 'Delivery failed - manual support required',
    };
  }
};

module.exports = { triggerDelivery };
