import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80';

export default function Articles() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-4">Sleep Articles &amp; Advice</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Expert guides, interior design inspiration, and tips for creating your perfect bedroom sanctuary.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {articles.map(article => (
            <Link 
              to={`/article/${article.id}`} 
              key={article.id} 
              className="flex flex-col group cursor-pointer h-full bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Article Image with fallback */}
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={article.img} 
                  alt={article.title} 
                  onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <p className="text-sm text-rose-600 font-semibold mb-2">{article.date}</p>
                <h2 className="text-xl sm:text-2xl font-serif text-slate-900 mb-3 group-hover:text-rose-600 transition line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">{article.excerpt}</p>
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <span className="text-slate-900 font-medium text-sm inline-flex items-center gap-1 hover:text-rose-600 transition">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
