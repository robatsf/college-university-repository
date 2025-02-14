import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {api} from '../../uites/api/APIResponseValidator';

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

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);    
      const response = await api.request('users/login/', {
        method: 'POST',
        data: formData,
        form: form, // Pass form instance for automatic error handling
        toaster: {
          onSuccess: (message) => {
            toast.success(message || 'Signin successful');
          },
          onError: (message) => {
            toast.error(message || 'Signin failed. Please try again.');
          },
        }
      });

      if (response?.access_token) {
          localStorage.setItem('access_token', response?.access_token);
        }
        if (response?.refresh_token) {
          localStorage.setItem('refresh_token', response?.refresh_token);
        }

        navigate('/login');
    } catch (error) {
      // Error is already handled by the API handler
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showPassword,
    togglePassword,
    onSubmit,
  };
};