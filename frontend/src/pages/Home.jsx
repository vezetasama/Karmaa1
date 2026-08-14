import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Clock, Star, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import TopUps from '../components/TopUps';
import topUpGames from '../data/topUpGames';
import giftCards from '../data/giftCards';

const homeTopUps = topUpGames.filter(
  (g) => !['capcut-premium', 'minecraft', 'discord-nitro'].includes(g.slug)
);

/* ─── Banner Slider Data ─── */
const banners = [
  {
    id: 1,
    title: 'Free Fire Diamonds',
    subtitle: 'Top up instantly • Best prices in Nepal',
    cta: 'Top Up Now',
    link: '/top-up/free-fire',
    image: '/images/banner-freefire.png',
    gradient: 'from-orange-600/90 via-red-700/60 to-transparent',
    accent: '#FF6B35',
    accentGlow: 'rgba(255, 107, 53, 0.4)',
  },
];



/* ─── Scroll Observer Hook ─── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const whyUsRef = useFadeIn();
  const testimonialsRef = useFadeIn();
  const ctaRef = useFadeIn();

  const testimonials = [
    { name: 'Mandip R.', game: 'Free Fire', text: 'Got my diamonds in less than 30 seconds. Best service in Nepal!', rating: 5 },
    { name: 'Ankit B.', game: 'PUBG Mobile', text: 'Cheapest UC prices I could find. Instant delivery is amazing.', rating: 5 },
    { name: 'Sanjiv N.', game: 'MLBB', text: 'Been using Karma for months. Never had any issues. Reliable!', rating: 5 },
  ];

  return (
    <div className="pb-8 md:pb-12">

      {/* ═══════════ HERO BANNER ═══════════ */}
      <section className="relative" id="hero-slider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div
            className="relative rounded-2xl overflow-hidden h-[210px] sm:h-[280px] md:h-[420px] lg:h-[460px] border border-white/[0.06] group"
          >
            <img
              src={banners[0].image}
              alt={banners[0].title}
              className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
            />
            {/* Soft, beautiful dark gradient overlay on bottom to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>



      {/* ═══════════ TOP UPS CAROUSEL ═══════════ */}
      <TopUps items={homeTopUps} />

      {/* ═══════════ GIFT CARDS CAROUSEL ═══════════ */}
      <TopUps title="Gift Cards" items={giftCards} />

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section
        ref={ctaRef}
        className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16"
        id="cta"
      >
        <div className="relative rounded-2xl overflow-hidden p-8 sm:p-10 md:p-14 border border-white/[0.06]">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #0B0F1A 35%, #0B0F1A 65%, #22D3EE 100%)',
            }}
          />
          <div className="absolute inset-0 bg-dark-900/60" />

          {/* Glowing orbs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-neon-purple/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px]" />

          <div className="relative text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Ready to Level Up?
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              Join thousands of gamers who trust Karma for instant top-ups at the best prices.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm sm:text-base"
              id="cta-btn"
            >
              <Zap className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        </div>
      </section>



      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section
        ref={whyUsRef}
        className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16"
        id="why-us"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Why Choose Karma?</h2>
          <p className="text-sm text-gray-500 mt-2">Trusted by thousands of gamers across Nepal</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Instant Delivery',
              desc: 'Top-ups delivered within 60 seconds after payment confirmation',
              color: '#7C3AED',
              bg: 'rgba(124, 58, 237, 0.1)',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Secure Payment',
              desc: 'Pay safely with eSewa, Khalti, or other digital wallets',
              color: '#22D3EE',
              bg: 'rgba(34, 211, 238, 0.1)',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              title: '24/7 Available',
              desc: 'Fully automated system that works around the clock',
              color: '#22C55E',
              bg: 'rgba(34, 197, 94, 0.1)',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative p-3 sm:p-5 md:p-6 rounded-2xl border border-white/[0.05] bg-dark-800/30 backdrop-blur-sm transition-all duration-400 hover:border-white/[0.1] hover:-translate-y-1"
            >
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 transition-all duration-400 group-hover:scale-110"
                style={{
                  background: f.bg,
                  color: f.color,
                  border: `1px solid ${f.color}20`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1.5 sm:mb-2">{f.title}</h3>
              <p className="hidden md:block text-[11px] sm:text-xs md:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section
        ref={testimonialsRef}
        className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16"
        id="testimonials"
      >
        <div className="text-center mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-neon-yellow" />
            <span className="text-[11px] md:text-xs font-semibold text-neon-yellow uppercase tracking-widest">Reviews</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">What Gamers Say</h2>
        </div>
        <div className="md:hidden relative">
          <div className="flex items-center justify-end gap-2 mb-2">
            <button
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-9 h-9 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              className="w-9 h-9 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-dark-800/30 backdrop-blur-sm">
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: testimonials[testimonialIndex].rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-3">"{testimonials[testimonialIndex].text}"</p>
            <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.04]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <span className="text-xs font-bold text-white">{testimonials[testimonialIndex].name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{testimonials[testimonialIndex].name}</p>
                <p className="text-[11px] text-gray-500">{testimonials[testimonialIndex].game} Player</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((r) => (
            <div
              key={r.name}
              className="p-6 rounded-2xl border border-white/[0.05] bg-dark-800/30 backdrop-blur-sm hover:border-white/[0.1] transition-all duration-300 group"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{r.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.game} Player</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
