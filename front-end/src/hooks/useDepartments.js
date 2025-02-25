import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BackendUrl from './config';

export const useDepartments = () => {
  const {
    data: departmentsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await axios.get(`${BackendUrl.file}/search/filters/`);
      return response.data;
    }
  });

  const departments = departmentsData?.departments || [];
  
  const stats = {
    totalItems: departments.reduce((acc, curr) => acc + curr.count, 0),
    totalDepartments: departments.length,
    latestUpdate: departments.length > 0 
      ? new Date(Math.max(...departments.map(d => new Date(d.latest_file))))
      : null
  };

  const colorVariants = {
    0: 'bg-blue-50 text-blue-600 border-blue-100',
    1: 'bg-orange-50 text-orange-600 border-orange-100',
    2: 'bg-green-50 text-green-600 border-green-100',
    3: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return {
    departments,
    isLoading,
    error,
    stats,
    colorVariants
  };
};