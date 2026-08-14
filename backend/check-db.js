require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  const orders = await Order.find().populate('product', 'name');
  console.log('Orders in database:');
  orders.forEach(o => {
    console.log(`- ID: ${o.orderId || o._id}, Product: ${o.product?.name}, Status: ${o.status}, Code: "${o.giftCardCode}"`);
  });
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
