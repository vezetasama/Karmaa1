import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, Zap, LogOut, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import NotificationBell from '../../components/admin/NotificationBell';

const navItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Users, label: 'Users', path: '/admin/users' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-15px)]">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-dark-950/60 backdrop-blur-xl border-r border-white/[0.04] transition-all duration-300 flex flex-col shrink-0 sticky top-[15px] h-[calc(100vh-15px)]`}>
        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                    ? 'bg-neon-purple/10 text-neon-purple-light border border-neon-purple/15 shadow-glow-sm'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                  }`}
                title={collapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${active ? 'drop-shadow-[0_0_6px_rgba(124,58,237,0.5)]' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 space-y-1 border-t border-white/[0.04]">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all" title="Back to Store">
            <Home className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-400 transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Admin Top Bar */}
        <div className="sticky top-[15px] z-30 flex items-center justify-between px-6 md:px-8 py-3 border-b border-white/[0.04] bg-dark-950/40 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">
            {navItems.find(i => location.pathname === i.path ||
              (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.label || 'Dashboard'}
          </h2>
          <NotificationBell />
        </div>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
