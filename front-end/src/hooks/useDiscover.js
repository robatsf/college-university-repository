// hooks/useDiscover.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BackendUrl from './config';

export const useDiscover = () => {
  const {
    data: popularData,
    isLoading: isLoadingPopular,
    error: popularError
  } = useQuery({
    queryKey: ['popularSearches'],
    queryFn: async () => {
      const response = await axios.get(`${BackendUrl.file}/search/popular/`);
      return response.data;
    }
  });

  const {
    data: trendingData,
    isLoading: isLoadingTrending,
    error: trendingError
  } = useQuery({
    queryKey: ['trendingTopics'],
    queryFn: async () => {
      const response = await axios.get(`${BackendUrl.file}/search/recent/`);
      return response.data;
    }
  });

  return {
    popularSearches: popularData?.results || [],
    trendingTopics: trendingData?.results || [],
    isLoading: isLoadingPopular || isLoadingTrending,
    error: popularError || trendingError,
    popularCount: popularData?.count || 0,
    trendingCount: trendingData?.count || 0
  };
};