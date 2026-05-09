import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, getMe, googleLogin as googleLoginApi, verifyEmail as verifyEmailApi, resendVerification as resendVerificationApi } from '../services/api';

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
          const message = err.response?.data?.message || 'Login failed';
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
          const message = err.response?.data?.message || 'Registration failed';
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
          const message = err.response?.data?.message || 'Google login failed';
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
