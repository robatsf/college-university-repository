// hooks/usehistory.js
import { useState, useEffect } from 'react';
import BackendUrl from './config';
import tokenManager from '../uites/tokenManager';

export const useRecentActivities = (refreshKey) => { 
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BackendUrl.file}/activities/recent/`, {
        headers: {
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshKey]); // Add refreshKey to dependencies

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTimestamp = (timestamp) => {
    // Your existing timestamp formatting logic
  };

  return {
    activities,
    isLoading,
    error,
    isExpanded,
    toggleExpand,
    formatTimestamp
  };
};