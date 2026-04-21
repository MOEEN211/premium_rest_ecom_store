import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';
import BedCard from '../components/BedCard';

const CATEGORY_LABELS = {
  bed: 'Luxury Beds',
  mattress: 'Premium Mattresses',
};

export default function Shop() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  const { beds, options, loading } = useSupabaseBeds();

  let products = categoryFilter
    ? beds.filter(p => p.category === categoryFilter)
    : beds;

  if (searchQuery) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const pageTitle = searchQuery 
    ? `Search results for "${searchQuery}"`
    : (CATEGORY_LABELS[categoryFilter] || 'Shop All Products');

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#0a1128] text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-serif mb-2">{pageTitle}</h1>
          <p className="text-slate-400 text-sm">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <p className="text-xl font-serif mb-2 text-slate-700">
              {searchQuery ? `No matches found for "${searchQuery}"` : "No products found."}
            </p>
            <p className="text-sm">Try checking your spelling or searching for a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <BedCard key={product.id} product={product} options={options} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
