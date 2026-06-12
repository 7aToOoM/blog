import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { getProducts, deleteProduct } from '../../../lib/clientStore';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete this product?')) return;
    deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-between items-center mb-6">
        <p className="text-stone-500 text-sm">{products.length} products</p>
        <Link href="/admin/products/new">
          <a className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </a>
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-stone-600 font-medium">Product</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Stock</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-stone-400">No products yet. Add your first product.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-stone-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-stone-900">${p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {p.featured ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Yes</span>
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/products/edit?id=${p.id}`}>
                        <a className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors">Edit</a>
                      </Link>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
