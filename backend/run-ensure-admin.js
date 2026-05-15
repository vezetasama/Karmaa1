require('dotenv').config();
const connectDB = require('./config/db');
const ensureAdmin = require('./scripts/ensure-admin');

(async () => {
  const ok = await connectDB();
  if (!ok) process.exit(1);
  await ensureAdmin();
  console.log('Password:', process.env.ADMIN_PASSWORD || 'Krm@2026!Host_Admin9x');
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
