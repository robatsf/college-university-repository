import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../uites/api/APIResponseValidator'; // Import the API handler we created

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
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const { watch, handleSubmit } = form;

  const watchUsername = watch('username');
  const watchEmail = watch('email');
  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirm_password');

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);    
      const response = await api.request('users/register-guest/', {
        method: 'POST',
        data: formData,
        form: form,
        redirectOnSuccess: '/login', // Redirect to verification page on success
        redirectDelay: 2500, // Optional: delay in milliseconds before redirect
        toaster: {
          onSuccess: (message) => {
            toast.success(message || 'Registration successful! Verifcation Email sent');
          },
          onError: (message) => {
            toast.error(message || 'Registration failed. Please try again.');
          },
        }
      });
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
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    watchUsername,
    watchEmail,
    watchPassword,
    watchConfirmPassword,
    passwordStrength,
    onSubmit: handleSubmit(onSubmit),
  };
};