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
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-8 md:p-10 text-center w-full max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm justify-center">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-15px)] md:min-h-[calc(100vh-15px)] bg-dark-900 pb-[70px] md:pb-0">
      {/* Sidebar (Desktop Only) */}
      <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-56'} bg-dark-950/60 backdrop-blur-xl border-r border-white/[0.04] transition-all duration-300 flex-col shrink-0 sticky top-[15px] h-[calc(100vh-15px)]`}>
        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
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
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all" title="Logout">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-400 transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col min-h-screen md:min-h-0">
        {/* Admin Top Bar */}
        <div className="sticky top-0 md:top-[15px] z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-white/[0.04] bg-dark-950/80 backdrop-blur-xl">
          <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
            {navItems.find(i => location.pathname === i.path ||
              (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell />
            
            {/* Mobile Actions (Visible only on mobile) */}
            <div className="flex md:hidden items-center gap-1 border-l border-white/[0.08] pl-2 ml-1">
              <Link to="/" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-red-400/80 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

      {/* Admin Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-dark-950/95 backdrop-blur-xl pb-safe">
        <div className="grid grid-cols-4 h-[65px]">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1.5 text-[11px] transition-all duration-200 relative ${
                  active ? 'text-neon-purple-light' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {/* Active Indicator Line */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-neon-purple shadow-[0_0_8px_rgba(124,58,237,0.8)] rounded-b-full" />
                )}
                <item.icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_rgba(124,58,237,0.5)]' : ''}`} />
                <span className="font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
