import { Link } from 'react-router-dom';
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
import { Loader2, Mail, Lock, Check, X, Eye, EyeOff, Home } from 'lucide-react';
import { useLogin } from '../../hooks/auth/UserLogin';

export default function Login() {
  const { form, isLoading, showPassword, togglePassword, onSubmit } = useLogin();
  const watchEmail = form.watch('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 p-2 rounded-full bg-white 
                   shadow-lg hover:shadow-xl transition-all duration-200 
                   group hover:scale-105 z-50"
      >
        <Home className="h-5 w-5 text-[#0066CC] group-hover:text-[#0052A3]" />
      </Link>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#0066CC]">Welcome Back</h2>
          <p className="text-sm text-gray-600 mt-1">
            Please sign in to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="name@example.com"
                        className={`pl-9 h-10 text-sm
                          ${form.formState.errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : field.value && !form.formState.errors.email
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-gray-200'}
                          focus:ring-[#0066CC]/20`}
                      />
                      {watchEmail && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {form.formState.errors.email ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm text-gray-700">
                      Password
                    </FormLabel>
                    <Link
                      to="/forgotpassword"
                      className="text-xs text-[#0066CC] hover:text-[#0052A3] 
                                 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`pl-9 pr-10 h-10 text-sm
                          ${form.formState.errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : field.value && !form.formState.errors.password
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-gray-200'}
                          focus:ring-[#0066CC]/20`}
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2
                                   text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button and Links */}
            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className={`w-full h-10 transition-colors duration-200 rounded-lg text-sm
                           ${form.formState.isValid
                             ? 'bg-[#0066CC] hover:bg-[#0052A3] text-white'
                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#0066CC] hover:text-[#0052A3] font-medium
                             transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}