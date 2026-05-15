const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    return false;
  }

  const useTLS = uri.startsWith('mongodb+srv') || process.env.MONGODB_TLS === 'true';
  const connectOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  };
  if (useTLS) {
    connectOptions.tls = true;
  }

  const retries = 5;
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(uri, connectOptions);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${i}/${retries} failed: ${error.message}`);
      if (error.message.includes('querySrv ECONNREFUSED') && uri.startsWith('mongodb+srv')) {
        console.error(
          '   Hint: On some Windows setups, mongodb+srv DNS fails. Use the standard mongodb://… connection string from Atlas (Connect → Drivers), or allow 0.0.0.0/0 in Atlas Network Access for cloud hosts like Render.'
        );
      }
      if (i === retries) {
        console.error('❌ All MongoDB connection attempts failed.');
        return false;
      }
      const delay = Math.min(5000 * i, 15000);
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  return false;
};

module.exports = connectDB;
