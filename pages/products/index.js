import { useState } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/dataStore';

const CATEGORIES = ['All', 'Living Room', 'Dining Room', 'Bedroom', 'Office'];

export default function ProductsPage({ products }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
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

export async function getServerSideProps() {
  return { props: { products: getProducts() } };
}
