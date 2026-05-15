import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword as forgotPasswordApi } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [devOTP, setDevOTP] = useState('');

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setDevOTP('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      setMessage(res.data.message || 'If an account with this email exists, a reset link has been sent.');
      setOtpEmail(email);
      // If dev OTP is returned (email delivery failed in dev mode), show it
      if (res.data.devOTP) {
        setDevOTP(res.data.devOTP);
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || 'Unable to send reset link right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-purple/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-5 animate-pulse-glow">
            <Mail className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan opacity-30 blur-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset your password</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Enter your email to receive a secure reset link.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {message && <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">{message}</div>}
            {devOTP && (
              <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
                <p className="font-semibold mb-1">🔑 Dev Mode OTP:</p>
                <p className="text-2xl font-mono font-bold tracking-[0.3em] text-center text-amber-200">{devOTP}</p>
                <p className="text-xs text-amber-400/60 mt-1">Email delivery unavailable. Use this OTP to reset your password.</p>
              </div>
            )}
            {error && <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-red-400">{error}</div>}

            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Mail className="w-4 h-4" /> Send Reset Link</>}
            </button>

            {message && otpEmail && (
              <button
                type="button"
                onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(otpEmail)}`)}
                className="w-full mt-2 py-3 px-4 rounded-xl border border-neon-purple/30 bg-neon-purple/10 text-neon-purple-light font-semibold hover:bg-neon-purple/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue to Verify Code →
              </button>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="text-neon-purple hover:text-neon-purple-light font-medium transition-colors">Sign In</Link>
          </p>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="inline-flex items-center gap-2 text-neon-purple/80 hover:text-neon-purple transition-all duration-200">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
