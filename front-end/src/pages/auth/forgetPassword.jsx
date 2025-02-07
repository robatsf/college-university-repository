import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { useToast } from "../../components/ui/toast/toast-context";
import { Loader2, Mail, ArrowLeft, Check } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsEmailSent(true);
      
      toast({
        title: "Email Sent",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We've sent password reset instructions to your email address.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-10 bg-[#0066CC] hover:bg-[#0052A3] text-white
                       transition-colors duration-200 rounded-lg text-sm"
            >
              Back to Login
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsEmailSent(false)}
              className="w-full h-10 text-sm border-gray-200 hover:bg-gray-50"
            >
              Didn't receive the email? Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#0066CC]">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        {...field}
                        placeholder="name@example.com" 
                        className={`pl-9 h-10 text-sm border-gray-200 dark:border-gray-700
                                 focus:border-[#0066CC] focus:ring-[#0066CC]/20
                                 dark:bg-gray-800 dark:text-white
                                 ${form.formState.errors.email ? 
                                   'border-red-500 focus:border-red-500' : 
                                   field.value && !form.formState.errors.email ?
                                   'border-green-500 focus:border-green-500' :
                                   'border-gray-200'}`}
                      />
                      {field.value && !form.formState.errors.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <Button 
                type="submit" 
                disabled={isLoading || !form.formState.isValid}
                className={`w-full h-10 transition-colors duration-200 rounded-lg text-sm
                           ${form.formState.isValid ? 
                             'bg-[#0066CC] hover:bg-[#0052A3] text-white' : 
                             'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full h-10 text-sm text-gray-600 hover:text-gray-800
                         hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Remember your password?{' '}
          <Link 
            to="/login"
            className="text-[#0066CC] hover:text-[#0052A3] transition-colors duration-200"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}