import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-white tracking-tight">Elitebed.uk</h3>
            <p className="text-sm">
              Discover the ultimate sleep experience with our premium selection of luxury beds, mattresses, and bedroom furniture. Designed for comfort, built for life.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.facebook.com/share/18PF9Yy6NS/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/elitebed.uk?utm_source=qr&igsh=MWR5cWdva3IyZ2gwMQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Shop All</Link></li>
              <li><Link to="/shop?category=bed" className="hover:text-white transition">Luxury Beds</Link></li>
              <li><Link to="/shop?category=mattress" className="hover:text-white transition">Premium Mattresses</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition">Sleep Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/delivery" className="hover:text-white transition">Delivery Information</Link></li>
              <li><Link to="/returns" className="hover:text-white transition">Returns Policy (100% Refund)</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gray-400" />
                <span>+44 7933 831237</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-gray-400" />
                <span>ebedsuk@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-gray-400" />
                <span>Dewsbury, UK</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Elitebed.uk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
