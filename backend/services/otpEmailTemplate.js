/**
 * Generate professional OTP email HTML
 */
const generateOTPEmailHTML = (otp, userName = 'User') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Karma</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .email-container {
      max-width: 500px;
      width: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .email-header h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .email-header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .email-body {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .greeting strong {
      color: #333;
    }
    .message {
      font-size: 14px;
      color: #666;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .otp-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #667eea;
      font-family: 'Monaco', 'Courier New', monospace;
      word-spacing: 10px;
      margin: 15px 0;
    }
    .otp-expiry {
      font-size: 12px;
      color: #999;
      margin-top: 12px;
    }
    .warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 13px;
      color: #856404;
      line-height: 1.6;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px 30px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
      line-height: 1.6;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #eee;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🔐 Reset Your Password</h1>
      <p>Secure verification code inside</p>
    </div>
    
    <div class="email-body">
      <div class="greeting">
        Hi <strong>${userName}</strong>,
      </div>
      
      <div class="message">
        We received a request to reset the password for your Karma account. Use the code below to proceed with the password reset process.
      </div>
      
      <div class="otp-section">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otp.split('').join(' ')}</div>
        <div class="otp-expiry">⏱️ This code expires in 10 minutes</div>
      </div>
      
      <div class="warning">
        ⚠️ <strong>Never share this code</strong> with anyone. Karma support staff will never ask for it.
      </div>
      
      <div class="message">
        If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
      </div>
      
      <div class="divider"></div>
      
      <div style="font-size: 12px; color: #999; text-align: center;">
        <p>Questions? <a href="https://karma.example.com/help" style="color: #667eea; text-decoration: none;">Visit our help center</a></p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Karma</strong> | Secure Account Recovery</p>
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>&copy; 2026 Karma. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const generateOTPEmailText = (otp, userName = 'User') => `
Hello ${userName},

We received a request to reset the password for your Karma account. 

Your verification code is: ${otp}

This code expires in 10 minutes.

IMPORTANT: Never share this code with anyone. Karma support staff will never ask for it.

If you didn't request a password reset, you can safely ignore this email. Your account remains secure.

---
Karma | Secure Account Recovery
This is an automated message. Please do not reply to this email.
© 2026 Karma. All rights reserved.
`;

module.exports = {
  generateOTPEmailHTML,
  generateOTPEmailText,
};
