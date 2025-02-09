import { useState, useEffect } from "react";
import { Clock, ArrowRight } from 'lucide-react';


const   RecentHistorySection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const recentActivities = [
      {
        action: "Project Submitted",
        project: "AI Research Paper",
        timestamp: "2 hours ago"
      },
      {
        action: "Feedback Received",
        project: "Data Analysis Report",
        timestamp: "Yesterday"
      },
      {
        action: "Project Updated",
        project: "Machine Learning Model",
        timestamp: "3 days ago"
      },
      {
        action: "Comment Added",
        project: "Database Design",
        timestamp: "4 days ago"
      },
      {
        action: "Review Completed",
        project: "Web Application",
        timestamp: "5 days ago"
      },
      {
        action: "Project Started",
        project: "Mobile App Development",
        timestamp: "1 week ago"
      }
    ];
  
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
        isExpanded ? 'flex-grow' : ''
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Activity
          </h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {!isExpanded ? 'Show Less' : 'View All'}
          </button>
        </div>
  
        <div className={`space-y-4 overflow-y-auto transition-all duration-300 ${
          isExpanded ? 'max-h-[calc(100vh-400px)]' : 'max-h-[300px]'
        }`}>
          {recentActivities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.project}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{activity.timestamp}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
  
        {isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
    );
  };

export default RecentHistorySection;