import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const [payMethod, setPayMethod] = useState('esewa');
  const total = getTotal();

  if (!user) { navigate('/login'); return null; }
  if (items.length === 0) { navigate('/cart'); return null; }

  const goToPaymentStep = () => navigate('/checkout/payment', { state: { payMethod, total } });

  const methods = [
    { id: 'esewa', name: 'eSewa', color: '#60BB46', logo: '/images/pay-esewa.png', logoSize: 'w-17 h-17' },
    { id: 'khalti', name: 'Khalti', color: '#5C2D91', logo: '/images/pay-khalti.png', logoSize: 'w-33 h-33' },
    { id: 'bank', name: 'Bank Transfer', color: '#22D3EE', logo: '/images/pay-bank.png', logoSize: 'w-22 h-22' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight" id="checkout-title">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-5">
          {/* Order Items */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: item.product.bannerColor, boxShadow: `0 0 15px ${item.product.bannerColor}30` }}>
                      {item.product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.product.name}</p>
                      <p className="text-xs text-neon-cyan">{item.selectedPackage.label} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-white">Rs. {(item.selectedPackage.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`p-4 rounded-xl border text-center transition-all duration-300 ${payMethod === m.id
                    ? 'border-neon-purple/40 bg-neon-purple/10 shadow-glow-sm'
                    : 'border-white/[0.06] bg-dark-900/40 hover:border-white/[0.12]'
                    }`}
                  id={`pay-${m.id}`}
                >
                  <img
                    src={m.logo}
                    alt={m.name}
                    className={`${m.logoSize || 'w-12 h-12'} mx-auto rounded-xl object-contain mb-2`}
                  />
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-500"><span>Service Fee</span><span className="text-green-400">Free</span></div>
          </div>
          <div className="neon-divider mt-4" />
          <div className="pt-4 flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-extrabold text-gradient">Rs. {total.toLocaleString()}</span>
          </div>
          <button onClick={goToPaymentStep} className="btn-primary w-full mt-6 flex items-center justify-center gap-2" id="pay-btn">
            <Zap className="w-4 h-4" /> Pay Rs. {total.toLocaleString()}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Secure payment
          </div>
        </div>
      </div>
    </div>
  );
}
