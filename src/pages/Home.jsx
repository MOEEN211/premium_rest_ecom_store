import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';
import BedCard from '../components/BedCard';
import Features from '../components/Features';
import TrustSections from '../components/TrustSections';
import CategoryLinks from '../components/CategoryLinks';

export default function Home() {
  const { beds, options, loading } = useSupabaseBeds();
  const featuredBeds = beds.slice(0, 8); // Display first 8 products
  
  // Hero Carousel Logic
  const heroImages = [
    '/images/hero/hero1.jpg',
    '/images/hero/hero2.jpg',
    '/images/hero/hero3.jpg'
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4500); // Rotates every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f8f8f8] font-sans">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#e0dfde]">
        <div className="max-w-7xl mx-auto py-16 sm:py-24 relative flex items-center md:min-h-[500px]">
          
          {/* Automatic Rotating Background Images */}
          {heroImages.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt={`PremiumRest Auto Hero ${index + 1}`} 
              className={`absolute top-0 right-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentHero ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`} 
            />
          ))}
          
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-0"></div>

          <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-16">
             <div>
               <h2 className="text-base sm:text-xl text-white font-medium mb-1 tracking-tight drop-shadow-sm">Mid Week</h2>
               <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-2 drop-shadow-md">
                 Mega Deals
               </h1>
               <p className="text-xl sm:text-2xl font-bold text-white mb-6 drop-shadow-sm">Up to 50% Off</p>
               <div>
                 <Link to="/shop" className="inline-block bg-[#1b193f] hover:bg-black text-white px-6 py-3 rounded font-bold text-base transition-colors shadow-xl">
                   SHOP NOW
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Category Links */}
      <CategoryLinks />

      {/* Our Premium Collection */}
      <section className="py-12 bg-[#f8f8f8]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-left">
               <h2 className="text-4xl md:text-[42px] font-black text-black tracking-tighter mb-3">Our Premium Collection</h2>
               <p className="text-gray-900 max-w-2xl text-[15px] leading-relaxed font-medium">
                 Discover our premium selection of mattresses and beds crafted for ultimate comfort and support. We have the perfect piece to transform your sleep experience.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
              {!loading && beds.filter(p => {
                const name = p.name ? p.name.toLowerCase() : '';
                const cat = p.category ? p.category.toLowerCase() : '';
                // Absolutely do NOT show wardrobes or sofas here
                return !name.includes('wardrobe') && !cat.includes('wardrobe') && !name.includes('sofa') && !cat.includes('sofa');
              }).slice(0, 8).map(bed => (
                <BedCard key={bed.id} product={bed} options={options} />
              ))}
              {loading && <div className="col-span-1 md:col-span-4 py-20 text-center text-gray-500">Loading premium collection...</div>}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <Features />
      
      {/* Trust and Reviews Sections */}
      <TrustSections />

    </div>
  );
}
