const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  simulatePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/simulate/:id', simulatePayment); // Dev only

module.exports = router;
