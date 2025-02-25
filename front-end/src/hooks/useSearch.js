// hooks/useSearch.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import BackendUrl from './config'

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BackendUrl.file}/search/popular/`);
        setPopularSearches(response.data.results || []);
      } catch (err) {
        console.error('Error fetching popular searches:', err);
        setPopularSearches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularSearches();
  }, []);

  // Handle search query changes
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await axios.get(`${BackendUrl.file}/search/search/?q=${encodeURIComponent(searchQuery)}`);
          setSearchResults(response.data.results.results || []);
        } catch (err) {
          setError('Error performing search');
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSearches,
    isLoading,
    error
  };
}