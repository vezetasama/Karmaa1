/**
 * Dark premium gaming-style verification email template
 * Matches Karma brand aesthetics: neon purple/cyan on dark backgrounds
 */
const generateVerificationEmailHTML = (otp, userName = 'Gamer') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account - Karma</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);box-shadow:0 0 60px rgba(139,92,246,0.08),0 0 120px rgba(6,182,212,0.04);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#06b6d4 100%);padding:40px 32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <!-- Logo Icon -->
                    <div style="width:56px;height:56px;border-radius:14px;background:rgba(255,255,255,0.2);display:inline-block;line-height:56px;font-size:28px;">⚡</div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">KARMA</h1>
                    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:2px;text-transform:uppercase;font-weight:500;">Account Verification</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#111118;padding:40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Greeting -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.6;">Hey <strong style="color:#e4e4e7;">${userName}</strong>,</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.6;">Welcome to Karma! Use the verification code below to activate your account and start your gaming journey.</p>
                  </td>
                </tr>

                <!-- OTP Section -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid rgba(139,92,246,0.25);background:linear-gradient(135deg,rgba(139,92,246,0.08) 0%,rgba(6,182,212,0.08) 100%);">
                      <tr>
                        <td style="padding:28px 24px;text-align:center;">
                          <p style="margin:0 0 14px;font-size:11px;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Your Verification Code</p>
                          <p style="margin:0;font-size:44px;font-weight:800;letter-spacing:12px;color:#ffffff;font-family:'Monaco','Courier New',monospace;text-shadow:0 0 30px rgba(139,92,246,0.5);">${otp.split('').join(' ')}</p>
                          <p style="margin:14px 0 0;font-size:12px;color:#71717a;">⏱️ This code expires in <strong style="color:#f59e0b;">10 minutes</strong></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Security Warning -->
                <tr>
                  <td style="padding-bottom:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;border:1px solid rgba(245,158,11,0.2);background:rgba(245,158,11,0.06);">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:13px;color:#d97706;line-height:1.5;">🔒 <strong>Security Notice:</strong> Never share this code with anyone. Karma staff will never ask for your verification code.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Info text -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">If you didn't create a Karma account, you can safely ignore this email.</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent);"></div>
                  </td>
                </tr>

                <!-- Help link -->
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:12px;color:#52525b;">Need help? Contact us at <a href="mailto:support@karma.example.com" style="color:#8b5cf6;text-decoration:none;">support@karma.example.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d0d14;padding:24px 32px;border-top:1px solid rgba(255,255,255,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px;font-size:13px;color:#52525b;font-weight:600;">⚡ KARMA</p>
                    <p style="margin:0 0 4px;font-size:11px;color:#3f3f46;">Instant Game Top-ups & Digital Products</p>
                    <p style="margin:0;font-size:11px;color:#3f3f46;">&copy; ${new Date().getFullYear()} Karma. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const generateVerificationEmailText = (otp, userName = 'Gamer') => `
Hello ${userName},

Welcome to Karma! Use the verification code below to activate your account.

Your Verification Code: ${otp}

This code expires in 10 minutes.

IMPORTANT: Never share this code with anyone. Karma staff will never ask for your verification code.

If you didn't create a Karma account, you can safely ignore this email.

---
⚡ KARMA | Instant Game Top-ups & Digital Products
© ${new Date().getFullYear()} Karma. All rights reserved.
`;

module.exports = {
  generateVerificationEmailHTML,
  generateVerificationEmailText,
};
