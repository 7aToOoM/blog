import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getOrders, updateOrderStatus } from '../../../lib/clientStore';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStatus = (id, status) => {
    updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AdminLayout title="Orders">
      <div className="mb-6">
        <p className="text-stone-500 text-sm">{orders.length} total orders</p>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center text-stone-400">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {[...orders].reverse().map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <p className="font-medium text-stone-900">{order.customer?.name}</p>
                    <p className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-stone-400 font-mono hidden sm:block truncate">{order.id}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[order.status] || 'bg-stone-100 text-stone-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-stone-900">${order.total?.toLocaleString()}</span>
                  <svg className={`w-4 h-4 text-stone-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expanded === order.id && (
                <div className="px-4 pb-4 border-t border-stone-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Customer</h3>
                      <p className="text-sm text-stone-700">{order.customer?.name}</p>
                      <p className="text-sm text-stone-500">{order.customer?.email}</p>
                      {order.customer?.phone && <p className="text-sm text-stone-500">{order.customer.phone}</p>}
                      {order.address && (
                        <p className="text-sm text-stone-500 mt-1">
                          {order.address.street}, {order.address.city} {order.address.state} {order.address.zip}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Items</h3>
                      <div className="space-y-1">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-stone-700">{item.name} × {item.qty}</span>
                            <span className="text-stone-500">${(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-stone-600 mr-2">Update Status:</span>
                    {['pending', 'confirmed', 'delivered', 'cancelled'].map((s) => (
                      <button key={s} onClick={() => handleStatus(order.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${order.status === s ? `${STATUS_STYLES[s]} font-semibold` : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
