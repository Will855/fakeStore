import '@/styles/globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/drawers/CartDrawer';
import SearchModal from '@/components/drawers/SearchModal';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import ActiveOrderModal from '@/components/drawers/ActiveOrderModal';
import ToastNotification from '@/components/common/ToastNotification';

export const metadata = {
  title: 'FakeStore.VE - Tienda Virtual en Venezuela',
  description: 'Catálogo de productos en USD con conversión automática a Bolívares (tasa BCV del día) y cierre de orden por WhatsApp.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white text-slate-800 antialiased min-h-screen flex flex-col justify-between">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <CheckoutModal />
          <ActiveOrderModal />
          <ToastNotification />
        </StoreProvider>
      </body>
    </html>
  );
}
