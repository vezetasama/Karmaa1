import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { getAdminStats } from '../../services/api';
import { PageLoader } from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;
  if (!stats) return <p className="text-gray-500">Failed to load stats.</p>;

  const statCards = [
    { label: "Today's Revenue", value: `Rs. ${stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingCart, color: '#22D3EE', bg: 'rgba(34,211,238,0.1)' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Month Revenue', value: `Rs. ${stats.monthRevenue.toLocaleString()}`, icon: DollarSign, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  ];

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...(stats.dailyRevenue?.map(d => d.revenue) || [1]), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-5 group hover:border-white/[0.1] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-extrabold text-white mt-1">{s.value}</p>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Revenue — Last 7 Days</h2>
          {stats.dailyRevenue?.length > 0 ? (
            <div className="space-y-3">
              {stats.dailyRevenue.map((d) => {
                const pct = (d.revenue / maxRevenue) * 100;
                const day = new Date(d._id + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                return (
                  <div key={d._id} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">{day}</span>
                      <span className="text-neon-cyan font-semibold">Rs. {d.revenue.toLocaleString()} <span className="text-gray-600">({d.orders} orders)</span></span>
                    </div>
                    <div className="h-3 bg-dark-900/60 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 group-hover:brightness-125" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7C3AED, #22D3EE)', boxShadow: '0 0 10px rgba(124,58,237,0.3)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No revenue data yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Products</h2>
          {stats.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/30 hover:bg-dark-900/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: p.bannerColor || '#7C3AED', boxShadow: `0 0 15px ${p.bannerColor || '#7C3AED'}30` }}>
                    {p.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.orderCount} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-neon-cyan">Rs. {p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No product data yet.</p>
          )}
        </div>
      </div>

      {/* Order Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status Breakdown */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Order Status</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'delivered', label: 'Delivered', color: '#22C55E' },
              { key: 'pending', label: 'Pending', color: '#FBBF24' },
              { key: 'processing', label: 'Processing', color: '#22D3EE' },
              { key: 'failed', label: 'Failed', color: '#EF4444' },
            ].map((s) => (
              <div key={s.key} className="p-3 rounded-xl bg-dark-900/40 text-center">
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{stats.statusBreakdown?.[s.key] || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
          {stats.recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentOrders.map((o) => (
                <div key={o._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-dark-900/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: o.product?.bannerColor || '#7C3AED' }}>
                    {o.product?.name?.charAt(0) || 'K'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{o.user?.name || 'User'}</p>
                    <p className="text-[11px] text-gray-600">{o.product?.name} • {o.package?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">Rs. {o.totalPrice?.toLocaleString()}</p>
                    <p className={`text-[10px] font-medium ${o.status === 'delivered' ? 'text-green-400' : o.status === 'pending' ? 'text-yellow-400' : 'text-neon-cyan'}`}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
