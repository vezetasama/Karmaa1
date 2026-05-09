const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getUserCredentials,
} = require('../controllers/adminController');

// All routes require admin auth
router.use(protect, adminOnly);

// Stats / Analytics
router.get('/stats', getStats);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id/credentials', getUserCredentials);

module.exports = router;
