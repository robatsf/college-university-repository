import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Users, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { useDepartments } from '../../hooks/useDepartments';

export default function Departments() {
  const { departments, isLoading, error, stats, colorVariants } = useDepartments();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-2 border-gray-100 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-red-500">
        Error loading departments
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Academic Departments</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse research works by department
          </p>
        </div>
        <Link to="/departments">
          <Button variant="outline" className="text-[#0066CC] border-[#0066CC]/20 
                                            hover:bg-[#0066CC]/10">
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept, index) => (
          <Link 
            key={dept.name} 
            to={`/departments/${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="group p-4 border-2 border-gray-100 rounded-lg 
                          hover:border-[#0066CC]/20 transition-all duration-300 
                          hover:shadow-md">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg transition-colors duration-300 
                               ${colorVariants[index % 4]}`}>
                  <Building2 className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0066CC] 
                                   transition-colors duration-300">
                        {dept.name}
                      </h3>
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
                      <span>{dept.count.toLocaleString()} items</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Last updated: {new Date(dept.latest_file).toLocaleDateString()}</span>
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
              {stats.totalItems.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0066CC]">
              {stats.totalDepartments}
            </div>
            <div className="text-sm text-gray-600">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0066CC]">
              {stats.latestUpdate ? stats.latestUpdate.toLocaleDateString() : '-'}
            </div>
            <div className="text-sm text-gray-600">Latest Update</div>
          </div>
        </div>
      </div>
    </div>
  );
}