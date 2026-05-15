import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, RefreshCw, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { getAdminOrders, updateOrderStatus, clearAdminTransactionalData } from '../../services/api';
import { PageLoader } from '../../components/Loader';

const statusOptions = ['all', 'pending', 'processing', 'delivered', 'failed', 'cancelled', 'refunded'];
const statusColors = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  processing: { bg: 'bg-neon-cyan/10', text: 'text-neon-cyan', border: 'border-neon-cyan/30' },
  delivered: { bg: 'bg-neon-green/10', text: 'text-neon-green', border: 'border-neon-green/30' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
  refunded: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders({ status: filter, orderId: orderIdSearch, page, limit: 15 });
      setOrders(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter, orderIdSearch, page]);

  const applyOrderIdSearch = () => {
    setPage(1);
    setOrderIdSearch(orderIdInput.trim());
  };

  const clearOrderIdSearch = () => {
    setOrderIdInput('');
    setOrderIdSearch('');
    setPage(1);
  };

  const formatOrderId = (order) => order.orderId || `ORD-${String(order._id || '').slice(-6).toUpperCase()}`;
  const toInputEntries = (gameInfo) => {
    if (!gameInfo) return [];
    if (gameInfo instanceof Map) return Array.from(gameInfo.entries());
    return Object.entries(gameInfo);
  };
  const prettifyInputKey = (key = '') =>
    key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleClearAllOrders = async () => {
    const ok = window.confirm(
      'Delete ALL orders, payments, and admin notifications? This cannot be undone. Use before going live.'
    );
    if (!ok) return;
    setClearing(true);
    try {
      const res = await clearAdminTransactionalData();
      const d = res.data.data;
      alert(
        `Cleared: ${d.ordersRemoved} orders, ${d.paymentsRemoved} payments, ${d.notificationsRemoved} notifications.`
      );
      await fetchOrders();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to clear data');
    } finally {
      setClearing(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearAllOrders}
            disabled={clearing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-400/80 rounded-full border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 disabled:opacity-50 transition-all duration-300"
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Clear all data
          </button>
          <button onClick={fetchOrders} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-400 rounded-full border border-white/[0.06] hover:border-white/[0.12] hover:text-white hover:bg-white/[0.04] transition-all duration-300">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${filter === s ? 'bg-neon-purple text-white shadow-glow-sm' : 'bg-dark-800/50 text-gray-500 hover:text-white border border-white/[0.06]'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applyOrderIdSearch(); }}
            className="input-field !h-9 !py-1.5 !px-3 text-sm w-full sm:w-72"
            placeholder="Search by Order ID (e.g. ORD-...)"
          />
          <button onClick={applyOrderIdSearch} className="px-3.5 py-2 text-xs font-medium rounded-full border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 transition-all duration-300">
            Search
          </button>
          {orderIdSearch && (
            <button onClick={clearOrderIdSearch} className="px-3.5 py-2 text-xs font-medium rounded-full border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.16] transition-all duration-300">
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? <PageLoader /> : orders.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const sc = statusColors[o.status] || statusColors.pending;
                    return (
                      <tr key={o._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-xs font-semibold text-neon-cyan">{formatOrderId(o)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{o.user?.name || 'N/A'}</p>
                          <p className="text-[11px] text-gray-700">{o.user?.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: o.product?.bannerColor || '#7C3AED' }}>
                              {o.product?.name?.charAt(0)}
                            </div>
                            <span className="text-white">{o.product?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neon-cyan">{o.package?.label}</td>
                        <td className="py-3 px-4 font-bold text-white">Rs. {o.totalPrice?.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                            {o.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                            {o.status === 'pending' && <Clock className="w-3 h-3" />}
                            {o.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {o.status === 'failed' && <XCircle className="w-3 h-3" />}
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            disabled={updating === o._id}
                            className="bg-dark-900/60 border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-neon-purple/40 transition-colors"
                          >
                            {['pending', 'processing', 'delivered', 'failed', 'cancelled', 'refunded'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 text-xs font-medium text-neon-cyan hover:bg-neon-cyan/20 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">Showing {orders.length} of {pagination.total} orders</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg bg-dark-700/50 text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">Page {page} of {pagination.pages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="p-2 rounded-lg bg-dark-700/50 text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-dark-900/95 backdrop-blur-xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Order Details</p>
                <h3 className="text-lg font-bold text-white">{formatOrderId(selectedOrder)}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg border border-white/[0.1] text-gray-400 hover:text-white hover:border-white/[0.2] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-white/[0.06] bg-dark-800/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">User Inputs</p>
                {toInputEntries(selectedOrder.gameInfo).length > 0 ? (
                  <div className="space-y-2">
                    {toInputEntries(selectedOrder.gameInfo).map(([key, value]) => (
                      <p key={`${selectedOrder._id}-detail-${key}`} className="text-sm">
                        <span className="text-gray-500">{prettifyInputKey(key)}:</span>{' '}
                        <span className="text-white break-all">{String(value || '-')}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No user input found.</p>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-dark-800/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Payment Details</p>
                <p className="text-sm mb-2">
                  <span className="text-gray-500">Transaction Code:</span>{' '}
                  <span className="text-white break-all">{selectedOrder.paymentProof?.transactionCode || '-'}</span>
                </p>
                <p className="text-sm mb-3">
                  <span className="text-gray-500">Screenshot Name:</span>{' '}
                  <span className="text-white break-all">{selectedOrder.paymentProof?.screenshotName || '-'}</span>
                </p>
                {selectedOrder.paymentProof?.screenshotDataUrl ? (
                  <img
                    src={selectedOrder.paymentProof.screenshotDataUrl}
                    alt="Payment screenshot"
                    className="w-full rounded-lg border border-white/[0.08] object-contain max-h-[360px] bg-black/30"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No payment screenshot uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
