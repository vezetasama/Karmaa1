const User = require('../models/User');
const PasswordResetOTP = require('../models/PasswordResetOTP');
const PasswordResetLog = require('../models/PasswordResetLog');
const EmailVerificationOTP = require('../models/EmailVerificationOTP');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');
const { generateOTPEmailHTML, generateOTPEmailText } = require('../services/otpEmailTemplate');
const { generateVerificationEmailHTML, generateVerificationEmailText } = require('../services/verificationEmailTemplate');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('⚠️  GOOGLE_CLIENT_ID is not set! Google login will not work.');
} else {
  console.log('🔑 Google OAuth Client ID loaded:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
}

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper: Hash OTP before storing (never store plain text)
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// @desc    Register user (creates unverified account + sends OTP)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If the user exists but is not verified, allow re-registration
      if (!existingUser.isVerified && existingUser.authProvider === 'local') {
        // Update the existing unverified user's info
        existingUser.name = name;
        existingUser.password = password;
        existingUser.isVerified = true; // Temporarily auto-verify
        await existingUser.save();

        const token = existingUser.getSignedToken();
        return res.status(200).json({
          success: true,
          requiresVerification: false,
          data: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            profileImage: existingUser.profileImage,
            token,
          },
          message: 'Registration successful',
        });
      }

      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new user and temporarily auto-verify
    const user = await User.create({ name, email, password, authProvider: 'local', isVerified: true });

    const token = user.getSignedToken();

    res.status(201).json({
      success: true,
      requiresVerification: false,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    // Find OTP record (compare hashed)
    const otpHash = hashOTP(otp);
    const otpRecord = await EmailVerificationOTP.findOne({
      user: user._id,
      otpHash,
    });

    if (!otpRecord) {
      // Increment attempts on the latest OTP record to track brute force
      const latestOtp = await EmailVerificationOTP.findOne({ user: user._id });
      if (latestOtp) {
        latestOtp.attempts += 1;
        await latestOtp.save();
        if (latestOtp.attempts >= 5) {
          await EmailVerificationOTP.deleteMany({ user: user._id });
          return res.status(429).json({
            success: false,
            message: 'Too many invalid attempts. Please request a new verification code.',
          });
        }
      }
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    // Delete used OTP
    await EmailVerificationOTP.deleteMany({ user: user._id });

    // Generate JWT and log user in
    const token = user.getSignedToken();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
      message: 'Email verified successfully! Welcome to Karma.',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Unable to verify email.' });
  }
};

// @desc    Resend verification email OTP
// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res) => {
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    // Rate limiting: max 5 resend requests per hour
    const now = Date.now();
    if (user.emailVerifyRequestExpire && user.emailVerifyRequestExpire > now) {
      if (user.emailVerifyRequestCount >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Too many verification requests. Please try again later.',
        });
      }
      user.emailVerifyRequestCount += 1;
    } else {
      user.emailVerifyRequestCount = 1;
      user.emailVerifyRequestExpire = now + 60 * 60 * 1000; // 1 hour
    }
    await user.save({ validateBeforeSave: false });

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(now + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs
    await EmailVerificationOTP.deleteMany({ user: user._id });

    // Store hashed OTP
    await EmailVerificationOTP.create({
      user: user._id,
      email: normalizedEmail,
      otpHash: hashOTP(otp),
      expiresAt: otpExpiry,
    });

    // Send email
    let emailSent = false;
    try {
      const html = generateVerificationEmailHTML(otp, user.name);
      const text = generateVerificationEmailText(otp, user.name);
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Account - Karma',
        text,
        html,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Resend verification email failed:', emailError.message);
      if (!isDev) {
        return res.status(500).json({
          success: false,
          message: 'Unable to send verification email. Please try again later.',
        });
      }
      console.log('⚠️  Dev mode: Email failed, returning OTP in response');
    }

    if (isDev) console.log('Resend verification OTP for:', normalizedEmail, 'OTP:', otp);

    const responseData = {
      success: true,
      message: emailSent
        ? 'Verification code has been resent to your email.'
        : 'Verification code generated (email delivery unavailable in dev mode).',
    };

    if (isDev && !emailSent) {
      responseData.devOTP = otp;
    }

    res.json(responseData);
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: 'Unable to resend verification code.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // If user signed up with Google, they don't have a password
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google Sign-In. Please use "Continue with Google" instead.',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'No password set for this account. Use Google Sign-In or reset your password.',
      });
    }

    let isMatch = false;
    try {
      isMatch = await user.matchPassword(password);
    } catch (compareErr) {
      console.error('Password compare error:', compareErr.message);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified && user.role !== 'admin') {
      // TEMPORARILY AUTO-VERIFY users on login if they aren't verified yet
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing');
      return res.status(500).json({ success: false, message: 'Server auth is not configured (JWT_SECRET).' });
    }

    const token = user.getSignedToken();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    console.log('Google login attempt, credential length:', credential?.length || 0);

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        success: false,
        message: 'Google Sign-In is not configured on the server. Set GOOGLE_CLIENT_ID in backend/.env.',
      });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Unable to get email from Google account' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update Google-specific fields if they weren't set before
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profileImage && picture) {
        user.profileImage = picture;
      }
      if (user.authProvider === 'local') {
        // User originally signed up with email/password but is now also linking Google
        user.authProvider = 'google';
      }
      // Google users are automatically verified
      if (!user.isVerified) {
        user.isVerified = true;
      }
      await user.save();
    } else {
      // Create new user (Google users are auto-verified)
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture || null,
        authProvider: 'google',
        isVerified: true,
      });
    }

    const token = user.getSignedToken();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
      message: 'Google login successful',
    });
  } catch (error) {
    console.error('Google auth error:', error?.message || error);
    if (error?.message?.includes('Token used too late')) {
      return res.status(401).json({ success: false, message: 'Google token expired. Please try again.' });
    }
    if (error?.message?.includes('Wrong number of segments')) {
      return res.status(401).json({ success: false, message: 'Invalid Google credential format.' });
    }
    res.status(401).json({ success: false, message: `Google login failed: ${error?.message || 'Invalid token'}` });
  }
};

// @desc    Send password reset OTP email
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',').shift().trim() || req.ip || 'unknown';
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
      if (isDev) console.log('Invalid email format:', email);
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Query database for user
    const user = await User.findOne({ email: normalizedEmail });

    // ===== IF USER DOES NOT EXIST =====
    if (!user) {
      if (isDev) console.log('Reset requested for non-existing email:', normalizedEmail);
      
      await PasswordResetLog.create({
        email: normalizedEmail,
        ip,
        userFound: false,
        blocked: false,
        message: 'Password reset requested for non-existent user',
      });

      // Return specific error (reveal email doesn't exist)
      return res.status(404).json({
        success: false,
        message: 'Email not registered. Please sign up to create an account.',
      });
    }

    // ===== USER EXISTS - CHECK RATE LIMITING =====
    const now = Date.now();
    if (user.resetPasswordRequestExpire && user.resetPasswordRequestExpire > now) {
      if (user.resetPasswordRequestCount >= 3) {
        if (isDev) console.log('Rate limit exceeded for email:', normalizedEmail);
        
        await PasswordResetLog.create({
          email: normalizedEmail,
          ip,
          user: user._id,
          userFound: true,
          blocked: true,
          message: 'Password reset rate limited (3/hour exceeded)',
        });

        return res.status(429).json({
          success: false,
          message: 'Too many reset requests. Please try again in an hour.',
        });
      }
      user.resetPasswordRequestCount += 1;
    } else {
      user.resetPasswordRequestCount = 1;
      user.resetPasswordRequestExpire = now + 60 * 60 * 1000; // 1 hour
    }

    await user.save({ validateBeforeSave: false });

    // ===== GENERATE AND SAVE OTP =====
    const otp = generateOTP();
    const otpExpiry = new Date(now + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this user
    await PasswordResetOTP.deleteMany({ user: user._id });

    // Create new OTP record
    await PasswordResetOTP.create({
      user: user._id,
      email: normalizedEmail,
      otp,
      expiresAt: otpExpiry,
    });

    // ===== SEND EMAIL WITH OTP =====
    const html = generateOTPEmailHTML(otp, user.name);
    const text = generateOTPEmailText(otp, user.name);

    let emailSent = false;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Code - Karma',
        text,
        html,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Email send failed:', emailError.message);
      if (!isDev) {
        // In production, email must succeed
        return res.status(500).json({
          success: false,
          message: 'Unable to send reset email. Please try again later.',
        });
      }
      // In dev mode, continue without email — OTP will be returned in response
      console.log('⚠️  Dev mode: Email failed, returning OTP in response');
    }

    if (isDev) console.log('Reset OTP for:', normalizedEmail, 'OTP:', otp);

    // Log successful OTP generation
    await PasswordResetLog.create({
      email: normalizedEmail,
      ip,
      user: user._id,
      userFound: true,
      blocked: false,
      message: emailSent ? 'Password reset OTP sent successfully' : 'OTP generated (email failed, dev mode)',
    });

    const responseData = {
      success: true,
      message: emailSent
        ? 'OTP sent to your registered email. Check your inbox.'
        : 'OTP generated (email delivery unavailable in dev mode).',
    };

    // In dev mode, include OTP in response if email failed
    if (isDev && !emailSent) {
      responseData.devOTP = otp;
    }

    res.json(responseData);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process reset request. Please try again later.',
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Find OTP record
    const otpRecord = await PasswordResetOTP.findOne({
      user: user._id,
      otp,
      verified: false,
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Request a new one.' });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Unable to verify OTP.' });
  }
};

// @desc    Reset user password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Find verified OTP
    const otpRecord = await PasswordResetOTP.findOne({
      user: user._id,
      otp,
      verified: true,
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or unverified OTP.' });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    // Update password
    user.password = password;
    user.resetPasswordRequestCount = 0;
    user.resetPasswordRequestExpire = undefined;
    await user.save();

    // Delete used OTP
    await PasswordResetOTP.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Unable to reset password. Please try again later.' });
  }
};
