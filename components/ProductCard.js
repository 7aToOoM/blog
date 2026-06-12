import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CATEGORY_COLORS = {
  'Living Room': 'bg-amber-100 text-amber-800',
  'Dining Room': 'bg-orange-100 text-orange-800',
  Bedroom: 'bg-purple-100 text-purple-800',
  Office: 'bg-blue-100 text-blue-800',
};

const CATEGORY_BG = {
  'Living Room': 'from-amber-100 to-amber-200',
  'Dining Room': 'from-orange-100 to-orange-200',
  Bedroom: 'from-purple-100 to-purple-200',
  Office: 'from-blue-100 to-blue-200',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-stone-100 flex flex-col">
      <Link href={`/products/${product.id}`}>
        <a className="block">
          <div className={`h-52 bg-gradient-to-br ${CATEGORY_BG[product.category] || 'from-stone-100 to-stone-200'} relative`}>
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
            {product.stock <= 2 && product.stock > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-2 left-2 bg-stone-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </a>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`}>
            <a>
              <h3 className="font-semibold text-stone-900 hover:text-amber-700 transition-colors leading-tight">
                {product.name}
              </h3>
            </a>
          </Link>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[product.category] || 'bg-stone-100 text-stone-600'}`}>
            {product.category}
          </span>
        </div>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-stone-900">${product.price.toLocaleString()}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
