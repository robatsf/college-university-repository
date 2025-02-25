// components/sections/Browse.jsx

import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Users, 
  Tag, 
  Bookmark,
  ChevronRight
} from 'lucide-react';

export default function Browse() {
  const browseItems = [
    { 
      icon: FileText, 
      text: 'Communities & Collections',
      path: '/browse/communities',
      description: 'Browse through all communities and collections'
    },
    { 
      icon: Calendar, 
      text: 'By Date',
      path: '/browse/date',
      description: 'Find items by date of publication'
    },
    { 
      icon: Users, 
      text: 'Authors',
      path: '/browse/authors',
      description: 'Explore works by author names'
    },
    { 
      icon: Tag, 
      text: 'Subjects',
      path: '/browse/subjects',
      description: 'Browse items by subject categories'
    },
    { 
      icon: Bookmark, 
      text: 'Titles',
      path: '/browse/titles',
      description: 'Search through item titles'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Browse</h2>
      
      <ul className="space-y-2">
        {browseItems.map((item) => (
          <li key={item.text}>
            <Link
              to={item.path}
              className="group flex items-start justify-between p-3 rounded-lg
                         hover:bg-[#0066CC]/5 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0066CC]/10 rounded-lg 
                              group-hover:bg-[#0066CC]/20 transition-colors">
                  <item.icon className="h-4 w-4 text-[#0066CC]" />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-900 
                                group-hover:text-[#0066CC] transition-colors">
                    {item.text}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 
                              group-hover:text-gray-600 transition-colors">
                    {item.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 
                                    group-hover:text-[#0066CC] 
                                    group-hover:transform group-hover:translate-x-1 
                                    transition-all opacity-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Quick Stats */}
      {/* <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-[#0066CC]/5">
            <div className="text-sm font-medium text-gray-900">Total Items</div>
            <div className="text-2xl font-semibold text-[#0066CC]">15,234</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0066CC]/5">
            <div className="text-sm font-medium text-gray-900">Collections</div>
            <div className="text-2xl font-semibold text-[#0066CC]">142</div>
          </div>
        </div>
      </div> */}

      {/* Help Text */}
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

