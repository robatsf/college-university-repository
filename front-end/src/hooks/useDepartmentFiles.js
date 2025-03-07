import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import BackendUrl from './config';

export function useDepartmentFiles() {
  const { id: departmentSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });
  
  // Use a ref to track if we're in the first render cycle
  const isInitialMount = useRef(true);
  // Use a ref to store the previous search params to avoid unnecessary fetches
  const prevSearchParamsRef = useRef(searchParams.toString());

  // Extract search parameters outside of the fetch function
  const page = searchParams.get('page') || 1;
  const searchQuery = searchParams.get('q');
  const departmentName = searchParams.get('department');
  
  const fetchFiles = useCallback(async () => {
    const currentSearchParams = searchParams.toString();
    if (currentSearchParams === prevSearchParamsRef.current && !isInitialMount.current) {
      return;
    }
    
    // Update the previous search params ref
    prevSearchParamsRef.current = currentSearchParams;
    
    setPagination(prev => ({ ...prev, currentPage: Number(page) }));
    setLoading(true);

    try {
      const url = new URL(`${BackendUrl.file}/search/search/`);
  
      if (departmentName) {
        url.searchParams.append('department', departmentName);
      }
      if (searchQuery) {
        url.searchParams.append('q', searchQuery);
      }
      url.searchParams.append('page', page);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      
      // Properly handle the nested results structure
      if (data.results && data.results.results) {
        setFiles(data.results.results);
      } else if (Array.isArray(data.results)) {
        setFiles(data.results);
      } else {
        setFiles([]);
      }
      
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: Number(page),
      });
    } catch (err) {
      setError(err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, departmentName]);

  useEffect(() => {
    // Mark that we're past the initial mount after the first effect run
    if (isInitialMount.current) {
      fetchFiles();
      isInitialMount.current = false;
    } else {
      // Only fetch if the search params have changed
      const currentSearchParams = searchParams.toString();
      if (currentSearchParams !== prevSearchParamsRef.current) {
        fetchFiles();
      }
    }
  }, [fetchFiles, searchParams]);

  return { 
    files, 
    loading, 
    error, 
    pagination, 
    setSearchParams,
    currentDepartment: searchParams.get('department') || '',
    searchQuery: searchParams.get('q') || ''
  };
}