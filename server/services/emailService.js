const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT ? Number(SMTP_PORT) : undefined,
  secure: SMTP_PORT === '465',
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP not configured. Email not sent:', { to, subject, text });
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM || 'Karma Support <no-reply@karma.example.com>',
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
