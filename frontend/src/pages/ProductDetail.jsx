import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, ShoppingCart, Check, ArrowLeft, Package } from 'lucide-react';
import { PageLoader } from '../components/Loader';
import { getProduct } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [gameInfo, setGameInfo] = useState({});
  const [errors, setErrors] = useState({});
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProduct(slug);
        setProduct(res.data.data);
        const info = {};
        res.data.data.inputFields?.forEach((f) => (info[f.name] = ''));
        setGameInfo(info);
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const validate = () => {
    const errs = {};
    product.inputFields?.forEach((f) => {
      if (f.required && !gameInfo[f.name]?.trim()) errs[f.name] = `${f.label} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, product.packages[selectedPkg], gameInfo);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    if (!validate()) return;
    addItem(product, product.packages[selectedPkg], gameInfo);
    navigate('/checkout');
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  const pkg = product.packages[selectedPkg];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left - Product Info */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm overflow-hidden">
          <div
            className="relative h-56 md:h-72 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${product.bannerColor}25 0%, transparent 70%)` }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: product.bannerColor }} />
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl font-extrabold text-white shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${product.bannerColor}, ${product.bannerColor}88)`,
                boxShadow: `0 0 40px ${product.bannerColor}40`,
              }}
            >
              {product.name.charAt(0)}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-purple/10 text-neon-purple-light border border-neon-purple/20">
                {product.category === 'game-topup' ? 'Game Top-up' : 'Gift Card'}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Zap className="w-3 h-3" />Instant
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
            <p className="text-gray-500 mt-3 leading-relaxed text-sm">{product.description}</p>
          </div>
        </div>

        {/* Right - Purchase Form */}
        <div className="space-y-5">
          {/* Package Selection */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-neon-purple" />
              <h2 className="text-lg font-bold text-white">Select Package</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {product.packages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPkg(i)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${
                    selectedPkg === i
                      ? 'bg-neon-purple/10 border-neon-purple/40 shadow-glow-sm'
                      : 'bg-dark-900/40 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                  id={`pkg-${i}`}
                >
                  {selectedPkg === i && <Check className="absolute top-2.5 right-2.5 w-4 h-4 text-neon-purple" />}
                  <p className="text-sm font-bold text-white">{p.label}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-neon-cyan font-bold">Rs. {p.price}</span>
                    {p.originalPrice && <span className="text-xs text-gray-600 line-through">Rs. {p.originalPrice}</span>}
                  </div>
                  {p.originalPrice && (
                    <span className="inline-block mt-1 text-[10px] text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded-full">
                      {Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Game Info Input */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Account Information</h2>
            <div className="space-y-4">
              {product.inputFields?.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    {field.label} {field.required && <span className="text-neon-pink-hot">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={gameInfo[field.name] || ''}
                    onChange={(e) => { setGameInfo({ ...gameInfo, [field.name]: e.target.value }); setErrors({ ...errors, [field.name]: '' }); }}
                    className={`input-field ${errors[field.name] ? '!border-red-500/40 !shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}`}
                    id={`input-${field.name}`}
                  />
                  {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Actions */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.04]">
              <span className="text-gray-400 font-medium">Total</span>
              <span className="text-2xl font-extrabold text-gradient">Rs. {pkg.price}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 !rounded-full" id="add-to-cart-btn">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2" id="buy-now-btn">
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
