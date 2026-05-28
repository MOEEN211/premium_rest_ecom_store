import { Link } from 'react-router-dom';
import { useSupabaseBeds } from '../hooks/useSupabaseBeds';

export default function CategoryLinks({ className = "pt-12 pb-6 bg-[#f8f8f8]" }) {
  const { beds } = useSupabaseBeds();

  // Helper: get the first product image that matches a category filter
  const getImg = (filterFn, fallback = '/af663ba9-3e51-4ebb-8413-e9dffa38d261.jpg') => {
    const match = beds.find(filterFn);
    return (match && match.img) ? match.img : fallback;
  };

  const categories = [
    {
      title: 'Explore Ottoman Beds',
      link: '/shop?category=ottoman-beds',
      img: getImg(p => {
        const n = (p.name || '').toLowerCase();
        const c = (p.category || '').toLowerCase();
        return n.includes('ottoman') || c.includes('ottoman');
      }),
    },
    {
      title: 'Explore Divan Beds',
      link: '/shop?category=divan-beds',
      img: getImg(p => {
        const n = (p.name || '').toLowerCase();
        const c = (p.category || '').toLowerCase();
        return n.includes('divan') || c.includes('divan');
      }),
    },
    {
      title: 'Explore Modern Beds',
      link: '/shop?category=modern-beds',
      img: getImg(p => {
        const n = (p.name || '').toLowerCase();
        const c = (p.category || '').toLowerCase();
        const hasBed = n.includes('bed') || c.includes('bed');
        return hasBed && !n.includes('ottoman') && !n.includes('divan') && !c.includes('ottoman') && !c.includes('divan');
      }),
    },
    {
      title: 'Explore Mattresses',
      link: '/shop?category=mattress',
      img: getImg(p => {
        const baseType = p.base_price_type ? String(p.base_price_type).trim().toLowerCase() : '';
        const c = (p.category || '').toLowerCase();
        return baseType === 'standalone mattress' || baseType === 'standalone_mattress' || c === 'mattress';
      }),
    },
  ];

  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <Link key={i} to={cat.link} className="block group rounded-xl overflow-hidden bg-[#262626] shadow-sm hover:shadow-md transition">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
                <img
                  src={cat.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={cat.title}
                />
              </div>
              <div className="py-3.5 text-center">
                <span className="text-white font-semibold text-sm sm:text-[15px] tracking-wide">{cat.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
