import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Loader2, Copy, Check, Zap, CreditCard } from 'lucide-react';
import { getOrder } from '../services/api';
import { PageLoader } from '../components/Loader';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrder(id);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?._id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    pending: { icon: <Clock className="w-4 h-4" />, class: 'badge-pending', label: 'Pending', color: '#EAB308' },
    processing: { icon: <Loader2 className="w-4 h-4 animate-spin" />, class: 'badge-processing', label: 'Processing', color: '#3B82F6' },
    delivered: { icon: <CheckCircle className="w-4 h-4" />, class: 'badge-success', label: 'Delivered', color: '#22C55E' },
    failed: { icon: <XCircle className="w-4 h-4" />, class: 'badge-failed', label: 'Failed', color: '#EF4444' },
    cancelled: { icon: <XCircle className="w-4 h-4" />, class: 'badge-failed', label: 'Cancelled', color: '#EF4444' },
  };

  const paymentStatusConfig = {
    pending: { label: 'Pending', color: '#EAB308' },
    completed: { label: 'Completed', color: '#22C55E' },
    failed: { label: 'Failed', color: '#EF4444' },
    refunded: { label: 'Refunded', color: '#F97316' },
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-10">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This order doesn't exist or you don't have access to it.</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[order.status] || statusConfig.pending;
  const ps = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.pending;
  const bannerColor = order.product?.bannerColor || '#7C3AED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight" id="order-detail-title">Order Details</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-600 font-mono bg-dark-800/60 px-2.5 py-1 rounded-md border border-white/[0.04]">
              #{order._id}
            </span>
            <button
              onClick={copyOrderId}
              className="text-gray-600 hover:text-neon-cyan transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <span className={`${sc.class} inline-flex items-center gap-1.5 text-sm px-4 py-1.5`}>
          {sc.icon} {sc.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-[0.07]" style={{ background: bannerColor }} />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Product</h2>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: bannerColor, boxShadow: `0 0 25px ${bannerColor}30` }}
              >
                {order.product?.name?.charAt(0) || 'K'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{order.product?.name || 'Product'}</h3>
                <p className="text-neon-cyan text-sm font-medium">{order.package?.label}</p>
              </div>
            </div>

            {/* Game Info */}
            {order.gameInfo && Object.keys(order.gameInfo).length > 0 && (
              <div className="mt-5 pt-5 border-t border-white/[0.04]">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Game Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(order.gameInfo instanceof Map ? Object.fromEntries(order.gameInfo) : order.gameInfo).map(([key, value]) => (
                    <div key={key} className="bg-dark-900/50 rounded-lg px-4 py-3 border border-white/[0.04]">
                      <p className="text-[11px] text-gray-600 uppercase tracking-wider mb-0.5">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-3.5 h-3.5 text-neon-purple-light" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Order Placed</p>
                  <p className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {order.paymentStatus === 'completed' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Payment Completed</p>
                    <p className="text-xs text-gray-600">Payment was verified successfully</p>
                  </div>
                </div>
              )}
              {order.status === 'delivered' && order.deliveredAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Delivered</p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Package Price</span>
                <span className="text-white">Rs. {order.package?.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity</span>
                <span className="text-white">{order.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="neon-divider" />
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-extrabold text-gradient">Rs. {order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: ps.color, boxShadow: `0 0 8px ${ps.color}80` }} />
              <span className="text-sm font-medium text-white">{ps.label}</span>
            </div>
          </div>

          <Link to="/products" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            <Package className="w-4 h-4" /> Buy More Products
          </Link>
        </div>
      </div>
    </div>
  );
}
