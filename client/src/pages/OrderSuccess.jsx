import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { getOrder } from '../services/api';
import { PageLoader } from '../components/Loader';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrder(id);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-xl p-10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-glow opacity-30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6 shadow-neon-green animate-pulse-glow">
            <CheckCircle className="w-10 h-10 text-green-400" style={{ filter: 'drop-shadow(0 0 12px rgba(34,197,94,0.7))' }} />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Order Successful!</h1>
          <p className="text-gray-500 mb-6">Your top-up has been delivered successfully</p>

          {order && (
            <div className="bg-dark-900/50 rounded-xl p-5 text-left mb-6 space-y-3 border border-white/[0.04]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product</span>
                <span className="text-white font-medium">{order.product?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Package</span>
                <span className="text-neon-cyan font-medium">{order.package?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="text-white font-bold">Rs. {order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="badge-success inline-flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Delivered
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard" className="btn-primary flex-1 flex items-center justify-center gap-2">
              View Orders <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="btn-secondary flex-1 flex items-center justify-center gap-2">
              Buy More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
