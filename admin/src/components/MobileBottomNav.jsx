import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, Menu } from 'lucide-react';

const items = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'More', to: '/products', icon: Menu },
];

export default function MobileBottomNav() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;
  if (['/login', '/register'].includes(location.pathname)) return null;

  const handleMoreClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-mobile-menu'));
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-dark-950/95 backdrop-blur-xl">
      <div className="grid grid-cols-4 h-[62px]">
        {items.map((item) => {
          const Icon = item.icon;
          const target = item.to;
          const active = item.label === 'More'
            ? false
            : location.pathname === target || (target !== '/' && location.pathname.startsWith(target));

          if (item.label === 'More') {
            return (
              <button
                key={item.label}
                onClick={handleMoreClick}
                className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  active ? 'text-neon-purple-light' : 'text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={target}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                active ? 'text-neon-purple-light' : 'text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
