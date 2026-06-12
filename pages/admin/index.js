import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { getProducts, getServices, getOrders } from '../../lib/clientStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, services: 0, orders: 0, revenue: 0, recentOrders: [] });

  useEffect(() => {
    const products = getProducts();
    const services = getServices();
    const orders = getOrders();
    setStats({
      products: products.length,
      services: services.length,
      orders: orders.length,
      revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      recentOrders: [...orders].reverse().slice(0, 5),
    });
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, href: '/admin/products', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-600' },
    { label: 'Total Services', value: stats.services, href: '/admin/services', color: 'bg-teal-50 border-teal-200', textColor: 'text-teal-600' },
    { label: 'Total Orders', value: stats.orders, href: '/admin/orders', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-600' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, href: '/admin/orders', color: 'bg-green-50 border-green-200', textColor: 'text-green-600' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <a className={`rounded-2xl border ${card.color} p-6 hover:shadow-sm transition-shadow`}>
              <p className="text-sm text-stone-500 mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </a>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/products/new">
              <a className="flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-sm font-medium text-amber-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </a>
            </Link>
            <Link href="/admin/services/new">
              <a className="flex items-center gap-3 px-4 py-3 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors text-sm font-medium text-teal-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Service
              </a>
            </Link>
            <Link href="/admin/orders">
              <a className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-sm font-medium text-blue-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Orders
              </a>
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-stone-400 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-stone-900">{order.customer?.name}</p>
                    <p className="text-stone-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-stone-900">${order.total?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
