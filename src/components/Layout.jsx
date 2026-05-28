import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartSidebar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
