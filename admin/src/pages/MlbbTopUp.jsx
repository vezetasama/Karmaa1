import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const packages = [
  { label: '86 Diamonds', price: 149, originalPrice: 180 },
  { label: '172 Diamonds', price: 289, originalPrice: 350 },
  { label: '257 Diamonds', price: 429, originalPrice: 520 },
  { label: '706 Diamonds', price: 1149, originalPrice: 1400 },
  { label: '2195 Diamonds', price: 3499, originalPrice: 4300 },
  { label: '4390 Diamonds', price: 6899, originalPrice: 8500 },
];

export default function MlbbTopUp() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [selectedPkg, setSelectedPkg] = useState(1);
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [errors, setErrors] = useState({});

  const selectedPackage = packages[selectedPkg];

  const product = useMemo(
    () => ({
      _id: 'custom-mobile-legends',
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      category: 'game-topup',
      description: 'Recharge Mobile Legends: Bang Bang Diamonds. Fast and secure MLBB top-up with instant delivery.',
      bannerColor: '#1E90FF',
      packages,
      inputFields: [
        { name: 'userId', label: 'User ID', required: true, placeholder: 'Enter your MLBB User ID' },
        { name: 'serverId', label: 'Server ID (Zone ID)', required: true, placeholder: 'Enter your Server/Zone ID' },
      ],
    }),
    []
  );

  const validate = () => {
    const nextErrors = {};
    if (!userId.trim()) nextErrors.userId = 'User ID is required';
    if (!serverId.trim()) nextErrors.serverId = 'Server ID is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, selectedPackage, { userId: userId.trim(), serverId: serverId.trim() });
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login');
    if (!validate()) return;
    addItem(product, selectedPackage, { userId: userId.trim(), serverId: serverId.trim() });
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
            <img src="/images/topup-mlbb.png" alt="Mobile Legends" className="absolute inset-0 w-full h-full object-cover object-center scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Zap className="w-3 h-3" /> Instant Delivery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">Mobile Legends Diamonds Top Up</h1>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">Enter your MLBB User ID and Server ID, choose your diamond package, and pay instantly.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top-up Details</h2>

          <label className="block text-sm font-medium text-gray-400 mb-1.5">User ID</label>
          <input
            type="text"
            placeholder="Enter your MLBB User ID"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setErrors({ ...errors, userId: '' });
            }}
            className={`input-field ${errors.userId ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
            id="mlbb-user-id"
          />
          {errors.userId && <p className="text-xs text-red-400 mt-1">{errors.userId}</p>}

          <label className="block text-sm font-medium text-gray-400 mb-1.5 mt-4">Server ID (Zone ID)</label>
          <input
            type="text"
            placeholder="Enter your Server/Zone ID"
            value={serverId}
            onChange={(e) => {
              setServerId(e.target.value);
              setErrors({ ...errors, serverId: '' });
            }}
            className={`input-field ${errors.serverId ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
            id="mlbb-server-id"
          />
          {errors.serverId && <p className="text-xs text-red-400 mt-1">{errors.serverId}</p>}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-bold text-white mb-4">Choose Diamond Package</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {packages.map((p, i) => (
            <button key={p.label} onClick={() => setSelectedPkg(i)} className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${selectedPkg === i ? 'bg-neon-purple/10 border-neon-purple/40 shadow-glow-sm' : 'bg-dark-900/40 border-white/[0.06] hover:border-white/[0.12]'}`} id={`mlbb-pkg-${i}`}>
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
          <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 !rounded-full" id="mlbb-add-to-cart">Add to Cart</button>
          <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2" id="mlbb-buy-now"><Zap className="w-4 h-4" /> Buy Now</button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Secure payment
        </div>
      </div>
    </div>
  );
}
