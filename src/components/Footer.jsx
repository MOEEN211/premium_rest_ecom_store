import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">We're Happy to<br/>Help!</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Need help choosing the perfect bed or mattress? Our friendly team at PremiumRest Furniture has the knowledge and passion to help you find your ideal sleep solution. Just pick up the phone and give us a ring.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Or drop us an email. We love helping you create the perfect bedroom and are always happy to help.
            </p>
            
            <div className="space-y-4 pt-2">
              <a href="tel:+447783699250" className="flex items-center gap-3 font-bold text-white hover:text-green-500 transition">
                <Phone size={20} />
                <span>+44 7783 699250</span>
              </a>
              <a href="mailto:premiumrestfurniture@gmail.com" className="flex items-center gap-3 font-bold text-white hover:text-green-500 transition">
                <Mail size={20} />
                <span>premiumrestfurniture@gmail.com</span>
              </a>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="https://wa.me/447783699250" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] p-2 rounded-full text-white hover:scale-110 transition">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.facebook.com/share/195BYrdNuY/" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] p-2 rounded-full text-white hover:scale-110 transition">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/premiumrestfurniture?igsh=MTB1YW0xZmQwOGljZw==" target="_blank" rel="noopener noreferrer" className="bg-[#E4405F] p-2 rounded-full text-white hover:scale-110 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-6">Support & Info</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition">Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-6">Find Products</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/shop?category=frame-beds" className="hover:text-white transition">Browse Frame Beds</Link></li>
              <li><Link to="/shop?category=mattress" className="hover:text-white transition">Browse Mattresses</Link></li>
              <li><Link to="/shop?category=ottoman-beds" className="hover:text-white transition">Browse Ottoman Beds</Link></li>
              <li><Link to="/shop?category=divan-beds" className="hover:text-white transition">Browse Divan Beds</Link></li>
              <li><Link to="/shop?category=modern-beds" className="hover:text-white transition">Browse Modern Beds</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-base font-bold text-white mb-6">Join our mail list</h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Stay on top of the latest trends, sleep tips, and exclusive offers from PremiumRest Furniture.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-[#e8eced] text-gray-900 rounded-sm focus:outline-none placeholder-gray-500 text-sm"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-[#12423c] hover:bg-[#0c2f2a] text-white py-3 rounded-sm font-semibold transition text-sm"
              >
                Send
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-[#444] mt-16 pt-8 text-center text-xs text-gray-400">
          <p>&copy; 2026 PremiumRest Furniture Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
