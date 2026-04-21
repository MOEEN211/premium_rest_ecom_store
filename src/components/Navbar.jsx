import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, User, Search } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount, toggleCart } = useContext(CartContext);
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Mattresses', path: '/shop?category=mattress' },
    { name: 'Beds', path: '/shop?category=bed' },
    { name: 'Sofas', path: '/shop?category=sofa' },
    { name: 'Articles', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-[#4a9d9c] text-white text-[10px] md:text-sm py-2 px-4 flex justify-between items-center font-medium">
        <p>Dream Deals – Get 50% Off on All Beds</p>
        <div className="flex items-center gap-4">
          <a href="tel:+447933831237" className="flex items-center gap-2 hover:text-slate-100 transition">
            <Phone size={14} /> <span className="hidden sm:inline">+44 7933 831237</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col leading-tight">
              <span className="text-3xl font-serif text-slate-900 tracking-tight">Elitebed.uk</span>
              <span className="text-[11px] text-gray-500 mt-0.5">Luxury beds. Better sleep.</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-gray-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Search Bar Desktop */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative flex items-center animate-in fade-in slide-in-from-right-4 duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-[#4a9d9c] w-48"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-400 hover:text-slate-900">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-600 hover:text-slate-900 transition-colors" aria-label="Open search">
                  <Search size={22} />
                </button>
              )}
            </div>

            <button onClick={toggleCart} className="text-gray-600 hover:text-slate-900 relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <User size={24} className={user ? "text-emerald-600" : "text-gray-400"} />
              {user && <span className="text-xs font-medium text-gray-600 hidden lg:block">{user.email}</span>}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 mr-2" aria-label="Toggle search">
              <Search size={24} />
            </button>
            <button onClick={toggleCart} className="text-gray-600 relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <div className="flex items-center">
              <User size={24} className={user ? "text-emerald-600" : "text-gray-400"} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#4a9d9c]"
              autoFocus
            />
            <button type="submit" className="absolute right-3 text-gray-400">
              <Search size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
