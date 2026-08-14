import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  User, 
  LogOut, 
  RefreshCw, 
  Eye, 
  Copy, 
  Lock, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { getMyOrders, getGuestOrders } from '../services/api';
import { getGuestOrderIds } from '../utils/guestOrders';
import { PageLoader } from '../components/Loader';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const showToast = useCartStore((s) => s.showToast);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal code reveal states
  const [selectedCodeOrder, setSelectedCodeOrder] = useState(null);
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [revealingCode, setRevealingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
      if (user) {
        const res = await getMyOrders();
        setOrders(res.data.data || []);
      } else {
        const guestIds = getGuestOrderIds();
        if (guestIds.length > 0) {
          const res = await getGuestOrders(guestIds);
          setOrders(res.data.data || []);
        } else {
          setOrders([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = () => {
    setRevealingCode(true);
    setTimeout(() => {
      setRevealingCode(false);
      setCodeRevealed(true);
    }, 850);
  };

  const handleCopy = () => {
    const code = selectedCodeOrder?.giftCardCode || 'CODE-PENDING-CHECKBACK';
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard successfully!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const statusConfig = {
    pending: { icon: <Clock className="w-3.5 h-3.5" />, class: 'badge-pending', label: 'Pending' },
    processing: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, class: 'badge-processing', label: 'Processing' },
    completed: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: 'badge-success', label: 'Completed' },
    delivered: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: 'badge-success', label: 'Completed' },
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
                <span className="text-xl font-bold text-white">
                  {user ? user.name?.charAt(0).toUpperCase() : 'G'}
                </span>
              </div>
              <h2 className="font-bold text-white">{user ? user.name : 'Guest Customer'}</h2>
              <p className="text-sm text-gray-500">{user ? user.email : 'Guest Session'}</p>
              <div className="neon-divider mt-4" />
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-neon-purple-light rounded-lg bg-neon-purple/5 border border-neon-purple/10">
                      <User className="w-4 h-4" /> Profile
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-2">
                    <User className="w-3.5 h-3.5" /> Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight" id="dashboard-title">My Orders</h1>
              <p className="text-gray-500 text-xs mt-1">Track and manage your digital purchases</p>
            </div>
            <button onClick={fetchOrders} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-400 rounded-full border border-white/[0.06] hover:border-white/[0.12] hover:text-white hover:bg-white/[0.04] transition-all duration-300">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="neon-divider mb-6" />

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
                const isGiftCard = order.product?.category === 'gift-card' || order.giftCardCode;
                
                return (
                  <div key={order._id} className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-5 hover:border-white/[0.1] transition-all duration-300" id={`order-${order._id}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: order.product?.bannerColor || '#7C3AED', boxShadow: `0 0 20px ${order.product?.bannerColor || '#7C3AED'}25` }}>
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
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:text-right">
                        {isGiftCard && (
                          <button
                            onClick={() => {
                              setSelectedCodeOrder(order);
                              setCodeRevealed(false);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-neon-purple/30 text-neon-purple hover:bg-neon-purple hover:text-white shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 active:scale-95 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        )}

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

      {/* Code Reveal Frosted Glass Modal */}
      <AnimatePresence>
        {selectedCodeOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-xl overflow-hidden"
          >
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-neon-purple/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-neon-cyan/[0.04] rounded-full blur-[100px] pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-dark-900/90 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Section */}
              <div className="flex flex-col items-center text-center mb-6">
                {(selectedCodeOrder.status === 'completed' || selectedCodeOrder.status === 'delivered') ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Order Completed Successfully
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Your secure code is ready for retrieval
                    </p>
                  </>
                ) : selectedCodeOrder.status === 'processing' ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.15)] animate-pulse">
                      <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Processing Digital Release
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Our system is generating your secure code
                    </p>
                  </>
                ) : selectedCodeOrder.status === 'failed' || selectedCodeOrder.status === 'cancelled' ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Order Delivery Failed
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      There was a problem verifying your payment screenshot
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-pulse">
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Order Verification Pending
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      We are currently validating your payment receipt
                    </p>
                  </>
                )}
              </div>

              {/* Product Preview Card */}
              <div className="rounded-2xl border border-white/[0.05] bg-dark-800/40 p-4 flex gap-4 items-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/[0.03] rounded-full blur-2xl pointer-events-none" />
                
                {/* Gift card image preview */}
                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-lg border border-white/[0.06] shrink-0">
                  <img 
                    src={selectedCodeOrder.product?.image || '/images/gift-steam.png'} 
                    alt={selectedCodeOrder.product?.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-extrabold text-white text-base truncate">
                    {selectedCodeOrder.product?.name} Gift Card
                  </h4>
                  <p className="text-xs text-neon-cyan font-semibold mt-1">
                    {selectedCodeOrder.package?.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    Ref: {formatOrderId(selectedCodeOrder)}
                  </p>
                </div>
              </div>

              {/* Code Reveal Box */}
              <div className="rounded-2xl border border-white/[0.05] bg-dark-950 p-5 mb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-10" />
                <div className="relative z-10 flex flex-col items-center w-full">
                  <span className="text-[9px] uppercase font-bold text-gray-600 tracking-wider mb-2 block">
                    {selectedCodeOrder.product?.slug === 'netflix' ? 'Netflix Account Credentials' : 'Secured Digital Code'}
                  </span>
                  
                  <div className="w-full min-h-[50px] flex items-center justify-center mb-4">
                    {(selectedCodeOrder.status !== 'completed' && selectedCodeOrder.status !== 'delivered') ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <div className="flex items-center gap-1 text-xs text-yellow-400/90 font-bold uppercase tracking-wider bg-yellow-500/5 px-3 py-1 rounded-lg border border-yellow-500/10 animate-pulse">
                          <Lock className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> Decryption Locked
                        </div>
                        <p className="text-[10px] text-gray-500 max-w-[280px] mt-1 leading-relaxed">
                          Your account details are currently encrypted. Once our team approves your payment proof, they will release here.
                        </p>
                      </div>
                    ) : revealingCode ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-neon-purple" />
                        <span className="font-mono text-xs text-neon-purple-light uppercase tracking-widest px-4 py-1.5 rounded bg-neon-purple/5 border border-neon-purple/10">
                          Decrypting...
                        </span>
                      </div>
                    ) : codeRevealed ? (
                      selectedCodeOrder.product?.slug === 'netflix' ? (
                        <div className="w-full space-y-3 text-left">
                          {(() => {
                            const raw = selectedCodeOrder.giftCardCode || '';
                            const parts = raw.split('|');
                            const email = parts[0]?.trim() || 'Awaiting Account Email';
                            const pass = parts[1]?.trim() || 'Awaiting Password';
                            return (
                              <>
                                <div className="rounded-xl border border-white/[0.05] bg-dark-900/60 p-3 flex items-center justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wide">Netflix Email / ID</span>
                                    <span className="text-white font-mono text-sm break-all font-semibold select-all">{email}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(email);
                                      showToast('Email copied to clipboard!', 'success');
                                    }}
                                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white rounded-lg border border-white/[0.06] transition-all shrink-0"
                                    title="Copy Email"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="rounded-xl border border-white/[0.05] bg-dark-900/60 p-3 flex items-center justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wide">Password</span>
                                    <span className="text-white font-mono text-sm break-all font-semibold select-all">{pass}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(pass);
                                      showToast('Password copied to clipboard!', 'success');
                                    }}
                                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white rounded-lg border border-white/[0.06] transition-all shrink-0"
                                    title="Copy Password"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="font-mono text-lg sm:text-xl font-black text-white bg-dark-900/60 border border-white/[0.04] px-5 py-2.5 rounded-xl tracking-wider shadow-inner select-all"
                        >
                          {selectedCodeOrder.giftCardCode || 'CODE-PENDING-CHECKBACK'}
                        </motion.div>
                      )
                    ) : (
                      <div className="font-mono text-lg sm:text-xl font-bold text-gray-700 tracking-widest bg-dark-900/40 px-5 py-2.5 rounded-xl border border-dashed border-white/[0.04] select-none">
                        •••• - •••• - ••••
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {(selectedCodeOrder.status === 'completed' || selectedCodeOrder.status === 'delivered') && (
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                      {!codeRevealed ? (
                        <button
                          onClick={handleReveal}
                          className="btn-primary flex items-center gap-1.5 !px-5 !py-2.5 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> {selectedCodeOrder.product?.slug === 'netflix' ? 'Reveal Credentials' : 'Reveal Code'}
                        </button>
                      ) : (
                        <button
                          onClick={handleCopy}
                          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                            copied 
                              ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                              : 'btn-secondary flex items-center gap-1.5 !px-5 !py-2.5 text-xs'
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> {selectedCodeOrder.product?.slug === 'netflix' ? 'Copy Credentials' : 'Copy Code'}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {(selectedCodeOrder.status !== 'completed' && selectedCodeOrder.status !== 'delivered') && (
                    <button
                      disabled
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/[0.02] border border-white/[0.04] text-gray-600 cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-600" /> Awaiting Decryption
                    </button>
                  )}
                </div>
              </div>

              {/* Security Footer Details */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-5 text-[10px] text-gray-500 font-semibold mb-6">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  ENCRYPTED TRANSMISSION
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-neon-cyan shrink-0" />
                  PRIVATE & SECURE
                </span>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedCodeOrder(null)}
                className="w-full py-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.04] text-xs font-bold text-gray-400 hover:text-white transition-all duration-300 active:scale-95"
              >
                Close Window
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
