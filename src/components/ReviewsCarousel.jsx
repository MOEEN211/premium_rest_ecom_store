import { useEffect, useMemo, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const ReviewsCarousel = () => {
  const reviews = useMemo(
    () => [
      {
        name: 'James R.',
        title: 'Best mattress we’ve owned',
        text:
          'Really comfortable from the first night. Delivery was quick and the bed feels premium.',
        rating: 5,
      },
      {
        name: 'Sarah K.',
        title: 'Amazing quality and comfort',
        text:
          'The mattress support is excellent and the overall finish looks great in our bedroom.',
        rating: 5,
      },
      {
        name: 'Mark T.',
        title: 'Fantastic value for money',
        text:
          'Great pricing, superb materials, and it arrived exactly when they said it would.',
        rating: 5,
      },
      {
        name: 'Emma W.',
        title: 'Highly recommend',
        text:
          'Easy ordering, helpful support, and a mattress that actually improved our sleep.',
        rating: 5,
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [reviews.length]);

  return (
    <section className="py-16 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-[#0a1128] mb-2">What Our Clients Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            5-star comfort with real customer feedback. Reviews rotate automatically.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {reviews.map((r, idx) => (
              <div key={idx} className="min-w-full px-2 sm:px-0">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Quote size={18} className="text-[#4a9d9c]" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{r.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{r.text}</p>
                  <p className="mt-5 text-sm font-semibold text-slate-900">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                idx === activeIndex ? 'bg-[#4a9d9c]' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;

