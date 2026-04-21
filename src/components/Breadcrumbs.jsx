import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index === 0 && item.name === 'Home' ? (
                <Link 
                  to="/" 
                  className="text-gray-500 hover:text-[#4a9d9c] transition-colors flex items-center"
                  aria-label="Home"
                >
                  <Home size={16} />
                </Link>
              ) : index > 0 ? (
                <>
                  <ChevronRight size={16} className="text-gray-400 mx-2" />
                  {index === items.length - 1 ? (
                    <span className="text-gray-900 font-medium" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link 
                      to={item.url} 
                      className="text-gray-500 hover:text-[#4a9d9c] transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
