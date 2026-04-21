import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';
import BedCard from '../components/BedCard';
import Features from '../components/Features';
import ReviewsCarousel from '../components/ReviewsCarousel';

export default function Home() {
  const { beds, options, loading } = useSupabaseBeds();
  
  const featuredBeds = beds.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-stone-100 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/af663ba9-3e51-4ebb-8413-e9dffa38d261.jpg"
          alt="Luxury Bedroom" 
          className="absolute inset-0 w-full h-full object-contain md:object-cover"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left w-full">
          <p className="text-rose-400 font-semibold tracking-wider uppercase mb-3 text-xs sm:text-sm">Limited Time Offer</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-tight mb-5 max-w-2xl">
            Dream Deals <br/> Get 50% Off on All Beds
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl">
            Experience the ultimate luxury. Handcrafted beds and premium mattresses designed for perfect sleep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/shop" className="bg-[#4a9d9c] hover:bg-[#3b807f] text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium transition-colors text-center">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif text-[#0a1128] mb-4">Trending Deals</h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            Discover our best-selling luxury beds currently on offer. Quality sleep doesn't have to break the bank.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {!loading && featuredBeds.map(bed => (
              <BedCard key={bed.id} product={bed} options={options} />
            ))}
            {loading && (
              <div className="col-span-1 md:col-span-3 text-gray-500 py-12">Loading featured beds...</div>
            )}
          </div>
          
          <div className="mt-16">
            <Link
              to="/shop"
              className="inline-block border-b-2 border-[#0a1128] text-[#0a1128] font-bold pb-1 hover:text-[#4a9d9c] hover:border-[#4a9d9c] transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <ReviewsCarousel />
      <Features />
    </div>
  );
}
