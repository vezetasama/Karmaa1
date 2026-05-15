import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Zap, Trophy, CalendarDays, CalendarRange } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const PASS_ICONS = {
  'level-up': Trophy,
  weekly: CalendarDays,
  monthly: CalendarRange,
};

const PASS_THEME = {
  'level-up': {
    icon: 'text-neon-purple-light',
    bg: 'bg-neon-purple/15',
    border: 'border-neon-purple/25',
    selected: 'bg-neon-purple/10 border-neon-purple/40',
  },
  weekly: {
    icon: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/25',
    selected: 'bg-neon-cyan/10 border-neon-cyan/40',
  },
  monthly: {
    icon: 'text-neon-yellow',
    bg: 'bg-neon-yellow/10',
    border: 'border-neon-yellow/25',
    selected: 'bg-neon-orange/10 border-neon-orange/40',
  },
};

const packages = [
  { label: '115 Diamonds', price: 95 },
  { label: '355 Diamonds', price: 285, originalPrice: 320 },
  { label: '610 Diamonds', price: 470, originalPrice: 530 },
  { label: '1090 Diamonds', price: 930, originalPrice: 1040 },
  { label: '1720 Diamonds', price: 1860, originalPrice: 2050 },
  { label: '2530 Diamonds', price: 4680, originalPrice: 5100 },
  { label: 'Level Up Pass', price: 395, originalPrice: 450, icon: 'level-up' },
  { label: 'Weekly', price: 185, icon: 'weekly' },
  { label: 'Monthly', price: 900, originalPrice: 980, icon: 'monthly' },
];

export default function FreeFireTopUp() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [errors, setErrors] = useState({});
  const selectedPackage = packages[selectedPkg];

  const product = useMemo(
    () => ({
      _id: 'custom-free-fire',
      name: 'Free Fire',
      slug: 'free-fire',
      category: 'game-topup',
      description: 'Top up Free Fire diamonds instantly with secure payment.',
      bannerColor: '#F97316',
      packages,
      inputFields: [{ name: 'playerId', label: 'Player ID', required: true, placeholder: 'Enter Free Fire UID' }],
    }),
    []
  );

  const validate = () => {
    const nextErrors = {};
    if (!playerId.trim()) nextErrors.playerId = 'Player ID is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, selectedPackage, { playerId: playerId.trim() });
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login');
    if (!validate()) return;
    addItem(product, selectedPackage, { playerId: playerId.trim() });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <motion.div
          className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-56 sm:h-72">
            <img src="/images/topup-free-fire.png" alt="Free Fire" className="absolute inset-0 w-full h-full object-cover object-center scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Zap className="w-3 h-3" /> Instant Delivery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">Free Fire Top Up</h1>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">
                Enter your Free Fire UID, pick diamonds or membership passes, and pay instantly.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top-up Details</h2>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Player ID</label>
          <input
            type="text"
            placeholder="Enter Free Fire UID"
            value={playerId}
            onChange={(e) => {
              setPlayerId(e.target.value);
              setErrors({ ...errors, playerId: '' });
            }}
            className={`input-field ${errors.playerId ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
            id="freefire-player-id"
          />
          {errors.playerId && <p className="text-xs text-red-400 mt-1">{errors.playerId}</p>}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-bold text-white mb-4">Choose Package</h2>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {packages.map((p, i) => {
            const PassIcon = p.icon ? PASS_ICONS[p.icon] : null;
            const theme = p.icon ? PASS_THEME[p.icon] : null;
            const isSelected = selectedPkg === i;
            const selectedClass = theme
              ? `${theme.selected} shadow-glow-sm`
              : 'bg-neon-purple/10 border-neon-purple/40 shadow-glow-sm';

            return (
              <motion.button
                key={p.label}
                type="button"
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPkg(i)}
                className={`relative p-4 rounded-xl border text-left transition-colors duration-300 ${
                  isSelected ? selectedClass : 'bg-dark-900/40 border-white/[0.06] hover:border-white/[0.12]'
                }`}
                id={`freefire-pkg-${i}`}
              >
                {PassIcon && theme ? (
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span
                      className={`inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-lg border ${theme.bg} ${theme.border}`}
                    >
                      <PassIcon className={`w-4 h-4 ${theme.icon}`} strokeWidth={2.25} />
                    </span>
                    <p className="text-sm font-bold text-white leading-tight">{p.label}</p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-white">{p.label}</p>
                )}
                <motion.div
                  className="flex items-center gap-2 mt-1.5"
                  key={`${i}-${isSelected}`}
                  initial={isSelected ? { scale: 0.92, opacity: 0.7 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <span
                    className={`font-bold ${
                      p.icon === 'weekly'
                        ? 'text-neon-cyan'
                        : p.icon === 'monthly'
                          ? 'text-neon-yellow'
                          : 'text-neon-cyan'
                    }`}
                  >
                    Rs. {p.price.toLocaleString()}
                  </span>
                  {p.originalPrice && (
                    <span className="text-xs text-gray-600 line-through">Rs. {p.originalPrice.toLocaleString()}</span>
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.04]">
          <span className="text-gray-400 font-medium">Total</span>
          <span className="text-2xl font-extrabold text-gradient">Rs. {selectedPackage.price.toLocaleString()}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 !rounded-full" id="freefire-add-to-cart">
            Add to Cart
          </button>
          <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2" id="freefire-buy-now">
            <Zap className="w-4 h-4" /> Buy Now
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Secure payment
        </div>
      </div>
    </div>
  );
}
