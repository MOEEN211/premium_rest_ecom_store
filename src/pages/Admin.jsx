import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, ExternalLink, ChevronDown, ChevronUp, Mail, MailOpen, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const bedSizes = ['3FT Single', '4FT Small Double', '4FT6 Double', '5FT King Size', '6FT Super King Size'];
const mattressSizes = ['Single Size 3ft', 'Small Double 4ft', 'Double 4ft"6', 'King 5ft"6', 'Super King 6ft"6'];

export default function Admin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [productCategory, setProductCategory] = useState('bed');
  const [pricingStrategy, setPricingStrategy] = useState('HILTON');
  const [storageType, setStorageType] = useState('Gas Lift');
  
  // Sofa specific dynamic options
  const [sofaSizes, setSofaSizes] = useState([{ caption: '', price: '' }]);
  const [sofaFeatures, setSofaFeatures] = useState(['']);
  
  const [customPrices, setCustomPrices] = useState({});

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBeds, setExistingBeds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
    console.log(`[AdminLog] ${msg}`);
  };

  useEffect(() => {
    fetchBeds();
    fetchOrders();
  }, []);

  const fetchBeds = async () => {
    const { data, error } = await supabase.from('beds').select('*');
    if (!error && data) {
      setExistingBeds(data.reverse());
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
    setOrdersLoading(false);
  };

  const toggleRead = async (order) => {
    const newVal = !order.is_read;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ is_read: newVal })
        .eq('id', order.id);

      if (error) {
        addLog(`toggleRead Supabase error (id=${order.id}, is_read=${newVal}): ${error.message}`);
        setMessage({ type: 'error', text: `Failed to update read status: ${error.message}` });
        return;
      }

      addLog(`toggleRead success (id=${order.id}, is_read=${newVal}) — refreshing list...`);
      // Re-sync from DB (RLS/DB triggers can sometimes make optimistic UI drift)
      await fetchOrders();
    } catch (err) {
      addLog(`toggleRead fatal error: ${err.message}`);
      setMessage({ type: 'error', text: `Failed to update read status: ${err.message}` });
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleDelete = async (bed) => {
    addLog(`Starting deletion for: ${bed.name} (${bed.id})`);
    setMessage({ type: '', text: '' });

    try {
      addLog('Calling Supabase delete on "beds" table...');
      const { error } = await supabase.from('beds').delete().eq('id', bed.id);
      
      if (error) {
        addLog(`Supabase Error: ${error.message}`);
        throw error;
      }

      if (bed.base_price_type && bed.base_price_type.startsWith('CUSTOM_')) {
        addLog('Cleaning up associated CUSTOM bed_options...');
        await supabase.from('bed_options').delete().eq('base_price_type', bed.base_price_type);
      }

      setExistingBeds(prev => prev.filter(b => b.id !== bed.id));
      setDeletingId(null);
      addLog(`SUCCESS: ${bed.name} removed.`);
      setMessage({ type: 'success', text: `Product "${bed.name}" deleted.` });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      addLog(`FATAL ERROR: ${err.message}`);
      setMessage({ type: 'error', text: `Failed to delete: ${err.message}` });
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (imageFiles.length === 0) throw new Error("Please select at least one image file.");
      
      const imgArray = [];
      const bucket = 'product-images';

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
        imgArray.push(publicUrl);
      }

      let finalPriceType = pricingStrategy;

      // ── SOFA: save dynamic size options ──
      if (productCategory === 'sofa') {
        const validSizes = sofaSizes.filter(s => s.caption.trim() && s.price);
        if (validSizes.length === 0) throw new Error('Please add at least one size option with a price.');
        
        finalPriceType = `SOFA_${Date.now()}`;
        const sofaSizeRows = validSizes.map(s => ({
          base_price_type: finalPriceType,
          category: 'SOFA_SIZE',
          value: s.caption.trim(),
          price_modifier: parseFloat(s.price).toFixed(2)
        }));
        const { error: sofaOptErr } = await supabase.from('bed_options').insert(sofaSizeRows);
        if (sofaOptErr) throw sofaOptErr;
      }
      
      if (pricingStrategy === 'CUSTOM') {
         finalPriceType = `CUSTOM_${Date.now()}`;
         const priceRows = [];
         
         const activeSizes = productCategory === 'bed' ? bedSizes : mattressSizes;
         
         for (const sizeLabel of activeSizes) {
           const basePriceVal = parseFloat(customPrices[sizeLabel]);
           if (!basePriceVal && basePriceVal !== 0) throw new Error(`Please provide a price for ${sizeLabel}`);

           priceRows.push({
             base_price_type: finalPriceType,
             category: 'PRICE_FRAME',
             value: sizeLabel,
             price_modifier: basePriceVal.toFixed(2)
           });
           
           if (productCategory === 'bed') {
             const multiplierFrames = {
               '3FT Single': 1, '4FT Small Double': 1.15, '4FT6 Double': 1.15, '5FT King Size': 1.30, '6FT Super King Size': 1.60
             };
             const fullSetVal = basePriceVal + (40 * multiplierFrames[sizeLabel]);
             priceRows.push({
               base_price_type: finalPriceType,
               category: 'PRICE_FULLSET',
               value: sizeLabel,
               price_modifier: fullSetVal.toFixed(2)
             });
           }
         }
         
         const { error: optError } = await supabase.from('bed_options').insert(priceRows);
         if (optError) throw optError;
      }

      // ── Save features as JSON (sofa) ──
      const validFeatures = sofaFeatures.filter(f => f.trim());
      const featuresJson = validFeatures.length > 0 ? JSON.stringify(validFeatures) : null;
  
      const { error: bedError } = await supabase.from('beds').insert([{
        name,
        description,
        category: productCategory,
        base_price_type: finalPriceType,
        storage_type: productCategory === 'bed' ? storageType : null,
        image_url: JSON.stringify(imgArray),
        features: featuresJson
      }]);

      if (bedError) throw bedError;

      setMessage({ type: 'success', text: `Product "${name}" successfully uploaded to the store!` });
      setName('');
      setDescription('');
      setImageFiles([]);
      setCustomPrices({});
      setSofaSizes([{ caption: '', price: '' }]);
      setSofaFeatures(['']);
      
      fetchBeds(); 
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (val) => {
    setProductCategory(val);
    setCustomPrices({});
    setSofaSizes([{ caption: '', price: '' }]);
    setSofaFeatures(['']);
    if (val === 'mattress') {
      setPricingStrategy('CUSTOM');
    } else if (val === 'sofa') {
      setPricingStrategy('SOFA');
    } else {
      setPricingStrategy('HILTON');
    }
  };

  const activeSizes = productCategory === 'bed' ? bedSizes : mattressSizes;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-serif text-slate-900 mb-8 border-b border-gray-200 pb-4">Store Dashboard</h1>

        {message.text && (
          <div 
            className={`p-4 mb-6 rounded-sm text-sm font-medium flex justify-between items-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}
            role="alert"
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-4 hover:opacity-70">✕</button>
          </div>
        )}

        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 border p-4 rounded-sm border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="bed" checked={productCategory === 'bed'} onChange={() => handleCategoryChange('bed')} className="w-4 h-4 text-[#0a1128]" />
                  <span className="font-semibold text-slate-900">Bed Frame</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">Full configurable bed with mattress, sizes, fabric, storage, colors.</p>
              </div>
              <div className="flex-1 border p-4 rounded-sm border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="mattress" checked={productCategory === 'mattress'} onChange={() => handleCategoryChange('mattress')} className="w-4 h-4 text-[#0a1128]" />
                  <span className="font-semibold text-slate-900">Standalone Mattress</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">A single mattress product. Only requires sizes to be chosen.</p>
              </div>
              <div className="flex-1 border p-4 rounded-sm border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="sofa" checked={productCategory === 'sofa'} onChange={() => handleCategoryChange('sofa')} className="w-4 h-4 text-[#0a1128]" />
                  <span className="font-semibold text-slate-900">Sofa</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">Dynamic sofa with custom features, sizes, fabrics, and colors.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Product Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm focus:border-slate-900 focus:outline-none" placeholder="e.g. Oxford Wingback Bed or Ortho Mattress" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="4" className="w-full p-3 border border-gray-300 rounded-sm focus:border-slate-900 focus:outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Upload Images</label>
              <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={e => setImageFiles(prev => [...prev, ...Array.from(e.target.files)])} className="w-full p-2 border border-gray-300 rounded-sm focus:border-slate-900 focus:outline-none bg-white" />
              <p className="text-xs text-gray-500 mt-2">The first image will be the main thumbnail.</p>
              
              {imageFiles.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {imageFiles.map((f, i) => (
                    <div key={i} className="relative group">
                      <img src={URL.createObjectURL(f)} alt="preview" className="w-20 h-20 object-cover rounded-sm border border-gray-200 shadow-sm" />
                      <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-sm">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {productCategory === 'bed' && (
              <div className="border-t border-gray-100 pt-6 mt-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Storage Layout Option</label>
                <select value={storageType} onChange={e => setStorageType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm focus:border-slate-900 focus:outline-none bg-white font-medium text-slate-800">
                  <option value="Gas Lift">Gas Lift Layout (No Storage / Gas Lift)</option>
                  <option value="Drawers">Drawers Layout (No Storage / 1 to 4 Drawers)</option>
                  <option value="No Need">No Need Layout (No Storage option on frontend)</option>
                </select>
              </div>
            )}

            {/* Sofa-specific: Dynamic Sizes */}
            {productCategory === 'sofa' && (
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-900">Sofa Size Options & Prices (£)</label>
                  <button
                    type="button"
                    onClick={() => setSofaSizes(prev => [...prev, { caption: '', price: '' }])}
                    className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-sm border border-slate-200 transition"
                  >
                    + Add Size
                  </button>
                </div>
                <p className="text-xs text-gray-500">e.g. "3 Seater" → £499. The customer's price will be based on the size they select.</p>
                {sofaSizes.map((row, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Size label (e.g. 3 Seater)"
                      value={row.caption}
                      onChange={e => setSofaSizes(prev => prev.map((r, i) => i === idx ? { ...r, caption: e.target.value } : r))}
                      className="flex-1 p-2.5 border border-gray-300 rounded-sm text-sm focus:border-slate-900 focus:outline-none"
                    />
                    <span className="text-gray-400 font-bold">£</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Price"
                      value={row.price}
                      onChange={e => setSofaSizes(prev => prev.map((r, i) => i === idx ? { ...r, price: e.target.value } : r))}
                      className="w-28 p-2.5 border border-gray-300 rounded-sm text-sm focus:border-slate-900 focus:outline-none"
                    />
                    {sofaSizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSofaSizes(prev => prev.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-600 text-lg font-bold transition"
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Sofa-specific: Dynamic Features */}
            {productCategory === 'sofa' && (
              <div className="border-t border-gray-100 pt-6 mt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-900">Sofa Features / Highlights</label>
                  <button
                    type="button"
                    onClick={() => setSofaFeatures(prev => [...prev, ''])}
                    className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-sm border border-slate-200 transition"
                  >
                    + Add Feature
                  </button>
                </div>
                <p className="text-xs text-gray-500">Add key selling points shown on the product page (e.g. "Handcrafted in UK").</p>
                {sofaFeatures.map((feat, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder={`Feature ${idx + 1} (e.g. Memory foam cushioning)`}
                      value={feat}
                      onChange={e => setSofaFeatures(prev => prev.map((f, i) => i === idx ? e.target.value : f))}
                      className="flex-1 p-2.5 border border-gray-300 rounded-sm text-sm focus:border-slate-900 focus:outline-none"
                    />
                    {sofaFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSofaFeatures(prev => prev.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-600 text-lg font-bold transition"
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bed/Mattress pricing strategy */}
            {productCategory !== 'sofa' && (
              <div className="border-t border-gray-100 pt-6 mt-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Pricing Matrix Strategy</label>
                <select 
                  value={pricingStrategy} 
                  onChange={e => setPricingStrategy(e.target.value)} 
                  disabled={productCategory === 'mattress'}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:border-slate-900 focus:outline-none bg-white font-medium text-slate-800 disabled:opacity-50"
                >
                  {productCategory === 'bed' && <option value="HILTON">Use Standard 'Hilton' Pricing (Default)</option>}
                  {productCategory === 'bed' && <option value="SLEIGH">Use Premium 'Sleigh Arizona' Pricing</option>}
                  <option value="CUSTOM">Create Custom Fixed Prices (Required for Mattresses)</option>
                </select>
              </div>
            )}
            
            {pricingStrategy === 'CUSTOM' && productCategory !== 'sofa' && (
              <div className="bg-slate-100 p-6 rounded-sm border border-slate-200 space-y-4">
                 <h3 className="font-semibold text-slate-800 text-sm">Define Custom Prices (£)</h3>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {activeSizes.map(size => (
                     <div key={size}>
                       <label className="block text-xs font-medium text-slate-700 mb-1">{size}</label>
                       <input 
                         required 
                         type="number" 
                         min="1"
                         value={customPrices[size] || ''}
                         onChange={e => setCustomPrices({...customPrices, [size]: e.target.value})}
                         placeholder={`Price for ${size}`}
                         className="w-full p-2 border border-slate-300 rounded-sm"
                       />
                     </div>
                   ))}
                 </div>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#0a1128] hover:bg-black text-white font-bold py-4 px-6 rounded-sm transition disabled:opacity-50">
              {isSubmitting ? 'Uploading to Store...' : 'Upload Product to Store'}
            </button>
          </form>
        </div>
        
        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Manage Products</h2>
            <button type="button" onClick={() => { addLog('Refreshing products list...'); fetchBeds(); }} className="text-xs text-gray-500 hover:text-slate-900 transition border px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <RefreshCw size={13} /> Refresh List
            </button>
          </div>
          
          {existingBeds.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {existingBeds.map(bed => (
                <div key={bed.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-sm hover:bg-slate-50 transition relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    {bed.image_url && (
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={bed.image_url.startsWith('[') ? JSON.parse(bed.image_url)[0] : bed.image_url} className="w-full h-full object-cover" alt={bed.name} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{bed.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{bed.category} · {bed.base_price_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 relative z-30">
                    <Link to={`/product/${bed.id}`} target="_blank" className="text-blue-600 hover:underline text-xs font-bold mr-2">Preview</Link>
                    
                    {deletingId === bed.id ? (
                      <div className="flex items-center gap-2 bg-rose-50 p-1 rounded border border-rose-200">
                        <span className="text-[10px] font-bold text-rose-700 px-1">Delete?</span>
                        <button 
                          type="button"
                          onClick={() => { addLog(`Confirmed delete for ${bed.name}`); handleDelete(bed); }}
                          className="bg-rose-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button 
                          type="button"
                          onClick={() => { addLog('Cancelled delete'); setDeletingId(null); }}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-gray-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); addLog(`Delete clicked for ${bed.name}`); setDeletingId(bed.id); }}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-sm text-xs font-bold transition-all border border-rose-100 cursor-pointer shadow-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DEBUG LOG SECTION ── */}
        <div className="mt-8 bg-slate-900 rounded-sm p-4 text-xs font-mono text-green-400 overflow-hidden shadow-2xl border-t-4 border-slate-800">
          <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
            <span className="font-bold text-slate-400 uppercase tracking-widest">System Activity Log</span>
            <button onClick={() => setLogs([])} className="text-slate-500 hover:text-white">Clear</button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">No activity yet...</p>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>

        {/* ── ORDERS SECTION ── */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">Customer Orders</h2>
              {orders.filter(o => !o.is_read).length > 0 && (
                <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {orders.filter(o => !o.is_read).length} new
                </span>
              )}
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-slate-900 transition border border-gray-200 px-3 py-1.5 rounded-sm"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">No orders received yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  className={`border rounded-sm transition-all ${
                    order.is_read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  {/* Order Row Header */}
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    {/* Read/Unread icon */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleRead(order); }}
                      className={`flex-shrink-0 transition ${
                        order.is_read ? 'text-gray-400 hover:text-blue-500' : 'text-blue-500 hover:text-blue-700'
                      }`}
                      title={order.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {order.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">{order.customer_name}</span>
                        {!order.is_read && (
                          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {order.phone} · {new Date(order.created_at).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-slate-900">£{parseFloat(order.total_price).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); deleteOrder(order.id); }}
                      className="text-gray-300 hover:text-rose-600 transition flex-shrink-0"
                      title="Delete order"
                    >
                      <Trash2 size={16} />
                    </button>

                    <span className="text-gray-400 flex-shrink-0">
                      {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-100 p-4 text-sm space-y-4 bg-white">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-semibold text-gray-500 uppercase tracking-wide">Name</span>
                          <p className="text-slate-900 mt-0.5">{order.customer_name}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 uppercase tracking-wide">Email</span>
                          <p className="text-slate-900 mt-0.5">{order.customer_email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 uppercase tracking-wide">Phone</span>
                          <p className="text-slate-900 mt-0.5">{order.phone}{order.additional_phone ? ` / ${order.additional_phone}` : ''}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 uppercase tracking-wide">Address</span>
                          <p className="text-slate-900 mt-0.5">{order.address}{order.city ? `, ${order.city}` : ''}{order.postcode ? ` ${order.postcode}` : ''}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 uppercase tracking-wide">Delivery Date</span>
                          <p className="text-slate-900 mt-0.5">{order.delivery_date || 'ASAP'}</p>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div>
                        <span className="font-semibold text-gray-500 uppercase tracking-wide text-xs">Order Items</span>
                        <div className="mt-2 space-y-2">
                          {(Array.isArray(order.cart_items) ? order.cart_items : JSON.parse(order.cart_items || '[]')).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 border border-gray-100 rounded-sm p-3 bg-gray-50">
                              {item.img && (
                                <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-sm border border-gray-200 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × £{parseFloat(item.price).toFixed(2)}</p>
                                {item.selectedOptions && (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {Object.entries(item.selectedOptions).map(([k, v]) => (
                                      <span key={k} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{k}: {v}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="font-semibold text-slate-900 text-sm flex-shrink-0">£{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total + Mark Read */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-base font-bold text-slate-900">Total: £{parseFloat(order.total_price).toFixed(2)}</span>
                        <button
                          onClick={() => toggleRead(order)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-sm transition ${
                            order.is_read
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {order.is_read ? '↩ Mark as Unread' : '✓ Mark as Read'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
