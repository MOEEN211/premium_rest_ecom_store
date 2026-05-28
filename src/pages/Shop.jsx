import { useLocation } from 'react-router-dom';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';
import BedCard from '../components/BedCard';
import CategoryLinks from '../components/CategoryLinks';

export default function Shop() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  const { beds, options, loading } = useSupabaseBeds();

  let products = beds;

  if (categoryFilter) {
    if (categoryFilter === 'modern-beds') {
      // Show products that are NOT ottoman and NOT divan, but MUST contain "bed"
      products = products.filter(p => {
        const name = p.name ? p.name.toLowerCase() : '';
        const cat = p.category ? p.category.toLowerCase() : '';
        const hasBed = name.includes('bed') || cat.includes('bed');
        return hasBed && !name.includes('ottoman') && !name.includes('divan') && !cat.includes('ottoman') && !cat.includes('divan');
      });
    } else if (categoryFilter === 'frame-beds') {
      // Show ALL beds (category 'bed' or containing the word 'bed')
      products = products.filter(p => {
        const name = p.name ? p.name.toLowerCase() : '';
        const cat = p.category ? p.category.toLowerCase() : '';
        return cat === 'bed' || name.includes('bed') || cat.includes('bed');
      });
    } else if (categoryFilter === 'mattress') {
      // Show products specifically tagged as Standalone Mattress in backend
      products = products.filter(p => {
        const baseType = p.base_price_type ? String(p.base_price_type).trim().toLowerCase() : '';
        const cat = p.category ? p.category.toLowerCase() : '';
        return baseType === 'standalone mattress' || baseType === 'standalone_mattress' || cat === 'mattress';
      });
    } else {
      // e.g. "ottoman-beds" -> "ottoman"
      const catSearch = categoryFilter.replace('-beds', '').replace('-', ' ').toLowerCase();
      products = products.filter(p => 
        (p.category && p.category.toLowerCase().includes(catSearch)) || 
        (p.name && p.name.toLowerCase().includes(catSearch))
      );
    }
  }

  if (searchQuery) {
    products = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    switch(categoryFilter) {
      case 'ottoman-beds': return 'Ottoman Beds';
      case 'divan-beds': return 'Divan Beds';
      case 'frame-beds': return 'Frame Beds';
      case 'modern-beds': return 'Modern Beds';
      case 'mattress': return 'Luxury Mattresses';
      default: return 'Our Collection';
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        <div className="mb-10 text-left">
           <h2 className="text-4xl md:text-[42px] font-black text-black tracking-tighter mb-3">{getPageTitle()}</h2>
           <p className="text-gray-600 max-w-2xl text-[15px] leading-relaxed font-medium">
             Experience unparalleled comfort with our premium collection. Find the perfect piece that ensures restful sleep and supports your well-being.
           </p>
           <p className="text-gray-400 text-sm mt-4">
             Showing {loading ? '...' : products.length} products
           </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <p className="text-xl font-bold mb-2">
              {searchQuery ? `No matches found for "${searchQuery}"` : "No products found."}
            </p>
            <p className="text-sm">Try checking your spelling or searching for a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
            {products.map(product => (
              <BedCard key={product.id} product={product} options={options} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-slate-200">
        <CategoryLinks className="py-16 bg-[#f8f8f8]" />
      </div>
    </div>
  );
}
