import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const giftCardConfigs = {
  'google-play': {
    name: 'Google Play',
    image: '/images/gift-google-play.png',
    bannerColor: '#34A853',
    codeType: 'Google Play email',
    packages: [
      { label: 'Rs. 500 Card', price: 500 },
      { label: 'Rs. 1000 Card', price: 1000 },
      { label: 'Rs. 2500 Card', price: 2500 },
      { label: 'Rs. 5000 Card', price: 5000 },
    ],
  },
  'itunes-apple': {
    name: 'iTunes / Apple',
    image: '/images/gift-itunes.png',
    bannerColor: '#FB5BC5',
    codeType: 'Apple ID email',
    packages: [
      { label: '$5 Card', price: 750 },
      { label: '$10 Card', price: 1450 },
      { label: '$25 Card', price: 3600 },
      { label: '$50 Card', price: 7100 },
    ],
  },
  'steam-wallet': {
    name: 'Steam Wallet',
    image: '/images/gift-steam.png',
    bannerColor: '#1B2838',
    codeType: 'Steam account email',
    packages: [
      { label: '$5 Wallet', price: 760 },
      { label: '$10 Wallet', price: 1480 },
      { label: '$20 Wallet', price: 2920 },
      { label: '$50 Wallet', price: 7250 },
    ],
  },
  playstation: {
    name: 'PlayStation',
    image: '/images/gift-playstation.png',
    bannerColor: '#006FCD',
    codeType: 'PSN account email',
    packages: [
      { label: '$10 Card', price: 1500 },
      { label: '$20 Card', price: 2950 },
      { label: '$50 Card', price: 7300 },
      { label: '$100 Card', price: 14500 },
    ],
  },
  xbox: {
    name: 'Xbox',
    image: '/images/gift-xbox.png',
    bannerColor: '#107C10',
    codeType: 'Xbox account email',
    packages: [
      { label: '$5 Card', price: 760 },
      { label: '$10 Card', price: 1490 },
      { label: '$25 Card', price: 3650 },
      { label: '$50 Card', price: 7200 },
    ],
  },
  netflix: {
    name: 'Netflix',
    image: '/images/gift-netflix.png',
    bannerColor: '#E50914',
    codeType: 'Netflix email',
    packages: [
      { label: '1 Month Standard', price: 1300 },
      { label: '3 Months Standard', price: 3800 },
      { label: '6 Months Standard', price: 7400 },
      { label: '12 Months Standard', price: 14500 },
    ],
  },
  'razer-gold': {
    name: 'Razer Gold',
    image: '/images/gift-razer-gold.png',
    bannerColor: '#44D62C',
    codeType: 'Razer account email',
    packages: [
      { label: '$5 Pin', price: 760 },
      { label: '$10 Pin', price: 1480 },
      { label: '$25 Pin', price: 3600 },
      { label: '$50 Pin', price: 7100 },
      { label: '$100 Pin', price: 14000 },
    ],
  },
};

export default function GiftCardTopUp() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const config = giftCardConfigs[slug];

  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [accountEmail, setAccountEmail] = useState('');
  const [errors, setErrors] = useState({});

  if (!config) {
    navigate('/products');
    return null;
  }

  const selectedPackage = config.packages[selectedPkg];
  const product = useMemo(
    () => ({
      _id: `custom-gift-${slug}`,
      name: config.name,
      slug,
      category: 'gift-card',
      description: `${config.name} gift card with instant code delivery.`,
      bannerColor: config.bannerColor,
      packages: config.packages,
      inputFields: [{ name: 'accountEmail', label: config.codeType, required: true, placeholder: 'you@example.com' }],
    }),
    [config, slug]
  );

  const validate = () => {
    const nextErrors = {};
    if (!accountEmail.trim()) nextErrors.accountEmail = `${config.codeType} is required`;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, selectedPackage, { accountEmail: accountEmail.trim() });
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login');
    if (!validate()) return;
    addItem(product, selectedPackage, { accountEmail: accountEmail.trim() });
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
            <img src={config.image} alt={config.name} className="absolute inset-0 w-full h-full object-cover object-center scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Zap className="w-3 h-3" /> Instant Delivery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">{config.name} Gift Card</h1>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">Select denomination and receive your code instantly after payment.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Delivery Details</h2>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">{config.codeType}</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={accountEmail}
            onChange={(e) => {
              setAccountEmail(e.target.value);
              setErrors({ ...errors, accountEmail: '' });
            }}
            className={`input-field ${errors.accountEmail ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
            id="gift-card-account-email"
          />
          {errors.accountEmail && <p className="text-xs text-red-400 mt-1">{errors.accountEmail}</p>}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-bold text-white mb-4">Choose Gift Card</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.packages.map((p, i) => (
            <button key={p.label} onClick={() => setSelectedPkg(i)} className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${selectedPkg === i ? 'bg-neon-purple/10 border-neon-purple/40 shadow-glow-sm' : 'bg-dark-900/40 border-white/[0.06] hover:border-white/[0.12]'}`} id={`gift-card-pkg-${i}`}>
              <p className="text-sm font-bold text-white">{p.label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-neon-cyan font-bold">Rs. {p.price.toLocaleString()}</span>
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
          <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 !rounded-full" id="gift-card-add-to-cart">Add to Cart</button>
          <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2" id="gift-card-buy-now"><Zap className="w-4 h-4" /> Buy Now</button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Secure payment
        </div>
      </div>
    </div>
  );
}
