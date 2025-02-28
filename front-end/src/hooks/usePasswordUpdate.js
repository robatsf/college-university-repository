// hooks/usePasswordUpdate.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BackendUrl from './config';
import tokenManager from '../uites/tokenManager';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different",
  path: ["newPassword"],
});

export const usePasswordUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNewPasswordFocus = () => setIsNewPasswordFocused(true);
  const handleNewPasswordBlur = () => setIsNewPasswordFocused(false);

  const getPasswordRequirements = (password) => {
    return [
      {
        id: 'length',
        regex: /.{8,}/,
        message: 'At least 8 characters',
        met: password?.length >= 8,
      },
      {
        id: 'uppercase',
        regex: /[A-Z]/,
        message: 'Contains uppercase letter',
        met: /[A-Z]/.test(password || ''),
      },
      {
        id: 'lowercase',
        regex: /[a-z]/,
        message: 'Contains lowercase letter',
        met: /[a-z]/.test(password || ''),
      },
      {
        id: 'number',
        regex: /[0-9]/,
        message: 'Contains number',
        met: /[0-9]/.test(password || ''),
      },
      {
        id: 'special',
        regex: /[^A-Za-z0-9]/,
        message: 'Contains special character',
        met: /[^A-Za-z0-9]/.test(password || ''),
      },
    ];
  };

  const updatePassword = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BackendUrl.file}/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`,
        },
        body: JSON.stringify({
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('currentPassword', {
            type: 'manual',
            message: 'Current password is incorrect',
          });
        }
        throw new Error(responseData.message || 'Failed to update password');
      }

      reset();
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(updatePassword);

  return {
    register,
    onSubmit,
    errors,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    isMatching: newPassword === confirmPassword && newPassword !== '',
    watch,
    getPasswordRequirements,
    isNewPasswordFocused,
    handleNewPasswordFocus,
    handleNewPasswordBlur,
  };
};