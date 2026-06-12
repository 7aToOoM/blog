import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import ImageUpload from '../../../components/ImageUpload';
import { getService, updateService } from '../../../lib/clientStore';

export default function EditService() {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!router.isReady) return;
    const service = getService(router.query.id);
    if (!service) { router.replace('/admin/services'); return; }
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration: service.duration || '',
      image: service.image || '',
      featured: service.featured,
    });
  }, [router.isReady, router.query.id]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateService(router.query.id, {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      image: form.image,
      featured: form.featured,
    });
    router.push('/admin/services');
  };

  if (!form) return <AdminLayout title="Edit Service"><div className="text-stone-400">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Edit Service">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Service Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.name ? 'border-red-400' : 'border-stone-300'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price ($) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.price ? 'border-red-400' : 'border-stone-300'}`} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Duration</label>
              <input value={form.duration} onChange={(e) => set('duration', e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <ImageUpload value={form.image} onChange={(url) => set('image', url)} label="Service Image" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-amber-500" />
            <label htmlFor="featured" className="text-sm text-stone-700">Featured on homepage</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Save Changes
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
