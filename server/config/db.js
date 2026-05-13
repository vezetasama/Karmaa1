const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${i}/${retries} failed: ${error.message}`);
      if (i === retries) {
        console.error('❌ All MongoDB connection attempts failed. Server will continue without DB.');
        return;
      }
      const delay = Math.min(5000 * i, 15000);
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
