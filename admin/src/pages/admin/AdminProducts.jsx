import { useState, useEffect } from 'react';
import { Plus, Edit2, X, Save } from 'lucide-react';
import { getAdminProducts, updateAdminProduct } from '../../services/api';
import { PageLoader } from '../../components/Loader';

const emptyProduct = {
  name: '', slug: '', category: 'game-topup', description: '', image: '/images/default-product.png', bannerColor: '#a855f7',
  featured: false, isActive: true, packages: [{ label: '', amount: 0, price: 0, originalPrice: 0 }],
  inputFields: [{ name: 'userId', label: 'Player ID', placeholder: 'Enter your Player ID', required: true }],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try { const res = await getAdminProducts(); setProducts(res.data.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openEdit = (p) => { setEditing(p._id); setForm({ ...p, packages: p.packages?.length ? p.packages : [{ label: '', amount: 0, price: 0, originalPrice: 0 }], inputFields: p.inputFields?.length ? p.inputFields : [{ name: '', label: '', placeholder: '', required: true }] }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      if (editing) { await updateAdminProduct(editing, data); }
      setShowForm(false); fetchProducts();
    } catch (err) { console.error(err); alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const updatePkg = (i, field, val) => { const pkgs = [...form.packages]; pkgs[i] = { ...pkgs[i], [field]: field === 'label' ? val : Number(val) }; setForm({ ...form, packages: pkgs }); };
  const addPkg = () => setForm({ ...form, packages: [...form.packages, { label: '', amount: 0, price: 0, originalPrice: 0 }] });
  const removePkg = (i) => setForm({ ...form, packages: form.packages.filter((_, idx) => idx !== i) });

  const updateField = (i, field, val) => { const fields = [...form.inputFields]; fields[i] = { ...fields[i], [field]: field === 'required' ? val === 'true' : val }; setForm({ ...form, inputFields: fields }); };
  const addField = () => setForm({ ...form, inputFields: [...form.inputFields, { name: '', label: '', placeholder: '', required: true }] });
  const removeField = (i) => setForm({ ...form, inputFields: form.inputFields.filter((_, idx) => idx !== i) });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total (fixed list, edit only)</p>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className={`rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm p-5 ${!p.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/[0.08] bg-dark-900/60">
                <img
                  src={p.image || '/images/default-product.png'}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/default-product.png'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.category} • {p.packages?.length || 0} packages</p>
                <p className="text-[11px] text-gray-600 truncate">{p.slug}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {p.featured && <span className="text-[10px] px-1.5 py-0.5 bg-neon-cyan/10 text-neon-cyan rounded-full border border-neon-cyan/20">Featured</span>}
                {!p.isActive && <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Inactive</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-600 hover:text-neon-purple transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative rounded-2xl border border-white/[0.08] bg-dark-800/90 backdrop-blur-xl p-6 w-full max-w-2xl max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-600 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="Free Fire" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field text-sm" placeholder="free-fire (auto-generated)" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                    <option value="game-topup">Game Top-up</option>
                    <option value="gift-card">Gift Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Banner Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bannerColor} onChange={(e) => setForm({ ...form, bannerColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                    <input value={form.bannerColor} onChange={(e) => setForm({ ...form, bannerColor: e.target.value })} className="input-field text-sm flex-1" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm h-20 resize-none" placeholder="Product description..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Image Path</label>
                <input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field text-sm" placeholder="/images/topup-clash-royale.png" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-neon-purple" /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-neon-cyan" /> Active
                </label>
              </div>

              {/* Packages */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</label>
                  <button onClick={addPkg} className="text-xs text-neon-purple hover:text-neon-purple-light flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {form.packages.map((pkg, i) => (
                  <div key={i} className="flex flex-col md:grid md:grid-cols-5 gap-2 mb-3 md:mb-2 bg-dark-900/50 p-3 md:p-0 md:bg-transparent rounded-lg md:rounded-none border border-white/[0.04] md:border-0 relative">
                    {form.packages.length > 1 && (
                      <button onClick={() => removePkg(i)} className="absolute top-2 right-2 md:static md:hidden text-red-400 shrink-0"><X className="w-4 h-4" /></button>
                    )}
                    <input value={pkg.label} onChange={(e) => updatePkg(i, 'label', e.target.value)} className="input-field text-xs md:col-span-2 pr-8 md:pr-3" placeholder="Label" />
                    <div className="grid grid-cols-3 md:contents gap-2">
                      <input type="number" value={pkg.amount} onChange={(e) => updatePkg(i, 'amount', e.target.value)} className="input-field text-xs" placeholder="Amount" />
                      <input type="number" value={pkg.price} onChange={(e) => updatePkg(i, 'price', e.target.value)} className="input-field text-xs" placeholder="Price" />
                      <div className="flex items-center gap-1">
                        <input type="number" value={pkg.originalPrice || ''} onChange={(e) => updatePkg(i, 'originalPrice', e.target.value)} className="input-field text-xs w-full" placeholder="OG Price" />
                        {form.packages.length > 1 && <button onClick={() => removePkg(i)} className="hidden md:block text-red-400 shrink-0 ml-1"><X className="w-3.5 h-3.5" /></button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Input Fields</label>
                  <button onClick={addField} className="text-xs text-neon-purple hover:text-neon-purple-light flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {form.inputFields.map((f, i) => (
                  <div key={i} className="flex flex-col md:grid md:grid-cols-4 gap-2 mb-3 md:mb-2 bg-dark-900/50 p-3 md:p-0 md:bg-transparent rounded-lg md:rounded-none border border-white/[0.04] md:border-0 relative">
                     {form.inputFields.length > 1 && (
                      <button onClick={() => removeField(i)} className="absolute top-2 right-2 md:static md:hidden text-red-400 shrink-0"><X className="w-4 h-4" /></button>
                    )}
                    <input value={f.name} onChange={(e) => updateField(i, 'name', e.target.value)} className="input-field text-xs pr-8 md:pr-3" placeholder="name key" />
                    <input value={f.label} onChange={(e) => updateField(i, 'label', e.target.value)} className="input-field text-xs" placeholder="Label" />
                    <input value={f.placeholder} onChange={(e) => updateField(i, 'placeholder', e.target.value)} className="input-field text-xs" placeholder="Placeholder" />
                    <div className="flex items-center gap-1">
                      <select value={String(f.required)} onChange={(e) => updateField(i, 'required', e.target.value)} className="input-field text-xs w-full">
                        <option value="true">Required</option>
                        <option value="false">Optional</option>
                      </select>
                      {form.inputFields.length > 1 && <button onClick={() => removeField(i)} className="hidden md:block text-red-400 shrink-0 ml-1"><X className="w-3.5 h-3.5" /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.06]">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.description} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
