import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ClashRoyaleTopUp from './pages/ClashRoyaleTopUp';
import ClashOfClansTopUp from './pages/ClashOfClansTopUp';
import PubgMobileTopUp from './pages/PubgMobileTopUp';
import PubgLiteTopUp from './pages/PubgLiteTopUp';
import CallOfDutyMobileTopUp from './pages/CallOfDutyMobileTopUp';
import FreeFireTopUp from './pages/FreeFireTopUp';
import TikTokCoinTopUp from './pages/TikTokCoinTopUp';
import CapCutPremiumTopUp from './pages/CapCutPremiumTopUp';
import MinecraftTopUp from './pages/MinecraftTopUp';
import DiscordNitroTopUp from './pages/DiscordNitroTopUp';
import RobloxTopUp from './pages/RobloxTopUp';
import GiftCardTopUp from './pages/GiftCardTopUp';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutPayment from './pages/CheckoutPayment';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTPAndReset from './pages/VerifyOTPAndReset';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import OrderSuccess from './pages/OrderSuccess';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import { useAuthStore } from './store/authStore';

function RequireAuth() {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function RequireAdmin() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-900 relative overflow-x-hidden">
      {/* ── Animated Neon Gradient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary orb — electric blue, drifts top-left to center */}
        <div className="neon-orb neon-orb--blue" />
        {/* Secondary orb — neon purple, drifts center-right */}
        <div className="neon-orb neon-orb--purple" />
        {/* Tertiary orb — hot pink, drifts bottom-left */}
        <div className="neon-orb neon-orb--pink" />
        {/* Quaternary orb — cyan accent, subtle top-right fill */}
        <div className="neon-orb neon-orb--cyan" />
        {/* Noise grain overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
      </div>

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-30" />

      <Navbar />
      <ScrollToTop />
      <main className="flex-1 relative z-10 pb-[70px] md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/top-up/clashroayle" element={<ClashRoyaleTopUp />} />
          <Route path="/top-up/clash-of-clans" element={<ClashOfClansTopUp />} />
          <Route path="/top-up/pubg-mobile" element={<PubgMobileTopUp />} />
          <Route path="/top-up/pubg-lite" element={<PubgLiteTopUp />} />
          <Route path="/top-up/call-of-duty-mobile" element={<CallOfDutyMobileTopUp />} />
          <Route path="/top-up/free-fire" element={<FreeFireTopUp />} />
          <Route path="/top-up/tiktok-coin" element={<TikTokCoinTopUp />} />
          <Route path="/top-up/capcut-premium" element={<CapCutPremiumTopUp />} />
          <Route path="/top-up/minecraft" element={<MinecraftTopUp />} />
          <Route path="/top-up/discord-nitro" element={<DiscordNitroTopUp />} />
          <Route path="/top-up/roblox" element={<RobloxTopUp />} />
          <Route path="/gift-card/:slug" element={<GiftCardTopUp />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTPAndReset />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />

          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <Toast />
    </div>
  );
}
