import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const { isAdmin, logout } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-stone-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xl tracking-tight">
                LUXE<span className="text-white">FURNISH</span>
              </span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/products"><a className="hover:text-amber-400 transition-colors">Products</a></Link>
            <Link href="/services"><a className="hover:text-amber-400 transition-colors">Services</a></Link>
            {isAdmin && <Link href="/admin"><a className="hover:text-amber-400 transition-colors">Admin</a></Link>}
            {!isAdmin && <Link href="/admin/login"><a className="hover:text-amber-400 transition-colors text-amber-200">Admin</a></Link>}
            {isAdmin && (
              <button onClick={logout} className="hover:text-amber-400 transition-colors">
                Logout
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <a className="relative p-2 hover:text-amber-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </a>
            </Link>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-800 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/products"><a className="py-2 hover:text-amber-400" onClick={() => setMenuOpen(false)}>Products</a></Link>
          <Link href="/services"><a className="py-2 hover:text-amber-400" onClick={() => setMenuOpen(false)}>Services</a></Link>
          {isAdmin && <Link href="/admin"><a className="py-2 hover:text-amber-400" onClick={() => setMenuOpen(false)}>Admin</a></Link>}
          {!isAdmin && <Link href="/admin/login"><a className="py-2 hover:text-amber-400" onClick={() => setMenuOpen(false)}>Admin Login</a></Link>}
          {isAdmin && <button onClick={() => { logout(); setMenuOpen(false); }} className="py-2 text-left hover:text-amber-400">Logout</button>}
        </div>
      )}
    </header>
  );
}
