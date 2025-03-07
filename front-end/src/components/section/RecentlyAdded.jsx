// components/sections/RecentlyAdded.jsx
import React from 'react';
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
import { useRecentlyAdded } from '../../hooks/useRecentlyAdded';

export default function RecentlyAdded() {
  const { isLoading, recentItems, error, RecentlyAddedSkeleton } = useRecentlyAdded();

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
        {/* <Link to="">
          <Button 
            variant="outline" 
            className="text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5"
          >
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link> */}
      </div>

      {/* Recent Items List */}
      <div className="space-y-6">
        {recentItems.map((item) => (
          <div 
            key={item.id}
            className="group border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          >
            <Link to={`/fileViwe/${item.id}`}>
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
            {/* <div className="flex items-center justify-between mt-3">
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
            </div> */}
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