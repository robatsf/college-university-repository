import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import BackendUrl from '../config';
import validator from '../../uites/api/APIResponseValidator';

// Define the registration schema
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchUsername = form.watch('username');
  const watchEmail = form.watch('email');
  const watchPassword = form.watch('password');
  const watchConfirmPassword = form.watch('confirmPassword');

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength({
        length: watchPassword.length >= 8,
        uppercase: /[A-Z]/.test(watchPassword),
        lowercase: /[a-z]/.test(watchPassword),
        number: /[0-9]/.test(watchPassword),
        special: /[^A-Za-z0-9]/.test(watchPassword),
      });
    }
  }, [watchPassword]);

  async function onSubmit(data) {
    setIsLoading(true);

    try {
      const response = await fetch(`${BackendUrl.apiUrl}/users/register-guest/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
        }),
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
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    watchUsername,
    watchEmail,
    watchPassword,
    watchConfirmPassword,
    passwordStrength,
    onSubmit,
  };
};