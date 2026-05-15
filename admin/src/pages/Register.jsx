import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading, error, clearError } = useAuthStore();
  const showToast = useCartStore((s) => s.showToast);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const handleGoogleResponse = useCallback(async (response) => {
    setGoogleLoading(true);
    clearError();
    const result = await loginWithGoogle(response.credential);
    setGoogleLoading(false);
    if (result.success) {
      showToast('Account created!', 'success');
      navigate('/');
    }
  }, [loginWithGoogle, clearError, showToast, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const init = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard', theme: 'filled_black', size: 'large',
        text: 'continue_with', shape: 'rectangular',
        width: Math.min(googleBtnRef.current.offsetWidth || 384, 400),
      });
    };
    if (window.google?.accounts?.id) { init(); }
    else {
      const iv = setInterval(() => {
        if (window.google?.accounts?.id) { init(); clearInterval(iv); }
      }, 100);
      return () => clearInterval(iv);
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault(); clearError(); setLocalErr('');
    if (form.password !== form.confirm) { setLocalErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setLocalErr('Password must be at least 6 characters'); return; }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      if (result.requiresVerification) {
        // Navigate to email verification page
        const params = new URLSearchParams({ email: result.email });
        if (result.devOTP) params.set('devOTP', result.devOTP);
        showToast(result.message || 'Verification code sent!', 'success');
        navigate(`/verify-email?${params.toString()}`);
      } else {
        showToast('Account created!', 'success');
        navigate('/');
      }
    }
  };

  const displayError = localErr || error;
  const isLoading = loading || googleLoading;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-cyan/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-5 animate-pulse-glow">
            <Zap className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan opacity-30 blur-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Join Karma for instant game top-ups</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-red-400">{displayError}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" required id="reg-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" required id="reg-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pr-10" placeholder="Min 6 characters" required id="reg-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-purple transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input-field" placeholder="Repeat password" required id="reg-confirm" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2" id="reg-submit">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>
          {GOOGLE_CLIENT_ID && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>
              <div className="relative w-full group" style={{ height: '44px' }} id="register-google">
                <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] group-hover:bg-white/[0.07] text-white font-medium text-sm transition-all duration-200 group-hover:border-white/[0.2]">
                  {googleLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><GoogleIcon /> Continue with Google</>}
                </div>
                <div ref={googleBtnRef} className="absolute inset-0 z-10 overflow-hidden rounded-xl cursor-pointer" style={{ opacity: 0 }} />
              </div>
            </>
          )}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-neon-purple hover:text-neon-purple-light font-medium transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
