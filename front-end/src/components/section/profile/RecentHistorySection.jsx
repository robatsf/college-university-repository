// components/RecentHistorySection.jsx
import { Clock, ArrowRight, Loader } from 'lucide-react';
import { useRecentActivities } from '../../../hooks/usehistory';

const RecentHistorySection = ({refreshKey}) => {
  const {
    activities,
    isLoading,
    error,
    isExpanded,
    toggleExpand,
    formatTimestamp
  } = useRecentActivities(refreshKey);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center h-[300px]">
          <Loader className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 text-center">
          Failed to load recent activities
        </div>
      </div>
    );
  }

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
          onClick={toggleExpand}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          {!isExpanded ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className={`space-y-4 overflow-y-auto transition-all duration-300 ${
        isExpanded ? 'max-h-[calc(100vh-400px)]' : 'max-h-[300px]'
      }`}>
        {activities.map((activity, index) => (
          <div 
            key={activity.id || index}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.project}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {activity.time_ago}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
          <div className='text-center text-amber-300'>
            None found
          </div>
      </div>

      {isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default RecentHistorySection;