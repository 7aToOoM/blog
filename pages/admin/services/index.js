import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { getServices, deleteService } from '../../../lib/clientStore';

export default function AdminServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete this service?')) return;
    deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminLayout title="Services">
      <div className="flex justify-between items-center mb-6">
        <p className="text-stone-500 text-sm">{services.length} services</p>
        <Link href="/admin/services/new">
          <a className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </a>
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-stone-600 font-medium">Service</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium hidden sm:table-cell">Duration</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {services.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-stone-400">No services yet.</td></tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center overflow-hidden shrink-0">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-stone-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{s.duration || '—'}</td>
                  <td className="px-4 py-3 font-medium text-stone-900">${s.price.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {s.featured ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Yes</span>
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/services/edit?id=${s.id}`}>
                        <a className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors">Edit</a>
                      </Link>
                      <button onClick={() => handleDelete(s.id)}
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
