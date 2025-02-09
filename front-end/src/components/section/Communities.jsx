// components/sections/Communities.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';

export default function Communities() {
  const communities = [
    { 
      title: 'College of Computing',
      items: 1234,
      icon: BookOpen,
      description: 'Computer Science, Information Technology, and Digital Innovation',
      recentUpdates: 23,
      color: 'blue'
    },
    { 
      title: 'College of Engineering',
      items: 2567,
      icon: Building2,
      description: 'Mechanical, Electrical, and Civil Engineering Research',
      recentUpdates: 45,
      color: 'orange'
    },
    { 
      title: 'College of Business',
      items: 987,
      icon: Users,
      description: 'Business Administration, Economics, and Management',
      recentUpdates: 15,
      color: 'green'
    },
    { 
      title: 'College of Sciences',
      items: 1789,
      icon: GraduationCap,
      description: 'Physics, Chemistry, Biology, and Mathematics',
      recentUpdates: 32,
      color: 'purple'
    }
  ];

  const colorVariants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communities in IR</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse research works by academic communities
          </p>
        </div>
        <Link to="/communities">
          <Button variant="outline" className="text-[#0066CC] border-[#0066CC]/20 
                                            hover:bg-[#0066CC]/10">
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community) => (
          <Link 
            key={community.title} 
            to={`/communities/${community.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="group p-4 border-2 border-gray-100 rounded-lg 
                          hover:border-[#0066CC]/20 transition-all duration-300 
                          hover:shadow-md">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg transition-colors duration-300 
                               ${colorVariants[community.color]}`}>
                  <community.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0066CC] 
                                   transition-colors duration-300">
                        {community.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {community.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 
                                          group-hover:text-[#0066CC] 
                                          group-hover:transform group-hover:translate-x-1 
                                          transition-all" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{community.items.toLocaleString()} items</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{community.recentUpdates} recent updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0066CC]">
              {communities.reduce((acc, curr) => acc + curr.items, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0066CC]">
              {communities.length}
            </div>
            <div className="text-sm text-gray-600">Communities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0066CC]">
              {communities.reduce((acc, curr) => acc + curr.recentUpdates, 0)}
            </div>
            <div className="text-sm text-gray-600">Recent Updates</div>
          </div>
        </div>
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