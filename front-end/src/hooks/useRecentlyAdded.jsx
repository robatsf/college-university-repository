// hooks/useRecentlyAdded.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import BackendUrl from './config';

export const useRecentlyAdded = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        // Get current year
        const currentYear = new Date().getFullYear();
        const response = await axios.get(`${BackendUrl.file}/search/?year=${currentYear}&limit=1`);
        
        const transformedData = response.data.results.map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          department: item.department,
          date: new Date(item.created_at).toISOString().split('T')[0],
          views: item.views_count || 0,
          downloads: item.downloads_count || 0,
          type: item.file_type || 'Document'
        }));

        const sortedItems = transformedData.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        ).slice(0, 5);

        setRecentItems(sortedItems);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch recent items');
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

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

  const refreshData = () => {
    setIsLoading(true);
    setError(null);
    fetchRecentItems();
  };

  return {
    isLoading,
    recentItems,
    error,
    RecentlyAddedSkeleton,
    refreshData
  };
};