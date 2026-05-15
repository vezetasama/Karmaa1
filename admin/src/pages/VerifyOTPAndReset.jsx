import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { verifyOTP as verifyOTPApi, resetPassword as resetPasswordApi } from '../services/api';

export default function VerifyOTPAndReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('otp'); // 'otp' or 'password'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTPApi({ email, otp });
      if (res.data.success) {
        setMessage('Code verified! Now enter your new password.');
        setTimeout(() => setStep('password'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({ email, otp, password, confirmPassword });
      if (res.data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <p className="text-red-400 mb-4">Email address is required. Please start from the reset page.</p>
          <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-purple/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-5 animate-pulse-glow">
            <Lock className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan opacity-30 blur-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {step === 'otp' ? 'Enter verification code' : 'Create new password'}
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            {step === 'otp' 
              ? `We sent a code to ${email}` 
              : 'Enter a secure password for your account'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-8">
          {step === 'otp' ? (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {message && <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">{message}</div>}
              {error && <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-red-400">{error}</div>}

              <div>
                <label htmlFor="verify-otp" className="block text-sm font-medium text-gray-400 mb-1.5">6-Digit Code</label>
                <input
                  id="verify-otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Enter the code from your email</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify Code</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {message && <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">{message}</div>}
              {error && <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-red-400">{error}</div>}

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field !pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-purple transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field !pr-10"
                    placeholder="Repeat new password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-purple transition-colors">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Reset Password</>}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/login" className="inline-flex items-center gap-2 text-neon-purple/80 hover:text-neon-purple transition-all duration-200">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
