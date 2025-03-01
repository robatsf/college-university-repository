// hooks/useAdvancedSearch.js
import { useState, useCallback, useMemo } from 'react';
import { useSearch } from './useSearch';

export const useAdvancedSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSearches,
    isLoading,
    error,
    activeFilter,
    handleFilterSearch,
    clearFilter
  } = useSearch();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filterTypes = useMemo(() => ({
    title: {
      label: 'Titles',
      icon: 'Bookmark',
      description: 'Search through item titles'
    },
    author: {
      label: 'Authors',
      icon: 'Users',
      description: 'Search by author names'
    },
    department: {
      label: 'Departments',
      icon: 'FileText',
      description: 'Search by academic departments'
    },
    year: {
      label: 'Year',
      icon: 'Calendar',
      description: 'Search by publication year',
      validate: (value) => !isNaN(value) && parseInt(value) > 1900
    }
  }), []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchFocused(false);
  }, [setSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSearches,
    isLoading,
    error,
    isSearchFocused,
    setIsSearchFocused,
    activeFilter,
    handleFilterSearch,
    clearFilter,
    clearSearch,
    filterTypes
  };
};