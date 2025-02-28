import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchFiles = async () => {
      const page = searchParams.get('page') || 1;
      const searchQuery = searchParams.get('q');
      const departmentName = searchParams.get('departemnt');

      setPagination(prev => ({ ...prev, currentPage: Number(page) }));
      setLoading(true);

      try {
        const url = new URL(`${BackendUrl.file}/search/`);
        
        // Add search parameters
        if (departmentName) {
          url.searchParams.append('department', departmentName);
        }
        if (searchQuery) {
          url.searchParams.append('title', searchQuery);
        }
        url.searchParams.append('page', page);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        setFiles(data.results);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
          currentPage: Number(page),
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [departmentSlug, searchParams]);

  return { 
    files, 
    loading, 
    error, 
    pagination, 
    setSearchParams,
    currentDepartment: searchParams.get('departemnt') || '',
    searchQuery: searchParams.get('q') || ''
  };
}