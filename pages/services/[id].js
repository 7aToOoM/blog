import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { getService } from '../../lib/dataStore';
import Link from 'next/link';
import { useState } from 'react';

const SERVICE_BG = ['from-teal-100 to-teal-200', 'from-sky-100 to-sky-200', 'from-rose-100 to-rose-200', 'from-violet-100 to-violet-200'];

export default function ServiceDetail({ service, idx }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const cartItem = items.find((i) => i.id === service.id && i.type === 'service');
  const bg = SERVICE_BG[idx % SERVICE_BG.length];

  const handleBook = () => {
    addItem({ id: service.id, type: 'service', name: service.name, price: service.price, image: service.image, duration: service.duration });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/services">
          <a className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 mb-6 transition-colors">
            &larr; Back to Services
          </a>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`rounded-2xl h-80 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`}>
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-28 h-28 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-stone-900">{service.name}</h1>
            {service.duration && (
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration}
              </div>
            )}
            <p className="text-stone-600 leading-relaxed">{service.description}</p>
            <div className="text-3xl font-bold text-stone-900 mt-2">${service.price.toLocaleString()}</div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleBook}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {added ? 'Added to Cart!' : 'Book This Service'}
              </button>
              {cartItem && (
                <Link href="/cart">
                  <a className="px-6 py-3 border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-semibold rounded-xl transition-colors">
                    View Cart
                  </a>
                </Link>
              )}
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-800">
                After booking, our team will contact you within 24 hours to schedule and confirm details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { getServices } = require('../../lib/dataStore');
  const services = getServices();
  const idx = services.findIndex((s) => s.id === params.id);
  if (idx === -1) return { notFound: true };
  return { props: { service: services[idx], idx } };
}
