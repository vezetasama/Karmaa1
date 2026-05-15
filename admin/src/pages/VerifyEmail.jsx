import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const OTP_LENGTH = 6;
const COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const { verifyEmail, resendVerification, loading, error, clearError } = useAuthStore();
  const showToast = useCartStore((s) => s.showToast);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [localErr, setLocalErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [devOTP, setDevOTP] = useState(searchParams.get('devOTP') || '');
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    clearError();
    setLocalErr('');

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === OTP_LENGTH - 1) {
      const code = newOtp.join('');
      if (code.length === OTP_LENGTH) {
        handleVerify(code);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus the next empty or last input
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if full
    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(async (code) => {
    if (!code || code.length !== OTP_LENGTH) {
      setLocalErr('Please enter the complete verification code.');
      return;
    }

    clearError();
    setLocalErr('');

    const result = await verifyEmail(email, code);
    if (result.success) {
      setSuccess(true);
      showToast('Email verified successfully!', 'success');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [email, verifyEmail, clearError, showToast, navigate]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setResendMsg('');
    setDevOTP('');
    clearError();
    setLocalErr('');

    const result = await resendVerification(email);
    setResending(false);

    if (result.success) {
      setResendMsg(result.message);
      setCooldown(COOLDOWN_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();

      if (result.devOTP) {
        setDevOTP(result.devOTP);
      }
    } else {
      setLocalErr(result.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify(otp.join(''));
  };

  const displayError = localErr || error;
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  if (!email) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-cyan/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-5 animate-pulse-glow">
            {success ? (
              <CheckCircle2 className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            )}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan opacity-30 blur-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {success ? 'Email Verified!' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            {success
              ? 'Your account has been activated successfully.'
              : <>We sent a 6-digit code to <span className="text-gray-300 font-medium">{maskedEmail}</span></>
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-8">
          {/* Success State */}
          {success ? (
            <div className="text-center py-6">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Welcome to Karma!</h2>
              <p className="text-gray-400 text-sm mb-6">Redirecting you to the home page...</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full animate-[progress_2s_ease-in-out]" 
                  style={{ animation: 'progress 2s ease-in-out forwards' }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {displayError && (
                <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-red-400">
                  {displayError}
                </div>
              )}

              {/* Success / Resend Message */}
              {resendMsg && (
                <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">
                  {resendMsg}
                </div>
              )}

              {/* Dev OTP */}
              {devOTP && (
                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
                  <p className="font-semibold mb-1">🔑 Dev Mode OTP:</p>
                  <p className="text-2xl font-mono font-bold tracking-[0.3em] text-center text-amber-200">{devOTP}</p>
                  <p className="text-xs text-amber-400/60 mt-1">Email delivery unavailable. Use this code to verify.</p>
                </div>
              )}

              {/* OTP Input Grid */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`
                        w-12 h-14 text-center text-xl font-bold rounded-xl border
                        bg-dark-900/60 text-white outline-none transition-all duration-200
                        focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple
                        ${digit
                          ? 'border-neon-purple/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                          : 'border-white/[0.08] hover:border-white/[0.15]'
                        }
                      `}
                      id={`verify-otp-${index}`}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length !== OTP_LENGTH}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                id="verify-email-submit"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Verify Email
                  </>
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                {cooldown > 0 ? (
                  <p className="text-sm text-gray-400">
                    Resend available in{' '}
                    <span className="text-neon-cyan font-mono font-bold">
                      {Math.floor(cooldown / 60)}:{String(cooldown % 60).padStart(2, '0')}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="inline-flex items-center gap-1.5 text-sm text-neon-purple hover:text-neon-purple-light font-medium transition-colors disabled:opacity-50"
                    id="resend-verification"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
              </div>

              {/* Expiry notice */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  ⏱️ Code expires in 10 minutes
                </p>
              </div>
            </form>
          )}

          {/* Bottom Links */}
          {!success && (
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-gray-500">
                Wrong email?{' '}
                <Link
                  to="/register"
                  className="text-neon-purple hover:text-neon-purple-light font-medium transition-colors"
                >
                  Go back to Register
                </Link>
              </p>
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-purple/80 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar animation keyframes */}
      <style>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
