import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { api } from '../../uites/api/APIResponseValidator';

// Define the schema for the forgot password form
const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);


  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await api.request('users/password/reset/', {
        method: 'POST',
        data: data,
        toaster: {
          onSuccess: (message) => {
            toast.success(message || 'Password reset instructions have been sent to your email.');
          },
          onError: (message) => {
            toast.error(message || 'Password reset  request failed');
          },
        }
      });

      if(response){
      setIsEmailSent(true);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isEmailSent,
    setIsEmailSent,
    onSubmit,
  };
};