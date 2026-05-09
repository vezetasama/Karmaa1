import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import topUpGames from '../data/topUpGames';

/* ─── Single Card ─── */
function TopUpCard({ game, isGrid = false }) {
  const customTopupRoutes = {
    'clash-royale': '/top-up/clashroayle',
    'clash-of-clans': '/top-up/clash-of-clans',
    'pubg-mobile': '/top-up/pubg-mobile',
    'pubg-lite': '/top-up/pubg-lite',
    'call-of-duty-mobile': '/top-up/call-of-duty-mobile',
    'free-fire': '/top-up/free-fire',
    'tiktok-coin': '/top-up/tiktok-coin',
    'capcut-premium': '/top-up/capcut-premium',
    'roblox': '/top-up/roblox',
    'google-play': '/gift-card/google-play',
    'itunes-apple': '/gift-card/itunes-apple',
    'steam-wallet': '/gift-card/steam-wallet',
    playstation: '/gift-card/playstation',
    xbox: '/gift-card/xbox',
    netflix: '/gift-card/netflix',
    'razer-gold': '/gift-card/razer-gold',
  };
  const targetLink = customTopupRoutes[game.slug] || `/product/${game.slug}`;

  return (
    <Link
      to={targetLink}
      className={`group ${isGrid ? '' : 'flex-shrink-0 w-[46vw] max-w-[210px] sm:w-[190px] md:w-[210px]'} cursor-pointer`}
      id={`topup-card-${game.slug}`}
    >
      {/* Image Container */}
      <div
        className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/[0.06] transition-all duration-300 group-hover:border-white/[0.15] group-hover:-translate-y-2"
        style={{
          boxShadow: 'none',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${game.accent}30, 0 20px 50px rgba(0,0,0,0.6)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Game Image */}
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay - always visible bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 80%, ${game.accent}15 0%, transparent 70%)`,
          }}
        />

        {/* Accent line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${game.accent}, transparent)`,
            boxShadow: `0 0 12px ${game.accent}60`,
          }}
        />
      </div>

      {/* Title */}
      <p className="text-center text-sm font-semibold text-gray-300 mt-3 group-hover:text-white transition-colors duration-300 truncate px-1">
        {game.name}
      </p>
    </Link>
  );
}

/* ─── TopUps Section ─── */
export default function TopUps({
  title = 'Top Up',
  items = topUpGames,
  showHeader = true,
  showControls = true,
  showTitle = true,
  isMobileGrid = false,
  desktopGrid = false,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 210;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * 2;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12"
      id="topups-section"
    >
      {/* Header */}
      {showHeader && (
        <div className={`flex items-center mb-4 sm:mb-6 ${showTitle ? 'justify-between' : 'justify-end'}`}>
          {showTitle && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-red/10 border border-neon-red/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-neon-red" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {title}
                </h2>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {showControls && !isMobileGrid && (
            <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollLeft
                ? 'bg-neon-purple/10 border border-neon-purple/25 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple'
                : 'bg-dark-800/40 border border-white/[0.06] text-gray-600 cursor-not-allowed'
                }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollRight
                ? 'bg-neon-purple/10 border border-neon-purple/25 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple'
                : 'bg-dark-800/40 border border-white/[0.06] text-gray-600 cursor-not-allowed'
                }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            </div>
          )}
        </div>
      )}

      {/* Grid Layout for Mobile - only show when isMobileGrid is true */}
      {isMobileGrid && (
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {items.map((game) => (
              <TopUpCard key={game.id} game={game} isGrid={true} />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Grid Layout - show only on desktop when enabled */}
      {desktopGrid && (
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4 sm:gap-5">
            {items.map((game) => (
              <TopUpCard key={game.id} game={game} isGrid={true} />
            ))}
          </div>
        </div>
      )}

      {/* Carousel Layout - hide on desktop when desktopGrid is enabled, otherwise show normally */}
      <div className={`relative group/carousel overflow-hidden ${desktopGrid ? 'md:hidden' : (isMobileGrid ? 'hidden md:block' : '')}`}>
        {/* Left fade edge */}
        <div
          className={`absolute left-0 top-0 bottom-8 w-12 z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: 'linear-gradient(to right, #0B0F1A, transparent)',
          }}
        />

        {/* Right fade edge */}
        <div
          className={`absolute right-0 top-0 bottom-8 w-12 z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: 'linear-gradient(to left, #0B0F1A, transparent)',
          }}
        />

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {items.map((game) => (
            <TopUpCard key={game.id} game={game} isGrid={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
