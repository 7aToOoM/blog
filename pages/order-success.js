import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function OrderSuccess() {
  const { query } = useRouter();

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">Order Placed!</h1>
        <p className="text-stone-500 mb-2">Thank you for your order. We&apos;ll be in touch shortly to confirm delivery details.</p>
        {query.id && (
          <p className="text-sm text-stone-400 mb-8">Order ID: <span className="font-mono font-medium text-stone-600">{query.id}</span></p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/products">
            <a className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Continue Shopping
            </a>
          </Link>
          <Link href="/">
            <a className="border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold px-6 py-3 rounded-xl transition-colors">
              Go Home
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
