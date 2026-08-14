require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { getAllowedOrigins } = require('./utils/appUrl');

// Connect to database then start server
const startServer = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }

  try {
    const ensureAdmin = require('./scripts/ensure-admin');
    await ensureAdmin();
  } catch (adminErr) {
    console.error('⚠️  Could not ensure admin account:', adminErr.message);
  }

  const app = express();
  const server = http.createServer(app);

  app.set('trust proxy', 1);

  // Initialize Socket.IO
  initSocket(server);

  // Middleware
  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`CORS: allowing unknown dev origin: ${origin}`);
          return callback(null, true);
        }
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '8mb' }));

  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/payments', require('./routes/payments'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/notifications', require('./routes/notifications'));

  // Health check
  app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
    res.json({ success: true, message: 'Karma API is running', database: dbStatus });
  });

  // Serve React frontend in production
  if (process.env.NODE_ENV === 'production') {
    const clientBuild = path.join(__dirname, '../frontend/dist');
    app.use(express.static(clientBuild));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientBuild, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  }

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Server Error',
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Karma server running on port ${PORT}`);
    console.log(`🔌 Socket.IO ready for real-time notifications`);
  });
};

startServer();
