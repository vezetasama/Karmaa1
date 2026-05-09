/**
 * Payment Service
 * Helper utilities for payment processing.
 * In production, integrate eSewa/Khalti SDKs here.
 */

// Generate unique transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KRM-${timestamp}-${random}`;
};

// eSewa payment config (production)
const esewaConfig = {
  merchantId: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
  successUrl: process.env.ESEWA_SUCCESS_URL || 'http://localhost:5000/api/payments/verify',
  failureUrl: process.env.ESEWA_FAILURE_URL || 'http://localhost:5173/payment-failed',
  esewaUrl: process.env.ESEWA_URL || 'https://uat.esewa.com.np/epay/main',
};

// Khalti payment config (production)
const khaltiConfig = {
  secretKey: process.env.KHALTI_SECRET_KEY || 'test_secret_key',
  publicKey: process.env.KHALTI_PUBLIC_KEY || 'test_public_key',
  verifyUrl: 'https://khalti.com/api/v2/payment/verify/',
};

module.exports = {
  generateTransactionId,
  esewaConfig,
  khaltiConfig,
};
