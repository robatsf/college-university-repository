import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Help & Guide</h2>
      
      {/* Introduction Section */}
      <div className="mb-6">
        <p className="text-gray-700">
          Welcome to the help page! Here you can find guidance on how to explore and discover content on our platform.
        </p>
      </div>

      {/* Browse Section Explanation */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Browse Section</h3>
        <p className="text-gray-700 mb-3">
          In the "Browse" section, you can explore content through different categories such as Communities, Date, Authors, and Titles. 
          Each category provides a different way to find content based on specific attributes:
        </p>
        
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Communities & Collections: Explore works grouped by communities and collections.</span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>By Date: Find items based on the date they were published.</span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Authors: Discover works by specific authors.</span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Titles: Search through item titles to find specific works.</span>
          </li>
        </ul>
      </div>

      {/* Discover Section Explanation */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Discover Section</h3>
        <p className="text-gray-700 mb-3">
          The "Discover" section helps you find trending topics and popular search keywords. Here's how you can use them:
        </p>
        
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Popular Keywords: Shows the most searched queries on the platform.</span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Trending Topics: Displays the most talked-about topics on the platform.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
