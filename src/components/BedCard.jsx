import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Star, ChevronLeft } from 'lucide-react';

export default function BedCard({ product, options = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.img];

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  let displayPrice = (product.price && parseFloat(product.price) > 0) ? parseFloat(product.price) : 0;
  
  const baseType = product.base_price_type ? String(product.base_price_type).trim().toLowerCase() : null;
  const productOptions = options.filter(o => 
    o.base_price_type && 
    String(o.base_price_type).trim().toLowerCase() === baseType
  );

  if (productOptions.length > 0) {
    const relevantOptions = productOptions.filter(o => 
      ['PRICE_FRAME', 'SOFA_SIZE', 'WARDROBE_SIZE', 'PRICE_FULLSET'].includes(o.category)
    );
    const priceCandidates = (relevantOptions.length > 0 ? relevantOptions : productOptions)
      .map(o => parseFloat(o.price_modifier))
      .filter(p => !isNaN(p) && p > 0);

    if (priceCandidates.length > 0) {
      displayPrice = Math.min(...priceCandidates);
    }
  }
  
  if (displayPrice === 0 && productOptions.length > 0) {
    const anyPrices = productOptions.map(o => parseFloat(o.price_modifier)).filter(p => !isNaN(p) && p > 0);
    if (anyPrices.length > 0) {
      displayPrice = Math.min(...anyPrices);
    }
  }

  const oldPrice = displayPrice > 0 ? Math.floor(displayPrice * 1.66) : 0;
  const saveAmount = oldPrice - displayPrice;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300">
      
      {/* Top Image Section */}
      <Link to={`/product/${product.id}`} className="block aspect-[4/3] bg-gray-50 overflow-hidden relative">
        <img 
          src={images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        
        {/* Save Badge */}
        {saveAmount > 0 && (
          <div className="absolute top-4 left-4 bg-[#2a2a2a] text-white text-[11px] font-semibold py-1 px-2.5 rounded shadow-sm z-20">
            Save £{saveAmount.toFixed(0)}
          </div>
        )}
        
        {/* Slider Controls */}
        {images.length > 1 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-between px-2">
                <div onClick={prevImage} className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white text-gray-700 z-30">
                    <ChevronLeft size={16} />
                </div>
                <div onClick={nextImage} className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white text-gray-700 z-30">
                    <ChevronRight size={16} />
                </div>
            </div>
        )}
        
        {/* Slider Dots */}
        {images.length > 1 && (
            <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-20">
                {images.map((_, idx) => (
                    <span 
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full bg-white transition-opacity ${idx === currentImageIndex ? 'opacity-100' : 'opacity-40'}`} 
                    />
                ))}
            </div>
        )}
      </Link>
      
      {/* Detail Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white">
        
        {/* Rating and Price row */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-0.5">
                <Star size={12} fill="#eab308" color="#eab308" />
                <Star size={12} fill="#eab308" color="#eab308" />
                <Star size={12} fill="#eab308" color="#eab308" />
                <Star size={12} fill="#eab308" color="#eab308" />
                <Star size={12} fill="#eab308" color="#eab308" />
                <span className="bg-[#2a2a2a] text-white text-[10px] font-bold px-1 rounded-sm ml-1.5 leading-tight">5.0</span>
             </div>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[17px] font-bold text-black tracking-tight">£{displayPrice.toFixed(0)}</span>
            <span className="text-[11px] text-gray-400 line-through mb-0.5">£{oldPrice.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[15px] text-gray-800 font-medium line-clamp-1 mb-4 flex-1">
          {product.name}
        </h3>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
            <Link 
                to={`/product/${product.id}`} 
                className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm"
                title="Add to Cart"
            >
                <ShoppingCart size={18} strokeWidth={1.5} />
            </Link>
            
            <Link 
                to={`/product/${product.id}`}
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-black flex items-center justify-center transition-colors"
                title="View details"
            >
                <ChevronRight size={18} strokeWidth={1.5} />
            </Link>
        </div>
      </div>
    </div>
  );
}
