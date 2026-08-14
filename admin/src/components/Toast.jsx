import { useCartStore } from '../store/cartStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const toast = useCartStore((s) => s.toast);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-neon-cyan" />,
  };

  const glows = {
    success: 'border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
    error: 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    info: 'border-neon-cyan/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up" id="toast">
      <div className={`flex items-center gap-3 px-5 py-3.5 bg-dark-800/95 backdrop-blur-2xl border ${glows[toast.type]} rounded-2xl`}>
        {icons[toast.type]}
        <span className="text-sm text-white font-medium">{toast.message}</span>
        <button
          onClick={() => useCartStore.setState({ toast: null })}
          className="ml-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
