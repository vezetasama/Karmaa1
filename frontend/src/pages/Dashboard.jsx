import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Loader2, User, LogOut, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { getMyOrders } from '../services/api';
import { PageLoader } from '../components/Loader';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const showToast = useCartStore((s) => s.showToast);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      showToast('Payment successful! Check your orders below.', 'success');
      navigate('/dashboard', { replace: true, state: location.state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const statusConfig = {
    pending: { icon: <Clock className="w-3.5 h-3.5" />, class: 'badge-pending', label: 'Pending' },
    processing: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, class: 'badge-processing', label: 'Processing' },
    delivered: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: 'badge-success', label: 'Delivered' },
    failed: { icon: <XCircle className="w-3.5 h-3.5" />, class: 'badge-failed', label: 'Failed' },
    cancelled: { icon: <XCircle className="w-3.5 h-3.5" />, class: 'badge-failed', label: 'Cancelled' },
    refunded: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: 'badge-processing', label: 'Refunded' },
  };
  const formatOrderId = (order) => order.orderId || `ORD-${String(order._id || '').slice(-6).toUpperCase()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6 text-center relative overflow-hidden">
            {/* Ambient glow behind avatar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-neon-purple/[0.06] rounded-full blur-[60px] pointer-events-none" />

            <div className="relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-3 shadow-glow-purple">
                <span className="text-xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="neon-divider mt-4" />
              <div className="pt-4 space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-neon-purple-light rounded-lg bg-neon-purple/5 border border-neon-purple/10">
                  <User className="w-4 h-4" /> Profile
                </div>
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight" id="dashboard-title">My Orders</h1>
            <button onClick={fetchOrders} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-400 rounded-full border border-white/[0.06] hover:border-white/[0.12] hover:text-white hover:bg-white/[0.04] transition-all duration-300">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading ? <PageLoader /> : orders.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800/50 border border-white/[0.06] flex items-center justify-center mb-5">
                <Package className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No orders yet</h3>
              <p className="text-sm text-gray-500 mb-6">Your order history will appear here</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-sm">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                return (
                  <div key={order._id} className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-5 hover:border-white/[0.1] transition-all duration-300" id={`order-${order._id}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ background: order.product?.bannerColor || '#7C3AED', boxShadow: `0 0 20px ${order.product?.bannerColor || '#7C3AED'}25` }}>
                          {order.product?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{order.product?.name || 'Product'}</h3>
                          <p className="text-sm text-neon-cyan">{order.package?.label}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Order ID: {formatOrderId(order)}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <p className="font-bold text-white">Rs. {order.totalPrice?.toLocaleString()}</p>
                          <span className={`${sc.class} inline-flex items-center gap-1 mt-1`}>{sc.icon} {sc.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
