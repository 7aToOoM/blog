import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-amber-400 font-bold text-lg">LUXE<span className="text-white">FURNISH</span></span>
            <p className="mt-3 text-sm text-stone-400">
              Crafting spaces that tell your story. Premium furniture and expert design services.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products"><a className="hover:text-amber-400 transition-colors">All Products</a></Link></li>
              <li><Link href="/services"><a className="hover:text-amber-400 transition-colors">Services</a></Link></li>
              <li><Link href="/cart"><a className="hover:text-amber-400 transition-colors">Cart</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Design Street, Suite 400</li>
              <li>New York, NY 10001</li>
              <li className="hover:text-amber-400">hello@luxefurnish.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-stone-700 text-sm text-stone-500 text-center">
          &copy; {new Date().getFullYear()} LuxeFurnish. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
