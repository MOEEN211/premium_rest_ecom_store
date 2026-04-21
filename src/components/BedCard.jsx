import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Star } from 'lucide-react';

export default function BedCard({ product, options = [] }) {
  const baseType = product.base_price_type;
  const isMattress = product.category === 'mattress';
  const isSofa = product.category === 'sofa';
  
  let displayPrice = 160;
  
  if (isSofa) {
    const sofaOptions = options.filter(o => o.category === 'SOFA_SIZE' && o.base_price_type === baseType);
    if (sofaOptions.length > 0) {
      displayPrice = Math.min(...sofaOptions.map(o => parseFloat(o.price_modifier) || 0));
    } else {
      displayPrice = 250; 
    }
  } else {
    const targetSize = isMattress ? 'Single Size 3ft' : '3FT Single';
    const sizeOption = options.find(o => o.category === 'PRICE_FRAME' && o.value === targetSize && o.base_price_type === baseType);
    displayPrice = sizeOption ? parseFloat(sizeOption.price_modifier) : (isMattress ? 110 : 160);
  }

  return (
    <div className="group relative border border-gray-200 rounded-lg flex flex-col h-full bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      
      {/* Top Image Section */}
      <Link to={`/product/${product.id}`} className="block aspect-[4/3] bg-gray-100 overflow-hidden relative">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        />
        
        {/* Sale Ribbon Triangle */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden z-10">
           <div className="absolute top-[18px] -left-6 w-24 bg-[#0a1128] text-white text-[10px] font-bold py-1 text-center rotate-[-45deg] z-20">
             Sale
           </div>
        </div>
      </Link>
      
      {/* Detail Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3 line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="bg-yellow-100 text-yellow-800 text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center mr-1">
            5.0
          </span>
          <Star size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
          <Star size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
          <Star size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
          <Star size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
          <Star size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
        </div>

        {/* Pricing */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-[22px] font-bold text-[#0a1128]">£{displayPrice.toFixed(0)}</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link 
            to={`/product/${product.id}`} 
            className="flex items-center justify-center gap-1.5 bg-[#4a9d9c] hover:bg-[#3b807f] text-white py-2.5 px-2 rounded-md font-semibold text-[13px] transition-colors"
          >
            <ShoppingCart size={14} /> Add to Cart
          </Link>

          <Link 
            to={`/product/${product.id}`}
            className="flex items-center justify-center gap-1.5 bg-[#0a1128] hover:bg-black text-white py-2.5 px-2 rounded-md font-semibold text-[13px] transition-colors"
          >
            View <ChevronRight size={14} />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 text-[11px] text-slate-800 font-medium">
          Next Day Delivery / Select Day
        </div>
      </div>

    </div>
  );
}
