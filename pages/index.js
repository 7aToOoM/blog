import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import Link from 'next/link';
import { getProducts, getServices } from '../lib/dataStore';

export default function Home({ featuredProducts, featuredServices }) {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-start gap-6">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Premium Furniture</span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
            Craft Your Perfect Living Space
          </h1>
          <p className="text-stone-300 text-lg max-w-xl">
            Discover hand-selected furniture and expert design services that transform houses into homes.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/products">
              <a className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Shop Now
              </a>
            </Link>
            <Link href="/services">
              <a className="border border-stone-500 hover:border-stone-300 text-stone-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Our Services
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-500 text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Products' },
            { value: '15+', label: 'Years Experience' },
            { value: '10K+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Featured Products</h2>
            <p className="text-stone-500 mt-1">Handpicked pieces for every home</p>
          </div>
          <Link href="/products">
            <a className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">View all &rarr;</a>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Need help designing your space?</h2>
            <p className="text-stone-500 mt-2">Our expert interior designers are ready to help you create the home of your dreams.</p>
          </div>
          <Link href="/services">
            <a className="shrink-0 bg-stone-900 hover:bg-stone-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Explore Services
            </a>
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Our Services</h2>
            <p className="text-stone-500 mt-1">Professional design and delivery services</p>
          </div>
          <Link href="/services">
            <a className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">View all &rarr;</a>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const products = getProducts();
  const services = getServices();
  return {
    props: {
      featuredProducts: products.filter((p) => p.featured).slice(0, 3),
      featuredServices: services.filter((s) => s.featured).slice(0, 3),
    },
  };
}
