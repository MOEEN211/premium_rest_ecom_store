import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { articles } from '../data/articles';

export default function ArticleDetails() {
  const { id } = useParams();
  const article = articles.find(a => a.id === parseInt(id));

  if (!article) {
    return (
      <div className="bg-white py-32 text-center min-h-[60vh]">
        <h2 className="text-2xl font-serif text-slate-900 mb-4">Article Not Found</h2>
        <Link to="/blogs" className="text-rose-600 hover:underline">Return to Articles</Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blogs" className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-10 transition">
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Link>

        <p className="text-sm text-rose-600 font-medium mb-4">{article.date}</p>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">{article.title}</h1>
        
        <div className="aspect-[16/9] w-full overflow-hidden mb-12 bg-gray-100">
          <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
