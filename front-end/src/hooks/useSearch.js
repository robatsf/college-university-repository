import { useState, useEffect } from 'react';
import axios from 'axios';
import BackendUrl from './config';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Parse search query to extract filter and search term
  const parseSearchQuery = (query) => {
    const filterMatch = query.match(/^@(\w+)\s*(.*)/);
    if (filterMatch) {
      return {
        filter: filterMatch[1],
        searchTerm: filterMatch[2].trim()
      };
    }
    return {
      filter: null,
      searchTerm: query.trim()
    };
  };

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

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        setError(null);

        try {
          const { filter, searchTerm } = parseSearchQuery(searchQuery);
          let endpoint = `${BackendUrl.file}/search/search/?`;
          
          const params = new URLSearchParams();
          
          if (filter) {
            params.append(filter, searchTerm);
          } else {
            params.append('q', searchQuery);
          }

          const response = await axios.get(`${endpoint}${params.toString()}`);
          setSearchResults(response.data.results.results || []);
          
          // Update active filter
          setActiveFilter(filter);
          
        } catch (err) {
          setError('Error performing search');
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setActiveFilter(null);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleFilterSearch = (filterType) => {
    setSearchQuery(`@${filterType} `);
  };

  const clearFilter = () => {
    const searchTerm = searchQuery.replace(/^@\w+\s*/, '');
    setSearchQuery(searchTerm);
    setActiveFilter(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSearches,
    isLoading,
    error,
    activeFilter,
    handleFilterSearch,
    clearFilter,
    setIsSearchFocused 
  };
}