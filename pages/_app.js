import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { AdminProvider } from '../context/AdminContext';

function MyApp({ Component, pageProps }) {
  return (
    <AdminProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AdminProvider>
  );
}

export default MyApp;
