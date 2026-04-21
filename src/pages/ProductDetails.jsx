import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';
import Features from '../components/Features';
import Breadcrumbs from '../components/Breadcrumbs';

const MATTRESS_OPTIONS = {
  '3FT': [
    { label: '8" Standard Eco-Spring', value: '8" Standard Eco-Spring', price: 30 },
    { label: '10" Full Memory Foam', value: '10" Full Memory Foam', price: 50 },
    { label: '10" Memory Foam Spring', value: '10" Memory Foam Spring', price: 50 },
    { label: '10" Orthopedic Firm', value: '10" Orthopedic Firm', price: 70 },
  ],
  '4FT': [
    { label: '8" Standard Eco-Spring', value: '8" Standard Eco-Spring', price: 40 },
    { label: '10" Full Memory Foam', value: '10" Full Memory Foam', price: 60 },
    { label: '10" Memory Foam Spring', value: '10" Memory Foam Spring', price: 60 },
    { label: '10" Orthopedic Firm', value: '10" Orthopedic Firm', price: 80 },
  ],
  '4FT6': [
    { label: '8" Standard Eco-Spring', value: '8" Standard Eco-Spring', price: 40 },
    { label: '10" Full Memory Foam', value: '10" Full Memory Foam', price: 60 },
    { label: '10" Memory Foam Spring', value: '10" Memory Foam Spring', price: 60 },
    { label: '10" Orthopedic Firm', value: '10" Orthopedic Firm', price: 80 },
  ],
  '5FT': [
    { label: '8" Standard Eco-Spring', value: '8" Standard Eco-Spring', price: 50 },
    { label: '10" Full Memory Foam', value: '10" Full Memory Foam', price: 70 },
    { label: '10" Memory Foam Spring', value: '10" Memory Foam Spring', price: 70 },
    { label: '10" Orthopedic Firm', value: '10" Orthopedic Firm', price: 90 },
  ],
  '6FT': [
    { label: '8" Standard Eco-Spring', value: '8" Standard Eco-Spring', price: 70 },
    { label: '10" Full Memory Foam', value: '10" Full Memory Foam', price: 80 },
    { label: '10" Memory Foam Spring', value: '10" Memory Foam Spring', price: 80 },
    { label: '10" Orthopedic Firm', value: '10" Orthopedic Firm', price: 90 },
  ],
};

function normalizeSizeKey(size) {
  if (!size) return null;
  const s = size.toUpperCase().replace(/\s/g, '');
  if (s.includes('6FT')) return '6FT';
  if (s.includes('5FT')) return '5FT';
  if (s.includes('4FT6') || s.includes('4FT 6') || s.includes('4\'6')) return '4FT6';
  if (s.includes('4FT')) return '4FT';
  if (s.includes('3FT')) return '3FT';
  return null;
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { beds, options, loading } = useSupabaseBeds();

  const [size, setSize] = useState('');
  const [mattress, setMattress] = useState('');
  const [storage, setStorage] = useState('');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thickness, setThickness] = useState('8"');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [assembly, setAssembly] = useState('No Bed Assembling');

  // Sofa-specific state
  const [sofaColor, setSofaColor] = useState('');
  const [sofaFabric, setSofaFabric] = useState('');
  const [sofaSize, setSofaSize] = useState('');
  const [stool, setStool] = useState('No');

  if (loading) return <div className="bg-white py-32 text-center min-h-[60vh] text-xl text-gray-500">Loading...</div>;

  let product = beds.find(p => p.id === id);

  if (!product) {
    return (
      <div className="bg-white py-32 text-center min-h-[60vh]">
        <h2 className="text-2xl font-serif text-slate-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-teal-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const isConfigurable = product.isSupabase;
  const isMattress = product.category === 'mattress';
  const isSofa = product.category === 'sofa';
  const storageValue = (!isMattress && !isSofa && product.storage_type === 'No Need') ? 'No Storage' : storage;

  const baseType = isConfigurable
    ? (product.base_price_type || (options && options.length > 0 ? options[0].base_price_type : 'DEFAULT'))
    : 'DEFAULT';

  const sizeOptions = isConfigurable
    ? options.filter(o => o.category === 'PRICE_FRAME' && o.base_price_type === baseType)
    : [];

  const sofaSizeOptions = isSofa
    ? options.filter(o => o.category === 'SOFA_SIZE' && o.base_price_type === baseType)
    : [];

  const sizeKey = normalizeSizeKey(size);
  const availableMattressOptions = sizeKey ? MATTRESS_OPTIONS[sizeKey] || [] : [];

  let finalPrice = product.price || 0;

  if (isSofa) {
    const sofaSizeOption = sofaSizeOptions.find(o => o.value === sofaSize);
    const sofaBasePrice = sofaSizeOption ? parseFloat(sofaSizeOption.price_modifier) : 0;
    const stoolAdd = stool === 'Yes' ? 100 : 0;
    finalPrice = sofaBasePrice + stoolAdd;
  } else if (isConfigurable) {
    const sizeOption = options.find(o => o.category === 'PRICE_FRAME' && o.value === size && o.base_price_type === baseType);
    let basePrice = sizeOption ? parseFloat(sizeOption.price_modifier) : 0;

    if (isMattress) {
      let thicknessAdd = 0;
      if (thickness === '10"') thicknessAdd = 20;
      else if (thickness === '12"') thicknessAdd = 40;
      finalPrice = basePrice + thicknessAdd;
    } else {
      let mattressAdd = 0;
      if (mattress && mattress !== 'No Mattress' && size) {
        const mattressObj = availableMattressOptions.find(m => m.value === mattress);
        mattressAdd = mattressObj ? mattressObj.price : 0;
        console.log('🔍 Mattress Debug - Mattress:', mattress, 'Add:', mattressAdd);
      }

      let storageAdd = 0;
      if (storageValue === 'Gas Lift') storageAdd = 100;
      else if (storageValue === '1 Drawer') storageAdd = 15;
      else if (storageValue === '2 Drawers') storageAdd = 30;
      else if (storageValue === '3 Drawers storage') storageAdd = 45;
      else if (storageValue === '4 Drawers storage') storageAdd = 60;

      let assemblyAdd = assembly === 'Bed Assembling' ? 50 : 0;

      finalPrice = basePrice + mattressAdd + storageAdd + assemblyAdd;
      console.log('🔍 Price Debug - Base:', basePrice, 'Mattress:', mattressAdd, 'Storage:', storageAdd, 'Assembly:', assemblyAdd, 'Final:', finalPrice);
    }
  }

  const handleAddToCart = () => {
    if (isSofa) {
      if (!sofaSize || !sofaColor || !sofaFabric) {
        alert('Please select all options (Size, Color, Fabric) before buying.');
        return;
      }
      const cartId = `${product.id}-${sofaSize}-${sofaColor}-${sofaFabric}-${stool}`;
      addToCart({
        ...product,
        price: finalPrice,
        cartId,
        name: `${product.name} (${sofaSize})`,
        quantity: Number(quantity),
        selectedOptions: { Size: sofaSize, Color: sofaColor, Fabric: sofaFabric, Stool: stool }
      });
    } else if (isConfigurable) {
      if (isMattress && !size) {
        alert("Please select a size to continue.");
        return;
      }
      if (!isMattress && (!size || !mattress || !storageValue || !fabric || !color)) {
        alert("Please select all options before buying.");
        return;
      }
      const cartId = isMattress
        ? `${product.id}-${size}-${thickness}`
        : `${product.id}-${size}-${mattress}-${storageValue}-${color}-${fabric}-${assembly}`;

      addToCart({
        ...product,
        price: finalPrice,
        cartId,
        name: `${product.name} (${size})`,
        quantity: Number(quantity),
        selectedOptions: isMattress
          ? { Size: size, Thickness: thickness }
          : { Size: size, Mattress: mattress, Storage: storageValue, Color: color, Fabric: fabric, Assembly: assembly }
      });
    } else {
      addToCart({...product, quantity: Number(quantity)});
    }
  };

  const gallery = product.gallery || [product.img];

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: product.name, url: `/product/${product.id}` }
        ]}
      />
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Gallery Section */}
            <div className="flex flex-col gap-4 order-1 lg:order-1">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden border border-gray-100 rounded-sm">
                <img src={gallery[activeImageIndex]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border-2 overflow-hidden rounded-sm flex-shrink-0 ${activeImageIndex === idx ? 'border-gray-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'} transition`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details & Configurator Section */}
            <div className="flex flex-col order-2 lg:order-2">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>

              <div className="font-bold text-2xl text-slate-900 mb-4">
                {(() => {
                  if (isSofa && !sofaSize) {
                    const minP = sofaSizeOptions.length > 0 ? Math.min(...sofaSizeOptions.map(o => parseFloat(o.price_modifier) || 0)) : (product.price || 0);
                    return minP > 0 ? `From £${minP.toFixed(2)}` : 'Select options to see price';
                  }
                  if (!isSofa && isConfigurable && !size) {
                    const minP = sizeOptions.length > 0 ? Math.min(...sizeOptions.map(o => parseFloat(o.price_modifier) || 0)) : (product.price || 0);
                    return minP > 0 ? `From £${minP.toFixed(2)}` : 'Select options to see price';
                  }
                  return `Price: ${finalPrice > 0 ? `£${finalPrice.toFixed(2)}` : 'Select options to see price'}`;
                })()}
              </div>

              <div className="flex items-center gap-1 mb-8">
                <Star size={18} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                <Star size={18} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                <Star size={18} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                <Star size={18} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                <Star size={18} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                <span className="text-sm font-semibold ml-2 bg-yellow-100 px-2 rounded-sm text-yellow-800">5.0</span>
              </div>

              {isConfigurable && (
                <div className="space-y-4 mb-6 max-w-sm sm:max-w-md">

                  {/* ── SOFA OPTIONS ── */}
                  {isSofa && (
                    <>
                      {/* Sofa Size */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Size</span>
                        <select
                          value={sofaSize}
                          onChange={e => setSofaSize(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                        >
                          <option value="" disabled>Choose an Option</option>
                          {sofaSizeOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.value}</option>
                          ))}
                        </select>
                      </div>

                      {/* Sofa Fabric */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Fabric</span>
                        <select
                          value={sofaFabric}
                          onChange={e => setSofaFabric(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                        >
                          <option value="" disabled>Choose an Option</option>
                          <option value="Chenille">Chenille</option>
                          <option value="Naples">Naples</option>
                          <option value="Plush Velvet">Plush Velvet</option>
                        </select>
                      </div>

                      {/* Sofa Color */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Color</span>
                        <select
                          value={sofaColor}
                          onChange={e => setSofaColor(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                        >
                          <option value="" disabled>Choose an Option</option>
                          <option value="Black">Black</option>
                          <option value="Blue">Blue</option>
                          <option value="Charcoal">Charcoal</option>
                          <option value="Cream">Cream</option>
                          <option value="Grey">Grey</option>
                          <option value="Mink">Mink</option>
                          <option value="Silver">Silver</option>
                          <option value="Steel">Steel</option>
                        </select>
                      </div>

                      {/* Stool */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Stool</span>
                        <select
                          value={stool}
                          onChange={e => setStool(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                        >
                          <option value="No">No Stool</option>
                          <option value="Yes">Yes, Add Stool (+£100.00)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* ── BED / MATTRESS OPTIONS ── */}
                  {!isSofa && (
                    <>
                      {/* Size */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Size</span>
                        <select
                          value={size}
                          onChange={(e) => { setSize(e.target.value); setMattress(''); }}
                          className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                        >
                          <option value="" disabled>Choose an Option</option>
                          {sizeOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.value}</option>
                          ))}
                        </select>
                      </div>

                      {/* Thickness - mattress products only */}
                      {isMattress && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Thickness</span>
                          <select
                            value={thickness}
                            onChange={(e) => setThickness(e.target.value)}
                            className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                          >
                            <option value='8"'>8" (Standard)</option>
                            <option value='10"'>10" (+£20.00)</option>
                            <option value='12"'>12" (+£40.00)</option>
                          </select>
                        </div>
                      )}

                      {/* Bed frame options */}
                      {!isMattress && (
                        <>
                          {/* Fabric */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Fabric</span>
                            <select
                              value={fabric}
                              onChange={(e) => setFabric(e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                            >
                              <option value="" disabled>Choose an Option</option>
                              <option value="Crushed Velvet">Crushed Velvet</option>
                              <option value="Plush Velvet">Plush Velvet</option>
                              <option value="Naples">Naples</option>
                              <option value="Chenille">Chenille</option>
                            </select>
                          </div>

                          {/* Mattress */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Mattress</span>
                            <select
                              value={mattress}
                              onChange={(e) => setMattress(e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                            >
                              <option value="" disabled>Choose an Option</option>
                              <option value="No Mattress">No Mattress (Frame Only)</option>
                              {availableMattressOptions.map(m => (
                                <option key={m.value} value={m.value}>{m.value}</option>
                              ))}
                            </select>
                          </div>

                          {/* Color */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Color</span>
                            <select
                              value={color}
                              onChange={(e) => setColor(e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                            >
                              <option value="" disabled>Choose an Option</option>
                              <option value="Brown">Brown</option>
                              <option value="Black">Black</option>
                              <option value="Beige">Beige</option>
                              <option value="Blue">Blue</option>
                              <option value="Charcoal">Charcoal</option>
                              <option value="Cream">Cream</option>
                              <option value="Duck Egg">Duck Egg</option>
                              <option value="Grey">Grey</option>
                              <option value="Maroon">Maroon</option>
                              <option value="Mink">Mink</option>
                              <option value="Mustard Gold">Mustard Gold</option>
                              <option value="Pink">Pink</option>
                              <option value="Purple">Purple</option>
                              <option value="Red">Red</option>
                              <option value="Sapphire">Sapphire</option>
                              <option value="Silver">Silver</option>
                              <option value="Steel">Steel</option>
                              <option value="Teal">Teal</option>
                              <option value="White">White</option>
                            </select>
                          </div>

                          {/* Storage */}
                          {product.storage_type !== 'No Need' && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <span className="w-full sm:w-24 font-bold text-slate-900 text-sm">Storage</span>
                              <select
                                value={storage}
                                onChange={(e) => setStorage(e.target.value)}
                                className="flex-1 p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-teal-500 text-gray-700 text-sm"
                              >
                                <option value="" disabled>Choose an Option</option>
                                <option value="No Storage">No Storage</option>
                                {product.storage_type === 'Drawers' ? (
                                  <>
                                    <option value="1 Drawer">1 Drawer (+£15.00)</option>
                                    <option value="2 Drawers">2 Drawers (+£30.00)</option>
                                    <option value="3 Drawers storage">3 Drawers storage (+£45.00)</option>
                                    <option value="4 Drawers storage">4 Drawers storage (+£60.00)</option>
                                  </>
                                ) : (
                                  <option value="Gas Lift">Gas Lift (+£100.00)</option>
                                )}
                              </select>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-sm text-gray-700 mb-1">Quantity:</div>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-16 p-1 border border-slate-200 rounded text-center focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Assembly - only for configurable beds (not sofa, not mattress) */}
              {isConfigurable && !isMattress && !isSofa && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setAssembly('No Bed Assembling')}
                    className={`relative p-4 border rounded-md text-center flex items-center justify-center transition-colors ${assembly === 'No Bed Assembling' ? 'border-[#4a9d9c] ring-1 ring-[#4a9d9c]' : 'border-gray-300'}`}
                  >
                    <span className="absolute top-2 left-2 text-[10px] text-gray-500">Free</span>
                    <span className="font-semibold text-slate-800 text-sm mt-2">No Bed Assembling</span>
                  </button>

                  <button
                    onClick={() => setAssembly('Bed Assembling')}
                    className={`relative p-4 border rounded-md text-center flex items-center justify-center transition-colors ${assembly === 'Bed Assembling' ? 'border-[#4a9d9c] ring-1 ring-[#4a9d9c]' : 'border-gray-300'}`}
                  >
                    <span className="absolute top-2 left-2 text-[10px] text-[#4a9d9c]">Recommended</span>
                    <span className="font-semibold text-slate-800 text-sm mt-2">Bed Assembling</span>
                    <span className="bg-blue-50 text-[#4a9d9c] font-semibold text-[10px] px-1.5 py-0.5 rounded ml-2 mt-2">+£50</span>
                  </button>
                </div>
              )}

              {/* Buy Now */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    isSofa
                      ? (!sofaSize || !sofaColor || !sofaFabric)
                      : (isConfigurable && (isMattress ? !size : (!size || !mattress || !storageValue || !fabric || !color)))
                  }
                  className="w-full bg-[#4a9d9c] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3b807f] text-white px-8 py-4 font-semibold rounded-md transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold mb-3 text-slate-900">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.description || "Experience the ultimate luxury. Handcrafted beds and premium mattresses designed for perfect sleep."}
                </p>
              </div>

              {/* Sofa Features */}
              {isSofa && product.features && (() => {
                let feats = [];
                try { feats = JSON.parse(product.features); } catch(e) { feats = []; }
                return feats.length > 0 ? (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">Features & Highlights</h3>
                    <ul className="space-y-2">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-[#4a9d9c] font-bold mt-0.5">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })()}

            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100">
          <Features />
        </div>
      </div>
    </>
  );
}