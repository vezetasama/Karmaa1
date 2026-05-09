import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Top-ups', href: '/products?category=game-topup' },
  { label: 'Gift Cards', href: '/products?category=gift-card' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Allow bottom "More" button to open this mobile menu.
  useEffect(() => {
    const handleOpenMobileMenu = () => setIsOpen(true);
    window.addEventListener('open-mobile-menu', handleOpenMobileMenu);
    return () => window.removeEventListener('open-mobile-menu', handleOpenMobileMenu);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      {/* ── Inline styles for glassmorphism & neon effects ── */}
      <style>{`
        .nav-glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-glass--scrolled {
          background: rgba(0, 0, 0, 0.72);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          border-bottom-color: rgba(255, 255, 255, 0.05);
        }

        /* ── Nav link hover underline ── */
        .nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.01em;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #7C3AED, #22D3EE);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
          transition: width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .nav-link:hover::after,
        .nav-link--active::after {
          width: 100%;
          left: 0;
        }
        .nav-link:hover {
          color: #fff;
          text-shadow: 0 0 12px rgba(124, 58, 237, 0.4), 0 0 24px rgba(34, 211, 238, 0.15);
        }
        .nav-link--active {
          color: #fff;
        }

        /* ── Icon button base ── */
        .nav-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-icon-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.15);
        }

        /* ── Cart badge pulse ── */
        .cart-badge {
          position: absolute;
          top: 2px; right: 2px;
          min-width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px;
          font-size: 10px; font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #E11D48, #F43F5E);
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(225, 29, 72, 0.6);
          animation: badge-pulse 2s ease-in-out infinite;
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(225, 29, 72, 0.4); }
          50% { box-shadow: 0 0 18px rgba(225, 29, 72, 0.8); }
        }

        /* ── CTA neon border button ── */
        .nav-cta {
          position: relative;
          padding: 8px 22px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          border-radius: 999px;
          background: transparent;
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 1;
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #7C3AED, #22D3EE, #EC4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .nav-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(34, 211, 238, 0.15));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .nav-cta:hover::after {
          opacity: 1;
        }
        .nav-cta:hover {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(34, 211, 238, 0.15);
          transform: translateY(-1px);
        }
        .nav-cta:active {
          transform: scale(0.97);
        }

        /* ── Sign In filled CTA ── */
        .nav-cta-filled {
          padding: 8px 24px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          border-radius: 999px;
          background: linear-gradient(135deg, #7C3AED, #6D28D9);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.3), 0 4px 16px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .nav-cta-filled:hover {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          box-shadow: 0 0 28px rgba(124, 58, 237, 0.5), 0 4px 20px rgba(0, 0, 0, 0.4);
          transform: translateY(-1px);
        }
        .nav-cta-filled:active {
          transform: scale(0.97);
        }

        /* ── User avatar ring ── */
        .user-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #7C3AED, #22D3EE);
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.35);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .user-avatar:hover {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
          transform: scale(1.05);
        }

        /* ── Mobile menu ── */
        .mobile-menu {
          background: rgba(6, 9, 18, 0.96);
          backdrop-filter: blur(24px) saturate(1.2);
          -webkit-backdrop-filter: blur(24px) saturate(1.2);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          animation: mobile-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mobile-slide-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
          display: block;
          padding: 14px 20px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          font-size: 0.9375rem;
          transition: all 0.25s ease;
        }
        .mobile-link:hover,
        .mobile-link--active {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
        .mobile-link--active {
          border-left: 2px solid #7C3AED;
          box-shadow: inset 4px 0 12px -4px rgba(124, 58, 237, 0.3);
        }

        /* ── Hamburger animation ── */
        .hamburger-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease, background 0.3s ease;
        }
        .hamburger-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
        }

        /* ── Logout button ── */
        .logout-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.08);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.15);
        }

        /* ── Separator ── */
        .nav-separator {
          width: 1px; height: 24px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 4px;
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50" ref={mobileMenuRef}>
        <nav className={`nav-glass ${scrolled ? 'nav-glass--scrolled' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[68px]">

              {/* ── Logo ── */}
              <Link to="/" className="flex items-center gap-2.5 group shrink-0" id="nav-logo">
                <img
                  src="/images/karma store logo.png"
                  alt="Karma Store"
                  className="w-13 h-10 rounded-xl object-contain"
                />
              </Link>

              {/* ── Desktop Nav — Center ── */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`nav-link ${isActive(link.href) ? 'nav-link--active' : ''}`}
                    id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* ── Desktop Actions — Right ── */}
              <div className="hidden md:flex items-center gap-1">
                {/* Cart */}
                <Link to="/cart" className="nav-icon-btn" id="nav-cart">
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  {itemCount > 0 && (
                    <span className="cart-badge">{itemCount}</span>
                  )}
                </Link>

                {user ? (
                  <>
                    {/* Dashboard */}
                    <Link to="/dashboard" className="nav-icon-btn" id="nav-dashboard">
                      <LayoutDashboard className="w-[18px] h-[18px]" />
                    </Link>

                    {/* Admin CTA */}
                    {user.role === 'admin' && (
                      <>
                        <div className="nav-separator" />
                        <Link to="/admin" className="nav-cta" id="nav-admin">
                          Admin
                        </Link>
                      </>
                    )}

                    <div className="nav-separator" />

                    {/* User avatar + name + logout */}
                    <div className="flex items-center gap-2 ml-1">
                      <div className="user-avatar">
                        <span className="text-xs font-bold text-white leading-none">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm max-w-[80px] truncate hidden lg:inline"
                        style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                        {user.name}
                      </span>
                      <button onClick={handleLogout} className="logout-btn" id="nav-logout" title="Logout">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="nav-separator" />
                    <Link to="/login" className="nav-cta-filled" id="nav-login">
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* ── Mobile Actions ── */}
              <div className="md:hidden flex items-center gap-1.5">
                <Link to="/products" className="nav-icon-btn" id="nav-search-mobile" aria-label="Search products">
                  <Search className="w-[18px] h-[18px]" />
                </Link>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="nav-cta-filled"
                    id="nav-mobile-dashboard"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="nav-cta-filled"
                    id="nav-mobile-login"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div className="md:hidden mobile-menu overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`mobile-link ${isActive(link.href) ? 'mobile-link--active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {user ? (
                  <>
                    {/* Mobile user info */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <div className="user-avatar" style={{ width: 36, height: 36 }}>
                        <span className="text-xs font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      className="mobile-link"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="mobile-link"
                        onClick={() => setIsOpen(false)}
                        style={{ color: '#22D3EE' }}
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="mobile-link w-full text-left"
                      style={{ color: '#EF4444' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="px-3 pt-2">
                    <Link
                      to="/login"
                      className="nav-cta-filled block text-center"
                      onClick={() => setIsOpen(false)}
                      style={{ padding: '12px 24px', fontSize: '0.9375rem' }}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content isn't hidden behind fixed navbar */}
      <div className="h-[68px]" />
    </>
  );
}
