import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { createOrder, getProduct } from '../services/api';

const methodMeta = {
  esewa: { name: 'eSewa', qr: '/images/pay-esewa.png' },
  khalti: { name: 'Khalti', qr: '/images/pay-khalti.png' },
  bank: { name: 'Bank Transfer', qr: '/images/pay-bank.png' },
};

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef(null);
  const { user } = useAuthStore();
  const { items, getTotal, clearCart, showToast } = useCartStore();
  const [proofFile, setProofFile] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [processing, setProcessing] = useState(false);

  const payMethod = location.state?.payMethod || 'esewa';
  const total = location.state?.total || getTotal();
  const payMethodLabel = methodMeta[payMethod]?.name || 'Payment';
  const qrImage = methodMeta[payMethod]?.qr || '/images/pay-esewa.png';

  const isObjectId = (id) => /^[a-f\d]{24}$/i.test(id || '');
  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('Failed to read screenshot file'));
      reader.readAsDataURL(file);
    });
  const compressImageToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1280;
          const scale = Math.min(1, maxWidth / img.width);
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to prepare image'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error('Invalid image file'));
        img.src = typeof reader.result === 'string' ? reader.result : '';
      };
      reader.onerror = () => reject(new Error('Failed to read screenshot file'));
      reader.readAsDataURL(file);
    });

  if (!user) { navigate('/login'); return null; }
  if (items.length === 0) { navigate('/cart'); return null; }

  const handleSubmit = async () => {
    if (!proofFile) {
      showToast('Please upload payment screenshot first.', 'error');
      return;
    }
    if (!transactionCode.trim()) {
      showToast('Please enter transaction code.', 'error');
      return;
    }

    setProcessing(true);
    try {
      let screenshotDataUrl = await compressImageToDataUrl(proofFile);
      // Fallback for uncommon image decode failures.
      if (!screenshotDataUrl) {
        screenshotDataUrl = await toDataUrl(proofFile);
      }
      if (screenshotDataUrl.length > 1_900_000) {
        throw new Error('Screenshot is too large. Please upload a smaller image.');
      }
      for (const item of items) {
        let productId = item.product?._id;
        let productPackages = item.product?.packages;

        if (!isObjectId(productId)) {
          const slug = item.product?.slug;
          if (!slug) {
            throw new Error(`Cannot process item: ${item.product?.name || 'Unknown product'}`);
          }
          const productRes = await getProduct(slug);
          const realProduct = productRes.data.data;
          productId = realProduct._id;
          productPackages = realProduct.packages;
        }

        // Match by label first; fall back to amount/price for older cart snapshots.
        const selectedLabel = item.selectedPackage?.label?.trim()?.toLowerCase();
        let packageIndex = productPackages.findIndex(
          (p) => p.label?.trim()?.toLowerCase() === selectedLabel
        );
        if (packageIndex < 0) {
          packageIndex = productPackages.findIndex(
            (p) => p.amount === item.selectedPackage?.amount && p.price === item.selectedPackage?.price
          );
        }
        if (packageIndex < 0) {
          packageIndex = productPackages.findIndex((p) => p.price === item.selectedPackage?.price);
        }
        await createOrder({
          productId,
          packageIndex,
          selectedPackage: item.selectedPackage,
          gameInfo: item.gameInfo,
          quantity: item.quantity,
          paymentMethod: payMethod,
          transactionCode: transactionCode.trim(),
          screenshotName: proofFile.name,
          screenshotDataUrl,
        });
      }

      clearCart();
      showToast('Payment submitted. Order is pending verification.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Checkout failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.07] bg-dark-800/45 backdrop-blur-xl p-7 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
        <div className="relative">
          <p className="text-lg font-bold text-white">{payMethodLabel}</p>
          <h1 className="text-base sm:text-lg font-extrabold text-white mt-4 tracking-wide uppercase">
            Please Follow The Instruction Below
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            You have requested to deposit <span className="text-white font-semibold">Rs. {total.toLocaleString()}</span>. Please pay exact amount for successful payment.
          </p>

          <div className="mx-auto mt-6 w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-white p-2 shadow-[0_0_30px_rgba(255,255,255,0.12)]">
            <img src={qrImage} alt={`${payMethodLabel} QR`} className="w-full h-full object-contain rounded-xl" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Merchant Name</p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-5 w-full rounded-xl border border-white/[0.08] bg-dark-900/60 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:border-white/[0.15] transition-all flex items-center justify-center gap-2"
          >
            <ImagePlus className="w-4 h-4" /> Select Payment Screenshot Image
          </button>

          <div className="mt-4 text-left">
            <label htmlFor="transaction-code" className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Enter transaction code
            </label>
            <input
              id="transaction-code"
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="e.g. TXN123456"
              className="w-full rounded-xl border border-white/[0.08] bg-dark-900/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-purple/70 focus:ring-2 focus:ring-neon-purple/30 transition-all"
            />
          </div>

          {proofFile && (
            <p className="text-xs text-neon-cyan mt-3 truncate">
              Selected: {proofFile.name}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={processing}
            className="mt-6 w-full rounded-xl py-3.5 font-bold text-white bg-gradient-to-r from-neon-purple to-neon-cyan hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
