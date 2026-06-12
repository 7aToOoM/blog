import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdmin } from '../../context/AdminContext';
import Link from 'next/link';

export default function AdminLogin() {
  const { login, isAdmin, checked } = useAdmin();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (checked && isAdmin) router.replace('/admin');
  }, [isAdmin, checked, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      router.push('/admin');
    } else {
      setError('Incorrect password. Try: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/"><a className="text-amber-500 font-bold text-2xl">LUXE<span className="text-stone-900">FURNISH</span></a></Link>
          <p className="text-stone-500 text-sm mt-2">Admin Panel</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h1 className="text-xl font-bold text-stone-900 mb-6">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-xs text-stone-400 text-center">
            Default password: <code className="bg-stone-100 px-1 py-0.5 rounded">admin123</code>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link href="/"><a className="text-sm text-stone-400 hover:text-amber-600 transition-colors">&larr; Back to Store</a></Link>
        </div>
      </div>
    </div>
  );
}
