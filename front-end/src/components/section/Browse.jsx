import { FileText, Calendar, Users, Bookmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackendUrl from '../../hooks/config';


export default function Browse() {


  const browseItems = [
    { 
      icon: Bookmark, 
      text: 'Titles',
      filter: 'title',
      description: 'Search through item titles'
    },
    { 
      icon: Users, 
      text: 'Authors',
      filter: 'author',
      description: 'Explore works by author names'
    },
    { 
      icon: FileText, 
      text: 'Academic Departments Collections',
      filter: 'department',
      description: 'Browse through all communities and collections'
    },
    { 
      icon: Calendar, 
      text: 'By Date',
      filter: 'year',
      description: 'Find items by date of publication'
    },
  ];

  const handleBrowseClick = (filter) => {
    window.location = `${BackendUrl.home}/?filter=${filter}`
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Browse</h2>
      
      <ul className="space-y-2">
        {browseItems.map((item) => (
          <li key={item.text}>
            <button
              onClick={() => handleBrowseClick(item.filter)}
              className="w-full group flex items-start justify-between p-3 rounded-lg hover:bg-[#0066CC]/5 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0066CC]/10 rounded-lg group-hover:bg-[#0066CC]/20 transition-colors">
                  <item.icon className="h-4 w-4 text-[#0066CC]" />
                </div>
                
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-[#0066CC] transition-colors">
                    {item.text}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 transition-colors">
                    {item.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066CC] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Need help finding something specific?{' '}
        <Link 
          to="/help" 
          className="text-[#0066CC] hover:underline font-medium"
        >
          View search tips
        </Link>
      </div>
    </div>
  );
}
