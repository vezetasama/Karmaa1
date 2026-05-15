/**
 * Updates product packages in MongoDB to match seed.js without wiping users/orders.
 * Run: node sync-packages.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const packageUpdates = {
  'free-fire': [
    { label: '115 Diamonds', amount: 115, price: 95 },
    { label: '355 Diamonds', amount: 355, price: 285, originalPrice: 320 },
    { label: '610 Diamonds', amount: 610, price: 470, originalPrice: 530 },
    { label: '1090 Diamonds', amount: 1090, price: 930, originalPrice: 1040 },
    { label: '1720 Diamonds', amount: 1720, price: 1860, originalPrice: 2050 },
    { label: '2530 Diamonds', amount: 2530, price: 4680, originalPrice: 5100 },
    { label: 'Level Up Pass', amount: 1, price: 395, originalPrice: 450 },
    { label: 'Weekly', amount: 7, price: 185 },
    { label: 'Monthly', amount: 30, price: 900, originalPrice: 980 },
  ],
  'pubg-mobile': [
    { label: '60 UC', amount: 60, price: 150 },
    { label: '325 UC', amount: 325, price: 720, originalPrice: 700 },
    { label: '660 UC', amount: 660, price: 1480, originalPrice: 1380 },
    { label: '1800 UC', amount: 1800, price: 3590, originalPrice: 3650 },
    { label: '3850 UC', amount: 3850, price: 7180, originalPrice: 7600 },
    { label: '8100 UC', amount: 8100, price: 14300, originalPrice: 15200 },
  ],
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const [slug, packages] of Object.entries(packageUpdates)) {
    const result = await Product.findOneAndUpdate(
      { slug },
      { $set: { packages } },
      { new: true }
    );
    if (result) {
      console.log(`Updated ${slug} (${packages.length} packages)`);
    } else {
      console.warn(`Product not found: ${slug}`);
    }
  }
  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
