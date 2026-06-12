import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import ImageUpload from '../../../components/ImageUpload';
import { getProduct } from '../../../lib/dataStore';

const CATEGORIES = ['Living Room', 'Dining Room', 'Bedroom', 'Office', 'Outdoor', 'Kids'];

export default function EditProduct({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: String(product.price),
    category: product.category,
    image: product.image || '',
    stock: String(product.stock),
    featured: product.featured,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) || 0 }),
    });
    if (res.ok) {
      router.push('/admin/products');
    } else {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.name ? 'border-red-400' : 'border-stone-300'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.price ? 'border-red-400' : 'border-stone-300'}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <ImageUpload value={form.image} onChange={(url) => set('image', url)} label="Product Image" />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <label htmlFor="featured" className="text-sm text-stone-700">Featured on homepage</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({ params }) {
  const product = getProduct(params.id);
  if (!product) return { notFound: true };
  return { props: { product } };
}
