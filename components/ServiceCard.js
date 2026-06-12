import Link from 'next/link';
import { useCart } from '../context/CartContext';

const SERVICE_ICONS = [
  { bg: 'from-teal-100 to-teal-200', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { bg: 'from-sky-100 to-sky-200', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { bg: 'from-rose-100 to-rose-200', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  { bg: 'from-violet-100 to-violet-200', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
];

export default function ServiceCard({ service, index = 0 }) {
  const { addItem } = useCart();
  const iconData = SERVICE_ICONS[index % SERVICE_ICONS.length];

  const handleBookNow = (e) => {
    e.preventDefault();
    addItem({
      id: service.id,
      type: 'service',
      name: service.name,
      price: service.price,
      image: service.image,
      duration: service.duration,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-stone-100 flex flex-col">
      <Link href={`/services/${service.id}`}>
        <a className="block">
          <div className={`h-44 bg-gradient-to-br ${iconData.bg} flex items-center justify-center`}>
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconData.icon} />
              </svg>
            )}
          </div>
        </a>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/services/${service.id}`}>
          <a>
            <h3 className="font-semibold text-stone-900 hover:text-amber-700 transition-colors">{service.name}</h3>
          </a>
        </Link>
        {service.duration && (
          <span className="text-xs text-stone-400 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {service.duration}
          </span>
        )}
        <p className="text-stone-500 text-sm mt-2 line-clamp-2 flex-1">{service.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-stone-900">${service.price.toLocaleString()}</span>
          <button
            onClick={handleBookNow}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
