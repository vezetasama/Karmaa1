/**
 * Ensures the admin account exists with known credentials.
 * Safe to run multiple times (idempotent).
 */
const User = require('../models/User');

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@karmastore.np').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Krm@2026!Host_Admin9x';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Karma Admin';

async function ensureAdmin() {
  let admin = await User.findOne({ role: 'admin' }).select('+password');

  if (admin) {
    admin.email = ADMIN_EMAIL;
    admin.name = ADMIN_NAME;
    admin.password = ADMIN_PASSWORD;
    admin.role = 'admin';
    admin.isVerified = true;
    admin.authProvider = 'local';
    await admin.save();
    console.log(`✅ Admin updated: ${ADMIN_EMAIL}`);
    return admin;
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
  if (existing) {
    existing.password = ADMIN_PASSWORD;
    existing.role = 'admin';
    existing.isVerified = true;
    existing.authProvider = 'local';
    existing.name = ADMIN_NAME;
    await existing.save();
    console.log(`✅ Existing user promoted to admin: ${ADMIN_EMAIL}`);
    return existing;
  }

  admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    isVerified: true,
    authProvider: 'local',
  });
  console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  return admin;
}

module.exports = ensureAdmin;
