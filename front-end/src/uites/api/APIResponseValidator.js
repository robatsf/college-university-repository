import axios from 'axios';
import { useState, useEffect } from 'react';

export class ApiHandler {
  constructor(defaultConfig) {
    this.config = {
      baseURL: defaultConfig.baseURL || 'http://localhost:8000/api',
      timeout: defaultConfig.timeout || 15000,
      isDevelopment: defaultConfig.isDevelopment || false,
      setAccessToken: defaultConfig.setAccessToken || (() => {}),
      setRefreshToken: defaultConfig.setRefreshToken || (() => {}),
      retrieveAccessTokenFromHeader: defaultConfig.retrieveAccessTokenFromHeader || (() => null),
      autoFetch: defaultConfig.autoFetch ?? true,
      ...defaultConfig,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const newToken = this.config.retrieveAccessTokenFromHeader(response.headers);
        if (newToken) {
          this.config.setAccessToken(newToken);
        }
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.axiosInstance.post('/auth/refresh', {
                refresh_token: refreshToken,
              });
              const newAccessToken = response.data.access_token;
              this.config.setAccessToken(newAccessToken);
              
              const originalRequest = error.config;
              if (originalRequest) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return this.axiosInstance(originalRequest);
              }
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  handleFormErrors(errors, form, toaster) {
    if (!form || !errors) return;    
    try {
      Object.entries(errors[0]).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        const cleanMessage = message.replace(/^"|"$/g, '');
    
        form.setError(field, { message: cleanMessage });
        // and with toster
        toaster.onError(cleanMessage);
  
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          element.classList.add('border-red-500');
        }
      });
  
    } catch (e) {
      console.error('Error parsing form errors:', e);
      if (toaster?.onError) {
        toaster.onError('An error occurred during form submission');
      }
    }
  }

  handleError(error, options) {
    const errors = error.response?.data?.errors;
    
    if (options?.form && errors) {
      this.handleFormErrors(errors, options.form, options.toaster);
    }

    const errorMessage = error.response?.data?.message || 'An error occurred';
  
    if (options?.toaster?.onError) {
      options.toaster.onError(errorMessage);
    }
    
    // Handle redirect on error if specified
    if (options?.redirectOnError) {
      if (typeof window !== 'undefined') {
        window.location.href = options.redirectOnError;
      }
    }
  
    if (this.config.isDevelopment) {
      console.error('API Error:', error);
    }
  
    return errorMessage;
  }

  clearFormErrors(form) {
    if (!form) return;
    
    form.clearErrors();
    const formFields = Object.keys(form.getValues());
    formFields.forEach(field => {

      const element = document.querySelector(`[name="${field}"]`);
      if (element) {
        element.classList.remove('border-red-500');
        const errorDiv = element.parentElement.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
      }
    });
  }

  async request(endpoint, options = {}) {
    try {
      if (options.form) {
        this.clearFormErrors(options.form);
      }

      const response = await this.axiosInstance({
        url: endpoint,
        method: options.method || 'GET',
        headers: options.headers,
        params: options.params,
        data: options.data,
      });

      return this.handleSuccess(response, options);
    } catch (error) {
      const errorMessage = this.handleError(error, options);
      throw new Error(errorMessage);
    }
  }
  handleSuccess(response, options) {
    if (!response) return null;

    const successData = {
      data: response.data || null,
      message: response.data.message || 'Success',
      main: response,
      status: true
    };
  
    if (options?.toaster?.onSuccess) {
      options.toaster.onSuccess(successData.message);
    }
    
    // Handle redirect on success if specified
    if (options?.redirectOnSuccess) {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = options.redirectOnSuccess;
        }, options.redirectDelay || 0);
      }
    }
  
    return successData.data;
  }
}



export const useApiRequest = (api, endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (options.form) {
        api.clearFormErrors(options.form);
      }

      const response = await api.axiosInstance({
        url: endpoint,
        method: options.method || 'GET',
        headers: options.headers,
        params: options.params,
        data: options.data,
        signal: options.signal,
      });

      setData(response.data);

      if (options.toaster?.onSuccess) {
        options.toaster.onSuccess(response.data?.message || 'Success');
      }
      
      // Handle redirect on success if specified
      if (options?.redirectOnSuccess) {
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = options.redirectOnSuccess;
          }, options.redirectDelay || 0);
        }
      }
    } catch (error) {
      const errorMessage = api.handleError(error, options);
      setError(errorMessage);
      
      // Handle redirect on error if specified
      if (options?.redirectOnError) {
        if (typeof window !== 'undefined') {
          window.location.href = options.redirectOnError;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (api.config.autoFetch) {
      fetchData();
    }
  }, [endpoint]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

export const api = new ApiHandler({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  isDevelopment: import.meta.env.DEV || false,
  timeout: 150000,
  setAccessToken: (token) => localStorage.setItem('access_token', token),
  setRefreshToken: (token) => localStorage.setItem('refresh_token', token),
  retrieveAccessTokenFromHeader: (headers) => headers['new-access-token'],
  autoFetch: true,
});