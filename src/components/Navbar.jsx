import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, toggleCart } = useContext(CartContext);
  
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 5 Hours countdown resettable timer logic
    const duration = 5 * 60 * 60 * 1000; 

    function updateTimer() {
      const storedEndTime = localStorage.getItem('timerEndTime');
      let endTime;
      
      if (!storedEndTime) {
        endTime = new Date().getTime() + duration;
        localStorage.setItem('timerEndTime', endTime.toString());
      } else {
        endTime = parseInt(storedEndTime, 10);
      }

      let remaining = endTime - new Date().getTime();

      // Reset timer if elapsed
      if (remaining <= 0) {
        endTime = new Date().getTime() + duration;
        localStorage.setItem('timerEndTime', endTime.toString());
        remaining = duration;
      }

      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / 1000 / 60) % 60);
      const s = Math.floor((remaining / 1000) % 60);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <nav className="bg-white w-full border-b border-gray-200 font-sans">
      {/* Top Countdown Banner */}
      <div className="bg-[#1a193f] text-white text-xs md:text-sm py-2.5 px-4 flex justify-center items-center font-bold tracking-wide">
        <p className="flex items-center gap-1 flex-nowrap justify-center text-[10px] sm:text-sm">
          <span className="whitespace-nowrap">SALE UP TO 50% OFF</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="bg-white text-[#1a193f] px-1 py-0.5 rounded text-[10px] font-bold">{pad(timeLeft.hours)}</span>
          <span className="whitespace-nowrap">HRS</span>
          <span className="bg-white text-[#1a193f] px-1 py-0.5 rounded text-[10px] font-bold">{pad(timeLeft.minutes)}</span>
          <span className="whitespace-nowrap">MIN</span>
          <span className="bg-white text-[#1a193f] px-1 py-0.5 rounded text-[10px] font-bold">{pad(timeLeft.seconds)}</span>
          <span className="whitespace-nowrap">SEC</span>
        </p>
      </div>

      {/* Main Navbar — single row: Logo | Nav Links | Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">

          {/* LEFT: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none mt-1">
                <span className="text-[28px] font-black tracking-tighter text-[#1a193f]">PremiumRest.uk</span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#1a193f] text-left">FURNITURE</span>
              </div>
            </Link>
          </div>

          {/* CENTER: Nav links (desktop only) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-9">
            <Link to="/" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Home</Link>
            <Link to="/shop" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Shop</Link>
            <Link to="/shop?category=divan-beds" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Divan Beds</Link>
            <Link to="/shop?category=ottoman-beds" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Ottoman Beds</Link>
            <Link to="/shop?category=frame-beds" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Frame Beds</Link>
            <Link to="/shop?category=modern-beds" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Modern Beds</Link>
            <Link to="/shop?category=mattress" className="text-[#1a193f] hover:text-black font-bold text-[15px] transition-colors">Mattresses</Link>
          </div>

          {/* RIGHT: Cart + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Cart Icon */}
            <button onClick={toggleCart} className="text-gray-800 hover:text-black relative">
              <ShoppingCart size={24} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#1a193f] text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Trust Indicator Sub-Banner */}
      <div className="bg-[#262626] text-white text-[11px] sm:text-xs py-2 w-full flex justify-center border-t border-[#333]">
        <div className="max-w-7xl w-full flex justify-center items-center gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8">
          <span className="font-semibold whitespace-nowrap">Buy Now, Pay Later</span>
          <span className="text-gray-400">|</span>
          <span className="font-semibold whitespace-nowrap">98% Trustpilot Rating</span>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="font-semibold hidden sm:inline whitespace-nowrap">UK's No.1 Retailer</span>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full z-50 shadow-lg">
          <div className="px-4 py-4 flex flex-col space-y-4 text-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Shop</Link>
            <Link to="/shop?category=divan-beds" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Divan Beds</Link>
            <Link to="/shop?category=ottoman-beds" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Ottoman Beds</Link>
            <Link to="/shop?category=frame-beds" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Frame Beds</Link>
            <Link to="/shop?category=modern-beds" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Modern Beds</Link>
            <Link to="/shop?category=mattress" onClick={() => setIsOpen(false)} className="text-[#1a193f] font-bold text-[15px]">Mattresses</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
