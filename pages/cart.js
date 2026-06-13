import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <svg className="w-24 h-24 mx-auto text-stone-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products">
            <a className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Products
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-start gap-4 shadow-sm">
                <div className="w-20 h-20 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${item.type === 'service' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.type === 'service' ? 'Service' : item.category || 'Product'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.type, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.type, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-stone-900">${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-stone-400 hover:text-red-500 transition-colors">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm h-fit sticky top-24">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm text-stone-600">
                  <span className="truncate mr-2">{item.name} × {item.qty}</span>
                  <span className="shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">Taxes and shipping calculated at checkout</p>
            </div>
            <Link href="/checkout">
              <a className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors">
                Proceed to Checkout
              </a>
            </Link>
            <Link href="/products">
              <a className="w-full block text-center mt-3 text-sm text-stone-500 hover:text-amber-600 transition-colors">
                Continue Shopping
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
