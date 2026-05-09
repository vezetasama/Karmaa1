import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const packages = [
  { label: 'Nitro Basic – 1 Month', price: 450 },
  { label: 'Nitro Basic – 3 Months', price: 1250, originalPrice: 1350 },
  { label: 'Nitro – 1 Month', price: 1350 },
  { label: 'Nitro – 3 Months', price: 3800, originalPrice: 4050 },
  { label: 'Nitro – 6 Months', price: 7200, originalPrice: 8100 },
  { label: 'Nitro – 12 Months', price: 13500, originalPrice: 16200 },
];

export default function DiscordNitroTopUp() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [discordTag, setDiscordTag] = useState('');
  const [errors, setErrors] = useState({});
  const selectedPackage = packages[selectedPkg];

  const product = useMemo(
    () => ({
      _id: 'custom-discord-nitro',
      name: 'Discord Nitro',
      slug: 'discord-nitro',
      category: 'game-topup',
      description: 'Upgrade to Discord Nitro for HD streaming, bigger uploads, and custom emojis.',
      bannerColor: '#5865F2',
      packages,
      inputFields: [{ name: 'discordTag', label: 'Discord Username', required: true, placeholder: 'username#0000' }],
    }),
    []
  );

  const validate = () => {
    const nextErrors = {};
    if (!discordTag.trim()) nextErrors.discordTag = 'Discord tag is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, selectedPackage, { discordTag: discordTag.trim() });
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login');
    if (!validate()) return;
    addItem(product, selectedPackage, { discordTag: discordTag.trim() });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm overflow-hidden">
          <div className="relative h-56 sm:h-72">
            <img src="/images/topup-discord-nitro.png" alt="Discord Nitro" className="absolute inset-0 w-full h-full object-cover object-center scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Zap className="w-3 h-3" /> Instant Delivery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">Discord Nitro Top Up</h1>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">Upgrade your Discord account with Nitro and enjoy premium features immediately.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top-up Details</h2>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Discord Username</label>
          <input
            type="text"
            placeholder="username#0000"
            value={discordTag}
            onChange={(e) => {
              setDiscordTag(e.target.value);
              setErrors({ ...errors, discordTag: '' });
            }}
            className={`input-field ${errors.discordTag ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
            id="discord-nitro-tag"
          />
          {errors.discordTag && <p className="text-xs text-red-400 mt-1">{errors.discordTag}</p>}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-bold text-white mb-4">Choose Nitro Package</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {packages.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setSelectedPkg(i)}
              className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${selectedPkg === i ? 'bg-neon-purple/10 border-neon-purple/40 shadow-glow-sm' : 'bg-dark-900/40 border-white/[0.06] hover:border-white/[0.12]'}`}
              id={`discord-nitro-pkg-${i}`}
            >
              <p className="text-sm font-bold text-white">{p.label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-neon-cyan font-bold">Rs. {p.price.toLocaleString()}</span>
                {p.originalPrice && <span className="text-xs text-gray-600 line-through">Rs. {p.originalPrice.toLocaleString()}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.04]">
          <span className="text-gray-400 font-medium">Total</span>
          <span className="text-2xl font-extrabold text-gradient">Rs. {selectedPackage.price.toLocaleString()}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 !rounded-full" id="discord-nitro-add-to-cart">Add to Cart</button>
          <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2" id="discord-nitro-buy-now"><Zap className="w-4 h-4" /> Buy Now</button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Secure payment
        </div>
      </div>
    </div>
  );
}
