import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdmin } from '../context/AdminContext';
import { useEffect } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/admin/services', label: 'Services', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { href: '/admin/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

export default function AdminLayout({ children, title }) {
  const { isAdmin, checked, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (checked && !isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, checked, router]);

  if (!checked || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-56 bg-stone-900 text-stone-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-700">
          <Link href="/"><a className="text-amber-400 font-bold text-sm">LUXE<span className="text-white">FURNISH</span></a></Link>
          <p className="text-stone-500 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-amber-500 text-stone-900 font-semibold' : 'hover:bg-stone-800'}`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-stone-700">
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-stone-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-stone-900">{title}</h1>
          <Link href="/"><a className="text-sm text-stone-500 hover:text-amber-600 transition-colors">View Store &rarr;</a></Link>
        </div>
        <div className="p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
