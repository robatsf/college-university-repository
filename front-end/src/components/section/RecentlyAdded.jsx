// components/sections/RecentlyAdded.jsx
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Building2, 
  Calendar,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';

// Loading Skeleton Component
const RecentlyAddedSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
    </div>

    {/* Items Skeleton */}
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-100 pb-6">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function RecentlyAdded() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setRecentItems([
          {
            id: 1,
            title: 'Advanced Machine Learning Techniques in Healthcare',
            author: 'John Doe',
            department: 'College of Computing',
            date: '2024-02-20',
            views: 156,
            downloads: 42,
            type: 'Research Paper'
          },
          {
            id: 2,
            title: 'Sustainable Energy Systems: A Comprehensive Review',
            author: 'Jane Smith',
            department: 'College of Engineering',
            date: '2024-02-19',
            views: 123,
            downloads: 35,
            type: 'Thesis'
          },
          {
            id: 3,
            title: 'Digital Transformation in Modern Business',
            author: 'Mike Johnson',
            department: 'College of Business',
            date: '2024-02-18',
            views: 98,
            downloads: 27,
            type: 'Conference Paper'
          },         {
            id: 3,
            title: 'Digital Transformation in Modern Business',
            author: 'Mike Johnson',
            department: 'College of Business',
            date: '2024-02-18',
            views: 98,
            downloads: 27,
            type: 'Conference Paper'
          },         {
            id: 3,
            title: 'Digital Transformation in Modern Business',
            author: 'Mike Johnson',
            department: 'College of Business',
            date: '2024-02-18',
            views: 98,
            downloads: 27,
            type: 'Conference Paper'
          }
        ]);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  if (isLoading) {
    return <RecentlyAddedSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Unable to load recent items</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#0066CC]" />
          <h2 className="text-xl font-semibold text-gray-900">Recently Added</h2>
        </div>
        <Link to="/recent">
          <Button 
            variant="outline" 
            className="text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5"
          >
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Recent Items List */}
      <div className="space-y-6">
        {recentItems.map((item) => (
          <div 
            key={item.id}
            className="group border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          >
            <Link to={`/items/${item.id}`}>
              <h3 className="font-medium text-gray-900 group-hover:text-[#0066CC] 
                           transition-colors duration-200 mb-3">
                {item.title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{item.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Stats and Type */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{item.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{item.downloads}</span>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full 
                             bg-[#0066CC]/10 text-[#0066CC]">
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Show when no items */}
      {recentItems.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No recent items to display</p>
        </div>
      )}
    </div>
  );
}