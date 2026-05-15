/**
 * Prepare database for production hosting:
 * - Clear orders, payments, notifications, OTP logs
 * - Reset admin account with a strong password
 * - Remove demo test user
 *
 * Run: cd server && node prepare-host.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const ensureAdmin = require('./scripts/ensure-admin');
const User = require('./models/User');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');
const EmailVerificationOTP = require('./models/EmailVerificationOTP');
const PasswordResetOTP = require('./models/PasswordResetOTP');
const PasswordResetLog = require('./models/PasswordResetLog');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@karmastore.np';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Krm@2026!Host_Admin9x';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Karma Admin';

const run = async () => {
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  const [orders, payments, notifications, verifyOtps, resetOtps, resetLogs] =
    await Promise.all([
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Notification.deleteMany({}),
      EmailVerificationOTP.deleteMany({}),
      PasswordResetOTP.deleteMany({}),
      PasswordResetLog.deleteMany({}),
    ]);

  await User.deleteOne({ email: 'user@karma.com' });

  const admin = await ensureAdmin();

  const credFile = path.join(__dirname, 'ADMIN_CREDENTIALS.local.txt');
  const credBody = [
    'Karma — Admin login (keep private, delete after saving elsewhere)',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Email:    ${ADMIN_EMAIL}`,
    `Password: ${ADMIN_PASSWORD}`,
    '',
    'Admin panel: /admin',
    'Change this password after first login if you store it in a password manager.',
    '',
  ].join('\n');
  fs.writeFileSync(credFile, credBody, 'utf8');

  console.log('\n✅ Host preparation complete');
  console.log(`   Orders removed:         ${orders.deletedCount}`);
  console.log(`   Payments removed:       ${payments.deletedCount}`);
  console.log(`   Notifications removed:  ${notifications.deletedCount}`);
  console.log(`   Email OTPs removed:     ${verifyOtps.deletedCount}`);
  console.log(`   Reset OTPs removed:     ${resetOtps.deletedCount}`);
  console.log(`   Reset logs removed:     ${resetLogs.deletedCount}`);
  console.log(`\n👤 Admin account: ${ADMIN_EMAIL}`);
  console.log(`🔑 Password saved to: ${credFile}`);
  console.log('   (This file is gitignored — copy credentials somewhere safe.)\n');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ prepare-host failed:', err.message);
  process.exit(1);
});
