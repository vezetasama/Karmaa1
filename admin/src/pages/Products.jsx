import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Gamepad2, CreditCard } from 'lucide-react';
import TopUps from '../components/TopUps';
import { getProducts } from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (search.trim()) params.search = search.trim();
        const res = await getProducts(params);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [category, search]);

  const setCategory = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const categories = [
    { key: '', label: 'All', icon: <Filter className="w-4 h-4" /> },
    { key: 'game-topup', label: 'Game Top-ups', icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'gift-card', label: 'Gift Cards', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const mappedItems = useMemo(
    () =>
      products.map((p) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        image: p.image || '/images/default-product.png',
        accent: p.bannerColor || '#6c5ce7',
        category: p.category,
      })),
    [products]
  );

  // Filter out itunes-apple-plus and combine all items into one continuous grid
  const allItems = mappedItems.filter((p) => p.slug !== 'itunes-apple-plus');

  return (
    <div className="pt-10 pb-3 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 sm:mt-16">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12 sm:mb-8">
          <div className="relative flex-1 w-full md:max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-purple transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11 !rounded-full"
              id="products-search"
            />
          </div>
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide mt-2 sm:mt-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${category === cat.key
                    ? 'bg-neon-purple text-white shadow-glow-purple'
                    : 'bg-dark-800/50 text-gray-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                  }`}
                id={`filter-${cat.key || 'all'}`}
              >
                {cat.icon}{cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/30 p-8 text-center text-gray-500">
            Loading products...
          </div>
        )}
        {!loading && allItems.length > 0 && <TopUps title="Products" items={allItems} showHeader={false} showControls={false} showTitle={false} isMobileGrid={true} desktopGrid={true} />}
        {!loading && allItems.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-dark-800/30 p-8 text-center text-gray-500">
            No products found.
          </div>
        )}

      </div>
    </div>
  );
}
