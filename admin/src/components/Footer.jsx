import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, ArrowUpRight, Instagram, MessageCircle, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.04]">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-purple/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6 sm:gap-12">

          {/* Brand */}


          <p className="hidden sm:block text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[260px] col-span-3 md:col-span-1">
            Fast, cheap, automated digital product store for gamers. Instant top-ups delivered in under 60 seconds.
          </p>


          {/* Quick Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'Game Top-ups', to: '/products?category=game-topup' },
                { label: 'Gift Cards', to: '/products?category=gift-card' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[10px] sm:text-sm text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Support</h4>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { label: 'My Orders', to: '/dashboard' },
                { label: 'FAQ', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-[10px] sm:text-sm text-gray-500 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-[10px] sm:text-sm text-gray-500 hover:text-white transition-colors duration-300">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Contact</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-sm text-gray-500">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-neon-cyan" />
                </div>
                regmimandip2@gmail.com
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-sm text-gray-500">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-neon-cyan" />
                </div>
                +977-9829174510
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-sm text-gray-500">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-neon-cyan" />
                </div>
                Pokhara, Nepal
              </li>
              <li className="pt-3 flex items-center gap-1.5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 hover:bg-blue-600/40 transition-all duration-300 hover:scale-110">
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-pink-600/20 flex items-center justify-center shrink-0 hover:bg-pink-600/40 transition-all duration-300 hover:scale-110">
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-green-600/20 flex items-center justify-center shrink-0 hover:bg-green-600/40 transition-all duration-300 hover:scale-110">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="neon-divider mt-8" />
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Karma. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-xs text-gray-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
