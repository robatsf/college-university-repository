// components/sections/Discover.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Search,
  ChevronRight 
} from 'lucide-react';
import { Button } from '../ui/button';

export default function Discover() {
  const keywords = [
    { text: 'Machine Learning', count: 234 },
    { text: 'AI', count: 189 },
    { text: 'IoT', count: 156 },
    { text: 'Blockchain', count: 145 },
    { text: 'Sustainability', count: 132 }
  ];

  const topics = [
    { 
      title: 'Artificial Intelligence',
      trend: 'up',
      papers: 156,
      recentUpdates: 12
    },
    { 
      title: 'Sustainable Development',
      trend: 'up',
      papers: 123,
      recentUpdates: 8
    },
    { 
      title: 'Digital Innovation',
      trend: 'up',
      papers: 98,
      recentUpdates: 15
    }
  ];

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
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Link
              key={keyword.text}
              to={`/search?q=${encodeURIComponent(keyword.text)}`}
              className="group"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                            text-sm border border-[#0066CC]/20 hover:border-[#0066CC] 
                            hover:bg-[#0066CC]/5 transition-all duration-200">
                <span className="text-gray-700 group-hover:text-[#0066CC]">
                  {keyword.text}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-[#0066CC]/70">
                  {keyword.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              to={`/topics/${topic.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group block"
            >
              <div className="p-3 rounded-lg hover:bg-[#0066CC]/5 
                            transition-all duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 
                               group-hover:text-[#0066CC]">
                    {topic.title}
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
                    {topic.papers} papers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {topic.recentUpdates} recent
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Search */}
      <div className="pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          className="w-full justify-center gap-2 text-[#0066CC] 
                     border-[#0066CC]/20 hover:bg-[#0066CC]/5"
          onClick={() => window.location.href = '/advanced-search'}
        >
          <Search className="h-4 w-4" />
          Advanced Search
        </Button>
      </div>

      {/* Optional: Loading State */}
      {/* {isLoading && (
        <div className="animate-pulse">
          // ... loading skeleton
        </div>
      )} */}
    </div>
  );
}