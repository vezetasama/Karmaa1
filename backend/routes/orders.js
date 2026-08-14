const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getGuestOrders,
  getOrder,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.post('/guest', getGuestOrders);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
