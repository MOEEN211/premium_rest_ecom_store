import { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "447933831237";
    const text = encodeURIComponent(`Hello, my name is ${formData.name}.\n\n${formData.message}`);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-slate-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Have a question about our beds or mattresses? We're here to help. Reach out to us via phone, email, or fill out the form below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-slate-900">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 text-rose-600 p-4 rounded-full">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Phone</h3>
                  <p className="text-gray-500 mt-1">+44 7933 831237</p>
                  <p className="text-sm text-gray-400 mt-1">Every day 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 text-rose-600 p-4 rounded-full">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Email</h3>
                  <p className="text-gray-500 mt-1">ebedsuk@gmail.com</p>
                  <p className="text-sm text-gray-400 mt-1">Every day 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 text-rose-600 p-4 rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Location</h3>
                  <p className="text-gray-500 mt-1">Dewsbury, UK</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 text-rose-600 p-4 rounded-full">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Instagram</h3>
                  <a href="https://www.instagram.com/elitebed.uk?utm_source=qr&igsh=MWR5cWdva3IyZ2gwMQ==" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline mt-1 block">@elitebed.uk</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-stone-50 p-8 border border-gray-100">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={handleWhatsAppSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent shadow-sm" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent shadow-sm" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 transition flex items-center justify-center gap-2 shadow-lg rounded-sm uppercase tracking-wider">
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
