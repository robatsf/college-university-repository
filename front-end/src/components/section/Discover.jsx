// components/sections/Discover.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDiscover } from '../../hooks/useDiscover';
import { 
  Tag, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Search,
  ChevronRight 
} from 'lucide-react';
import { Skeleton } from '@mui/material';

export default function Discover() {
  const { 
    popularSearches, 
    trendingTopics, 
    isLoading, 
    error 
  } = useDiscover();

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading discover data. Please try again later.
      </div>
    );
  }

  const LoadingKeywords = () => (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width={120}
          height={32}
          sx={{ borderRadius: '9999px' }}
        />
      ))}
    </div>
  );

  const LoadingTopics = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={80}
          sx={{ borderRadius: '8px' }}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#0066CC]" />
          <h2 className="text-xl font-semibold text-gray-900">Discover</h2>
        </div>
      </div>

      {/* Popular Keywords */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Popular Keywords</h3>
        </div>
        {isLoading ? (
          <LoadingKeywords />
        ) : (
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((keyword,index) => (
              <Link
                key={keyword.query + index}
                to={`browsedetail/search?q=${encodeURIComponent(keyword.query)}`}
                className="group"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                              text-sm border border-[#0066CC]/20 hover:border-[#0066CC] 
                              hover:bg-[#0066CC]/5 transition-all duration-200">
                  <span className="text-gray-700 group-hover:text-[#0066CC]">
                    {keyword.query}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-[#0066CC]/70">
                    {keyword.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Trending Topics</h3>
        </div>
        {isLoading ? (
          <LoadingTopics />
        ) : (
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <Link
                key={topic.query}
                to={`browsedetail/search?q=${encodeURIComponent(topic.query)}`}
                className="group block"
              >
                <div className="p-3 rounded-lg hover:bg-[#0066CC]/5 
                              transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 
                                 group-hover:text-[#0066CC]">
                      {topic.query}
                    </h4>
                    <ChevronRight className="h-4 w-4 text-gray-400 
                                          group-hover:text-[#0066CC] 
                                          group-hover:transform 
                                          group-hover:translate-x-1 
                                          transition-all" />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      {topic.count} searches
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(topic.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}