import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import validator from '../../uites/api/APIResponseValidator';
import BackendUrl from '../config';

// Define the login schema
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BackendUrl.apiUrl}/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await validator.validateResponse(response, {
        method: 'POST',
        endpoint: `${BackendUrl.apiUrl}/users/register`
      });


      if (result.success) {
        toast.success(result.message || 'Registration successful! Please login.');
        navigate('/login');
      } else {
          toast.error(result.message || 'Registration failed');
           if (result.dev) {
                console.debug('Developer Info:', result.dev);
            }
      }
    } catch (error) {
      // Handle network or other critical errors
      const errorMessage = error.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : error.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please check your connection and try again.'
          : 'An unexpected error occurred. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    togglePassword,
    onSubmit,
  };
};