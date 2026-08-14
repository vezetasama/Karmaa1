import { Link } from 'react-router-dom';
import { Zap, Star, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const lowestPrice = product.packages?.length
    ? Math.min(...product.packages.map((p) => p.price))
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block relative rounded-2xl border border-white/[0.05] bg-dark-800/40 backdrop-blur-sm overflow-hidden transition-all duration-400 hover:border-white/[0.12] hover:-translate-y-2 hover:shadow-card-glow"
      id={`product-card-${product.slug}`}
    >
      {/* Image Section */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${product.bannerColor}18 0%, ${product.bannerColor}08 50%, transparent 100%)`,
          }}
        />

        {/* Decorative orb */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: product.bannerColor }}
        />

        {/* Game icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
            style={{
              background: `linear-gradient(135deg, ${product.bannerColor}, ${product.bannerColor}88)`,
              boxShadow: `0 0 30px ${product.bannerColor}30, 0 8px 25px ${product.bannerColor}20`,
            }}
          >
            {product.name.charAt(0)}
          </div>
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-dark-900/60 backdrop-blur-xl border border-neon-cyan/20 rounded-full">
            <Star className="w-3 h-3 text-neon-cyan fill-neon-cyan" />
            <span className="text-[10px] font-semibold text-neon-cyan uppercase tracking-wider">Featured</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-white group-hover:text-gradient transition-all duration-300 tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-5">
          <div>
            <span className="text-[11px] text-gray-600 uppercase tracking-wider font-medium">Starting from</span>
            <p className="text-lg font-bold text-neon-cyan">
              Rs. {lowestPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-300 bg-neon-purple/10 border border-neon-purple/15 text-neon-purple-light group-hover:bg-neon-purple group-hover:text-white group-hover:border-neon-purple group-hover:shadow-glow-purple">
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </div>
        </div>

        {/* Packages info */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-[11px] text-gray-600">
            {product.packages?.length || 0} packages available
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-neon-purple group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
}
