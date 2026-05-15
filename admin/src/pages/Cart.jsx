import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-dark-800/40 border border-white/[0.06] flex items-center justify-center mb-5">
          <ShoppingBag className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some game top-ups to get started</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">Browse Products <ArrowRight className="w-4 h-4" /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight" id="cart-title">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-5 flex items-center gap-5 hover:border-white/[0.1] transition-all duration-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${item.product.bannerColor}, ${item.product.bannerColor}88)`, boxShadow: `0 0 20px ${item.product.bannerColor}25` }}>
                {item.product.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{item.product.name}</h3>
                <p className="text-sm text-neon-cyan">{item.selectedPackage.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {Object.entries(item.gameInfo || {}).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-dark-900/60 border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all" disabled={item.quantity <= 1}>
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-dark-900/60 border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-lg font-bold text-white w-28 text-right">Rs. {(item.selectedPackage.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-600 hover:text-red-400 transition-all" id={`remove-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-500">
                <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                <span>Rs. {(item.selectedPackage.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="neon-divider mt-4" />
          <div className="pt-4 flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-extrabold text-gradient">Rs. {total.toLocaleString()}</span>
          </div>
          <Link to={user ? '/checkout' : '/login'} className="btn-primary w-full mt-6 flex items-center justify-center gap-2" id="checkout-btn">
            {user ? 'Proceed to Checkout' : 'Sign In to Checkout'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
