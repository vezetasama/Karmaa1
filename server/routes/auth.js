const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  googleLogin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/verify-email',
  [
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('otp', 'Verification code is required').notEmpty().isLength({ min: 6, max: 6 }),
  ],
  verifyEmail
);

router.post(
  '/resend-verification',
  [body('email', 'Please provide a valid email').isEmail().normalizeEmail()],
  resendVerification
);

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', [body('email', 'Please provide a valid email').isEmail().normalizeEmail()], forgotPassword);
router.post('/verify-otp', [body('email', 'Email is required').isEmail().normalizeEmail(), body('otp', 'OTP is required').notEmpty()], verifyOTP);
router.post(
  '/reset-password',
  [
    body('email', 'Email is required').isEmail().normalizeEmail(),
    body('otp', 'OTP is required').notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    }),
  ],
  resetPassword
);
router.get('/me', protect, getMe);

module.exports = router;
