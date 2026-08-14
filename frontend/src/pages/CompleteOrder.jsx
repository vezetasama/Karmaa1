import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  ShoppingCart, 
  Lock, 
  HelpCircle, 
  ChevronDown, 
  Plus, 
  Minus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CompleteOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state or use premium fallback
  const orderDetails = useMemo(() => {
    if (location.state && location.state.product && location.state.package) {
      return {
        product: location.state.product,
        package: location.state.package,
        accountEmail: location.state.accountEmail?.trim() || 'Not Provided (Optional)',
        isDemo: false
      };
    }
    // High-end demo fallback if page is visited directly
    return {
      product: {
        name: 'Steam Wallet',
        slug: 'steam-wallet',
        image: '/images/gift-steam.png',
        codeType: 'Steam account email',
      },
      package: { label: '$10 Wallet', price: 1480 },
      accountEmail: 'gamer.legend@gmail.com',
      isDemo: true
    };
  }, [location.state]);

  const [quantity, setQuantity] = useState(1);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [loadingPlatform, setLoadingPlatform] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Generate a random official looking transaction ID once
  const transactionId = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `KM-GC-${code}`;
  }, []);

  // Recalculate price dynamically
  const subtotal = orderDetails.package.price * quantity;
  const deliveryFee = 0; // Free
  const total = subtotal + deliveryFee;

  // Connection Simulation logs for high-tech cyberpunk redirection
  useEffect(() => {
    if (!loadingPlatform) {
      setLoadingProgress(0);
      setTerminalLogs([]);
      return;
    }

    const logsTemplates = [
      `[SYSTEM] Initializing secure payment tunnel...`,
      `[SECURITY] Generating signature hash... (AES-256)`,
      `[SECURE] Created transaction identifier: ${transactionId}`,
      `[GATEWAY] Transmitting order tokens: QTY: ${quantity} | PKG: ${orderDetails.package.label}`,
      `[NET] Handshaking with secure ${loadingPlatform} API...`,
      `[SYSTEM] Bypassing third-party transaction fees: OK`,
      `[SECURE] Encrypted tunnel locked. Handing off to Support Desk...`,
      `[SUCCESS] Connection secure. Launching client gateway...`
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logsTemplates.length) {
        setTerminalLogs(prev => [...prev, logsTemplates[logIndex]]);
        logIndex++;
      }
    }, 280);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    // Redirection trigger after loading finishes
    const redirectTimeout = setTimeout(() => {
      let targetUrl = '';
      const textMessage = `Hi Karma Store! I want to complete my purchase:
🎮 Product: ${orderDetails.product.name} Gift Card
📦 Package: ${orderDetails.package.label}
🔢 Quantity: ${quantity}
💰 Total: Rs. ${total.toLocaleString()}
📧 Email: ${orderDetails.accountEmail}
🔑 Ref: ${transactionId}
Please provide me payment instructions!`;

      const encodedMsg = encodeURIComponent(textMessage);

      if (loadingPlatform === 'WhatsApp') {
        targetUrl = `https://wa.me/9779829174510?text=${encodedMsg}`;
      } else if (loadingPlatform === 'Instagram') {
        targetUrl = `https://instagram.com/karma_gaming`;
      } else if (loadingPlatform === 'Facebook') {
        targetUrl = `https://m.me/karma_gaming`;
      }

      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setLoadingPlatform(null);
    }, 2500);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [loadingPlatform, quantity, orderDetails, total, transactionId]);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const incrementQty = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQty = () => setQuantity(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 text-white overflow-hidden">
      
      {/* ── HEADER NAVIGATION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <button 
          onClick={() => navigate('/products')} 
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>
        
        {/* Cyberpunk Steps Tracker */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-dark-900/40 border border-white/[0.04] backdrop-blur-md rounded-full px-4 py-1.5 text-xs">
          <span className="text-gray-500">Configure</span>
          <span className="text-gray-600">/</span>
          <span className="text-neon-purple font-semibold text-neon-glow">Secure Gateway</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-500">Instant Delivery</span>
        </div>
      </div>

      {/* Demo Warning Banner */}
      {orderDetails.isDemo && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm flex items-start sm:items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-yellow-200/90">
            <strong>Viewing Checkout Redirect Demo:</strong> Direct page visit detected. Standard checkout context loaded for visual demonstration. Feel free to interact!
          </p>
        </motion.div>
      )}

      {/* ── PAGE LAYOUT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT & MAIN SECTION (8 COLS) ── */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
          
          {/* Main Card: Order Configuration & Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card relative overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-neon-purple/[0.06] via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              
              {/* Product floating preview card container */}
              <div className="relative group shrink-0 w-44 sm:w-52 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/[0.08]">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent z-10" />
                <motion.img 
                  src={orderDetails.product.image} 
                  alt={orderDetails.product.name}
                  className="w-full h-full object-cover z-0"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                {/* Floating shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-20 pointer-events-none" />
              </div>

              {/* Product information details */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                  <Zap className="w-3 h-3 text-neon-cyan animate-pulse" /> Instant Email Delivery
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
                  {orderDetails.product.name} <span className="text-gradient">Gift Card</span>
                </h1>
                
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  Plan selected: <span className="text-white font-semibold">{orderDetails.package.label}</span>
                </p>

                {/* Email Display in Cyberpunk input box */}
                <div className="w-full mt-5 bg-dark-900/60 border border-white/[0.04] rounded-xl p-3.5 flex flex-col gap-1 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-neon-purple" />
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    {orderDetails.product.codeType || 'Recipient Email Address'}
                  </span>
                  <span className="text-sm font-semibold text-white/90 break-all select-all font-mono">
                    {orderDetails.accountEmail}
                  </span>
                </div>

                {/* Secure Payment badges grid */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-xs text-gray-500 font-medium border-t border-white/[0.04] pt-5 w-full">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    100% Encrypted Escrow
                  </span>
                  <span className="text-gray-700">|</span>
                  <span className="flex items-center gap-1.5 text-neon-cyan">
                    <Lock className="w-3.5 h-3.5 text-neon-cyan" />
                    Anti-Fraud Check OK
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── CHOOSE CONTACT & REDIRECT SYSTEM ── */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <span className="h-1.5 w-6 rounded bg-neon-purple inline-block" />
                Select Instant Support Gateway
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Choose a platform below. Your order details will be securely bundled and auto-filled.
              </p>
            </div>

            {/* Platform Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* WhatsApp Card */}
              <motion.button
                onClick={() => setLoadingPlatform('WhatsApp')}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group text-left rounded-xl p-5 border bg-dark-900/60 hover:bg-green-950/10 transition-all duration-300 relative overflow-hidden min-h-[115px]"
                style={{ borderColor: 'rgba(37, 211, 102, 0.08)' }}
              >
                {/* Custom glowing hover border aura */}
                <div className="absolute inset-0 bg-green-500/[0.01] group-hover:bg-green-500/[0.03] transition-colors duration-300" />
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-green-500/[0.02] rounded-full blur-xl group-hover:bg-green-500/[0.08] transition-all duration-500" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(37, 211, 102, 0.05)] group-hover:shadow-[0_0_20px_rgba(37, 211, 102, 0.2)]">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Fastest Response
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-green-400 transition-colors duration-300">WhatsApp</h3>
              </motion.button>

              {/* Instagram Card */}
              <motion.button
                onClick={() => setLoadingPlatform('Instagram')}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group text-left rounded-xl p-5 border bg-dark-900/60 hover:bg-pink-950/10 transition-all duration-300 relative overflow-hidden min-h-[115px]"
                style={{ borderColor: 'rgba(225, 48, 108, 0.08)' }}
              >
                <div className="absolute inset-0 bg-pink-500/[0.01] group-hover:bg-pink-500/[0.03] transition-colors duration-300" />
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-pink-500/[0.02] rounded-full blur-xl group-hover:bg-pink-500/[0.08] transition-all duration-500" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-500/20 group-hover:border-pink-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(225, 48, 108, 0.05)] group-hover:shadow-[0_0_20px_rgba(225, 48, 108, 0.2)]">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    DM Us Instantly
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors duration-300">Instagram</h3>
              </motion.button>

              {/* Facebook Card */}
              <motion.button
                onClick={() => setLoadingPlatform('Facebook')}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group text-left rounded-xl p-5 border bg-dark-900/60 hover:bg-blue-950/10 transition-all duration-300 relative overflow-hidden min-h-[115px]"
                style={{ borderColor: 'rgba(0, 132, 255, 0.08)' }}
              >
                <div className="absolute inset-0 bg-blue-500/[0.01] group-hover:bg-blue-500/[0.03] transition-colors duration-300" />
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-500/[0.02] rounded-full blur-xl group-hover:bg-blue-500/[0.08] transition-all duration-500" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(0, 132, 255, 0.05)] group-hover:shadow-[0_0_20px_rgba(0, 132, 255, 0.2)]">
                    <Facebook className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    24/7 Chat Help
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors duration-300">Facebook</h3>
              </motion.button>

            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: ORDER SUMMARY SIDEBAR (5 COLS) ── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card border border-white/[0.08] p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-neon-cyan/[0.04] rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-white mb-5 flex items-center gap-2">
              <ShoppingCart className="w-4.5 h-4.5 text-neon-purple" />
              Order Summary
            </h2>
            
            {/* Items display */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm pb-4 border-b border-white/[0.04]">
                <div>
                  <h4 className="font-bold text-white">{orderDetails.product.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{orderDetails.package.label}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">Rs. {orderDetails.package.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Reactive Interactive Quantity Selector */}
              <div className="flex justify-between items-center bg-dark-900/40 border border-white/[0.04] p-3 rounded-xl">
                <span className="text-xs text-gray-400 font-medium">Quantity Selection</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={decrementQty}
                    className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] active:scale-90 border border-white/[0.06] flex items-center justify-center transition-all duration-200"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3 text-white" />
                  </button>
                  <span className="font-mono font-bold text-white text-sm w-5 text-center">{quantity}</span>
                  <button 
                    onClick={incrementQty}
                    className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] active:scale-90 border border-white/[0.06] flex items-center justify-center transition-all duration-200"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Detailed Cost Calculations */}
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manual Escrow Fee</span>
                  <span className="text-green-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Instant Delivery Time</span>
                  <span className="text-neon-cyan font-medium">Under 60s</span>
                </div>
              </div>

              {/* Neon glow separation line */}
              <div className="neon-divider my-2" />

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-xs uppercase font-extrabold text-gray-500 tracking-wider">Final Total</span>
                  <p className="text-[10px] text-gray-600">All local taxes included</p>
                </div>
                <span className="text-2xl font-black text-gradient">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Main Checkout Action triggering WhatsApp by default */}
            <motion.button 
              onClick={() => setLoadingPlatform('WhatsApp')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              id="confirm-checkout-btn"
            >
              <Zap className="w-4 h-4 fill-current animate-pulse text-white" />
              Secure Checkout Redirection
            </motion.button>
            
            <p className="text-[10px] text-center text-gray-500 mt-3 leading-relaxed">
              By initiating checkout, you will be redirected to the secure instant messenger gateway to finalize manual billing instructions.
            </p>
          </motion.div>
          
          {/* Trust badges footer panel */}
          <div className="glass-card border border-white/[0.04] p-4 text-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-extrabold mb-3.5 block">100% Certified Safe Store</span>
            <div className="flex items-center justify-center gap-5 filter grayscale opacity-45 hover:opacity-90 hover:grayscale-0 transition-all duration-300">
              <img src="/images/pay-esewa.png" alt="eSewa" className="h-6 object-contain" />
              <img src="/images/pay-khalti.png" alt="Khalti" className="h-5 object-contain" />
              <img src="/images/pay-bank.png" alt="Bank Transfer" className="h-6 object-contain" />
            </div>
          </div>

        </div>

      </div>

      {/* ── FAQ SUPPORT CONTAINER ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 glass-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-neon-purple" />
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the manual checkout and delivery work?",
              a: "Once you select one of our support channels (WhatsApp, Instagram, or Facebook), our automation prepares a pre-filled transaction form. Click connect, and one of our dedicated support experts will immediately send you localized payment options (eSewa, Khalti, or Bank Transfer details). Provide the screenshot, and we instantly credit the code."
            },
            {
              q: "What payment platforms do you support?",
              a: "We natively support eSewa, Khalti, IME Pay, and direct bank transfers from all Nepalese banks. The support assistant will provide details once you connect."
            },
            {
              q: "When will I receive my digital gift card?",
              a: "In 98% of cases, once you transmit your confirmation receipt, our automated backend verifies it and releases the digital code to your selected delivery email address in under 60 seconds."
            },
            {
              q: "Are my details and transaction secure?",
              a: "Absolutely. All transactions are routed manually via double-factor encrypted support desks. Your recipient email is never shared, and codes are generated directly from official product aggregators."
            }
          ].map((faq, idx) => (
            <div 
              key={idx} 
              className="border-b border-white/[0.04] pb-4 last:border-0 last:pb-0"
            >
              <button 
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between text-left py-2 hover:text-neon-cyan transition-colors duration-200"
              >
                <span className="font-bold text-sm sm:text-base text-white/90">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${activeFAQ === idx ? 'rotate-180 text-neon-cyan' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFAQ === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs sm:text-sm text-gray-400 pt-2 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── HIGH TECH TERMINAL LOADING REDIRECT OVERLAY ── */}
      <AnimatePresence>
        {loadingPlatform && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-xl rounded-2xl border bg-dark-900 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden"
              style={{ 
                borderColor: 
                  loadingPlatform === 'WhatsApp' ? 'rgba(34, 197, 94, 0.2)' : 
                  loadingPlatform === 'Instagram' ? 'rgba(236, 72, 153, 0.2)' : 
                  'rgba(59, 130, 246, 0.2)' 
              }}
            >
              
              {/* Outer neon background breathing aura */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] transition-all duration-300"
                style={{
                  background: 
                    loadingPlatform === 'WhatsApp' ? 'radial-gradient(circle at center, #22c55e, transparent)' :
                    loadingPlatform === 'Instagram' ? 'radial-gradient(circle at center, #ec4899, transparent)' :
                    'radial-gradient(circle at center, #3b82f6, transparent)'
                }}
              />

              {/* Dialog Header */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border animate-pulse"
                  style={{
                    backgroundColor: 
                      loadingPlatform === 'WhatsApp' ? 'rgba(34, 197, 94, 0.1)' : 
                      loadingPlatform === 'Instagram' ? 'rgba(236, 72, 153, 0.1)' : 
                      'rgba(59, 130, 246, 0.1)',
                    borderColor: 
                      loadingPlatform === 'WhatsApp' ? 'rgba(34, 197, 94, 0.3)' : 
                      loadingPlatform === 'Instagram' ? 'rgba(236, 72, 153, 0.3)' : 
                      'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {loadingPlatform === 'WhatsApp' && <MessageCircle className="w-5 h-5 text-green-400" />}
                  {loadingPlatform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-400" />}
                  {loadingPlatform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-400" />}
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                    Connecting Secure Tunnel
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Redirecting to Karma Support Desk on {loadingPlatform}
                  </p>
                </div>
              </div>

              {/* Progress Dial & Loading Spinner */}
              <div className="flex flex-col items-center justify-center py-4 relative">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Pulse background */}
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-15"
                    style={{
                      backgroundColor: 
                        loadingPlatform === 'WhatsApp' ? '#22c55e' : 
                        loadingPlatform === 'Instagram' ? '#ec4899' : 
                        '#3b82f6'
                    }}
                  />
                  
                  {/* Glowing core indicator */}
                  <div 
                    className="w-14 h-14 rounded-full bg-dark-900 border flex items-center justify-center shadow-lg"
                    style={{ 
                      borderColor: 
                        loadingPlatform === 'WhatsApp' ? '#22c55e' : 
                        loadingPlatform === 'Instagram' ? '#ec4899' : 
                        '#3b82f6' 
                    }}
                  >
                    <span className="font-mono text-sm font-black text-white">
                      {loadingProgress}%
                    </span>
                  </div>
                </div>
              </div>


              {/* Security progress line */}
              <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                <motion.div 
                  className="h-full rounded-full"
                  style={{
                    width: `${loadingProgress}%`,
                    background: 
                      loadingPlatform === 'WhatsApp' ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 
                      loadingPlatform === 'Instagram' ? 'linear-gradient(90deg, #ec4899, #f472b6)' : 
                      'linear-gradient(90deg, #3b82f6, #60a5fa)'
                  }}
                />
              </div>

              {/* Security footer disclaimer */}
              <div className="flex items-center gap-2 justify-center text-[10px] text-gray-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span>ANTI-FRAUD CRYPTO ENVELOPE SECURED BY KARMA PROTOCOL</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
