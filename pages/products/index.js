import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/clientStore';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

const CATEGORIES = ['All', 'Living Room', 'Dining Room', 'Bedroom', 'Office'];
const CATEGORY_BG = {
  'Living Room': 'from-amber-100 to-amber-200',
  'Dining Room': 'from-orange-100 to-orange-200',
  Bedroom: 'from-purple-100 to-purple-200',
  Office: 'from-blue-100 to-blue-200',
};

function ProductDetail({ product }) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const cartItem = items.find((i) => i.id === product.id && i.type === 'product');

  const handleAdd = () => {
    addItem({ id: product.id, type: 'product', name: product.name, price: product.price, image: product.image, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 mb-6 transition-colors">
          &larr; Back to Products
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`rounded-2xl overflow-hidden h-96 bg-gradient-to-br ${CATEGORY_BG[product.category] || 'from-stone-100 to-stone-200'}`}>
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-3xl font-bold text-stone-900 mt-1">{product.name}</h1>
            </div>
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-stone-900">${product.price.toLocaleString()}</span>
              {product.stock > 0 ? (
                <span className="text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1 rounded-full">
                  {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
                {product.stock === 0 ? 'Sold Out' : added ? 'Added!' : 'Add to Cart'}
              </button>
              {cartItem && (
                <Link href="/cart">
                  <a className="px-6 py-3 border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-semibold rounded-xl transition-colors">
                    View Cart ({cartItem.qty})
                  </a>
                </Link>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 py-4 border-t border-stone-100">
              {[
                { label: 'Free Shipping', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                { label: '30-Day Returns', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                { label: '2-Year Warranty', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="text-xs text-stone-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setReady(true);
  }, []);

  if (!ready) return <Layout><div className="flex justify-center py-24 text-stone-400">Loading...</div></Layout>;

  const { id } = router.query;
  if (id) {
    const product = products.find((p) => p.id === id);
    if (!product) return <Layout><div className="text-center py-24 text-stone-400">Product not found.</div></Layout>;
    return <ProductDetail product={product} />;
  }

  const filtered = products
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">All Products</h1>
          <p className="text-stone-500 mt-2">Browse our complete furniture collection</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              {c}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
