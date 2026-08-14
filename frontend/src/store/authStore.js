import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, getMe, googleLogin as googleLoginApi, verifyEmail as verifyEmailApi, resendVerification as resendVerificationApi } from '../services/api';

/** Map axios/network errors to user-friendly auth messages (never show raw axios text). */
function getAuthErrorMessage(err, fallback) {
  const apiMessage = err.response?.data?.message;
  if (apiMessage && typeof apiMessage === 'string' && !apiMessage.startsWith('Request failed with status code')) {
    return apiMessage;
  }
  if (err.code === 'ERR_NETWORK' || !err.response) {
    return 'Cannot reach the server. Start the backend (cd backend && npm run dev) and use http://localhost:5173';
  }
  const status = err.response?.status;
  if (status === 503) {
    return apiMessage || 'Google Sign-In is not configured on the server.';
  }
  if (status >= 500) {
    return 'Server error — make sure the backend is running on port 5000 and try again.';
  }
  return fallback;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await loginUser({ email, password });
          const { token, ...user } = res.data.data;
          set({ user, token, loading: false });
          return { success: true };
        } catch (err) {
          const message = getAuthErrorMessage(err, 'Invalid email or password');
          const requiresVerification = err.response?.data?.requiresVerification || false;
          const verifyEmail = err.response?.data?.email || '';
          set({ loading: false, error: message });
          return { success: false, message, requiresVerification, email: verifyEmail };
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await registerUser({ name, email, password });
          // New flow: registration returns requiresVerification, NOT a token
          if (res.data.requiresVerification) {
            set({ loading: false });
            return {
              success: true,
              requiresVerification: true,
              email: res.data.email,
              message: res.data.message,
              devOTP: res.data.devOTP || null,
            };
          }
          // Fallback (shouldn't happen with new flow)
          const { token, ...user } = res.data.data;
          set({ user, token, loading: false });
          return { success: true };
        } catch (err) {
          const message = getAuthErrorMessage(err, 'Registration failed');
          set({ loading: false, error: message });
          return { success: false, message };
        }
      },

      verifyEmail: async (email, otp) => {
        set({ loading: true, error: null });
        try {
          const res = await verifyEmailApi({ email, otp });
          const { token, ...user } = res.data.data;
          set({ user, token, loading: false });
          return { success: true, message: res.data.message };
        } catch (err) {
          const message = err.response?.data?.message || 'Verification failed';
          set({ loading: false, error: message });
          return { success: false, message };
        }
      },

      resendVerification: async (email) => {
        try {
          const res = await resendVerificationApi({ email });
          return {
            success: true,
            message: res.data.message,
            devOTP: res.data.devOTP || null,
          };
        } catch (err) {
          const message = err.response?.data?.message || 'Failed to resend code';
          return { success: false, message };
        }
      },

      loginWithGoogle: async (credential) => {
        set({ loading: true, error: null });
        try {
          const res = await googleLoginApi({ credential });
          const { token, ...user } = res.data.data;
          set({ user, token, loading: false });
          return { success: true };
        } catch (err) {
          const message = getAuthErrorMessage(err, 'Google login failed');
          console.error('Google login error:', err.response?.data || err.message);
          set({ loading: false, error: message });
          return { success: false, message };
        }
      },

      fetchUser: async () => {
        if (!get().token) return;
        try {
          const res = await getMe();
          set({ user: res.data.data });
        } catch {
          get().logout();
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'karma-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
