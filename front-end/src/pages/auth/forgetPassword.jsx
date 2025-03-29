
import { useNavigate } from 'react-router-dom';
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
import { Loader2, Mail, ArrowLeft, Check } from 'lucide-react';
import { useForgotPassword } from '../../hooks/auth/userForgotPassword';

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { form, isLoading, isEmailSent, setIsEmailSent, onSubmit } = useForgotPassword();

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-600">
              We've sent password reset instructions to your email address.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login')}
              className="w-full h-10 bg-[#0066CC] hover:bg-[#0052A3] text-white transition-colors duration-200 rounded-lg text-sm"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#0066CC]">Forgot Password?</h2>
          <p className="text-sm text-gray-600 mt-1">
            No worries, we'll send you reset instructions.
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
                        className={`pl-9 h-10 text-sm border-gray-200 focus:border-[#0066CC] focus:ring-[#0066CC]/20
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

            {/* Submit Button */}
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

              {/* Back to Login Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full h-10 text-sm text-gray-600 hover:text-white hover:bg-[#0066CC] transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </form>
        </Form>

        {/* Remember Password Link */}
        <div className="text-xs text-center text-gray-500 mt-4">
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
