import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { addOrder } from '../lib/clientStore';
import Link from 'next/link';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
          <Link href="/products"><a className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold">Browse Products</a></Link>
        </div>
      </Layout>
    );
  }

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.zip) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const order = addOrder({
        id: `ord${Date.now()}`,
        customer: { name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone },
        items: items.map((i) => ({ id: i.id, name: i.name, type: i.type, price: i.price, qty: i.qty })),
        total: totalPrice,
        address: { street: form.address, city: form.city, state: form.state, zip: form.zip },
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      clearCart();
      router.push(`/order-success?id=${order.id}`);
    } catch {
      setSubmitting(false);
    }
  };

  const Field = ({ label, id, type = 'text', half = false, ...props }) => (
    <div className={half ? 'col-span-1' : 'col-span-2 sm:col-span-2'}>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        type={type}
        {...props}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors[id] ? 'border-red-400' : 'border-stone-300'}`}
      />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <h2 className="font-semibold text-stone-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" id="firstName" half value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="John" />
                <Field label="Last Name" id="lastName" half value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Doe" />
                <Field label="Email" id="email" type="email" half value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@example.com" />
                <Field label="Phone (optional)" id="phone" type="tel" half value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <h2 className="font-semibold text-stone-900 mb-4">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Street Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="123 Main Street, Apt 4B"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.address ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                  <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.city ? 'border-red-400' : 'border-stone-300'}`} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                  <input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NY" className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">ZIP Code</label>
                  <input value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="10001" className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.zip ? 'border-red-400' : 'border-stone-300'}`} />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 text-sm text-amber-800">
              <strong>Demo Store:</strong> No real payment is required. Submitting will create a demo order.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              {submitting ? 'Placing Order...' : `Place Order — $${totalPrice.toLocaleString()}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm h-fit sticky top-24">
            <h2 className="font-semibold text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                  <span className="text-stone-600 truncate mr-2">{item.name} × {item.qty}</span>
                  <span className="text-stone-900 font-medium shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
