
import {Link } from 'react-router-dom';
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
import { Loader2, User, Mail, Lock, KeyRound, Check, X, Eye, EyeOff,Home } from 'lucide-react';
import { useRegisterForm } from '../../hooks/auth/UserRegster';

const ValidationIndicator = ({ isValid }) => (
  isValid ? 
    <Check className="h-4 w-4 text-green-500" /> : 
    <X className="h-4 w-4 text-gray-300" />
);

export default function Register() {

  const {
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
  } = useRegisterForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

      {/* Home Button */}
    <Link
      to="/"
      className="absolute top-4 left-4 p-2 rounded-full bg-white dark:bg-gray-800 
                 shadow-lg hover:shadow-xl transition-all duration-200 
                 group hover:scale-105 z-50"
    >
      <Home className="h-5 w-5 text-[#0066CC] group-hover:text-[#0052A3]" />
    </Link>

    
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#0066CC]">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Join our community today
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        {...field}
                        placeholder="Enter username" 
                        className={`pl-9 h-10 text-sm
                          ${form.formState.errors.username ? 
                            'border-red-500 focus:border-red-500' : 
                            field.value && !form.formState.errors.username ?
                            'border-green-500 focus:border-green-500' :
                            'border-gray-200 dark:border-gray-700'}
                          focus:ring-[#0066CC]/20 dark:bg-gray-800 dark:text-white`}
                      />
                      {watchUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {form.formState.errors.username ? 
                            <X className="h-4 w-4 text-red-500" /> :
                            <Check className="h-4 w-4 text-green-500" />
                          }
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        {...field}
                        placeholder="name@example.com" 
                        className={`pl-9 h-10 text-sm
                          ${form.formState.errors.email ? 
                            'border-red-500 focus:border-red-500' : 
                            field.value && !form.formState.errors.email ?
                            'border-green-500 focus:border-green-500' :
                            'border-gray-200 dark:border-gray-700'}
                          focus:ring-[#0066CC]/20 dark:bg-gray-800 dark:text-white`}
                      />
                      {watchEmail && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {form.formState.errors.email ? 
                            <X className="h-4 w-4 text-red-500" /> :
                            <Check className="h-4 w-4 text-green-500" />
                          }
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
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password" 
                        className={`pl-9 pr-10 h-10 text-sm
                          ${form.formState.errors.password ? 
                            'border-red-500 focus:border-red-500' : 
                            field.value && !form.formState.errors.password ?
                            'border-green-500 focus:border-green-500' :
                            'border-gray-200 dark:border-gray-700'}
                          focus:ring-[#0066CC]/20 dark:bg-gray-800 dark:text-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2
                                 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </FormControl>
                  {watchPassword && (
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <ValidationIndicator isValid={passwordStrength.length} />
                          <span className={passwordStrength.length ? 'text-green-500' : 'text-gray-500'}>
                            8+ characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ValidationIndicator isValid={passwordStrength.uppercase} />
                          <span className={passwordStrength.uppercase ? 'text-green-500' : 'text-gray-500'}>
                            Uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ValidationIndicator isValid={passwordStrength.lowercase} />
                          <span className={passwordStrength.lowercase ? 'text-green-500' : 'text-gray-500'}>
                            Lowercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ValidationIndicator isValid={passwordStrength.number} />
                          <span className={passwordStrength.number ? 'text-green-500' : 'text-gray-500'}>
                            Number
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ValidationIndicator isValid={passwordStrength.special} />
                          <span className={passwordStrength.special ? 'text-green-500' : 'text-gray-500'}>
                            Special character
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password" 
                        className={`pl-9 pr-10 h-10 text-sm
                          ${watchConfirmPassword && watchPassword !== watchConfirmPassword ? 
                            'border-red-500 focus:border-red-500' : 
                            watchConfirmPassword && watchPassword === watchConfirmPassword ?
                            'border-green-500 focus:border-green-500' :
                            'border-gray-200 dark:border-gray-700'}
                          focus:ring-[#0066CC]/20 dark:bg-gray-800 dark:text-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2
                                 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className="text-[#0066CC] hover:text-[#0052A3] font-medium
                           transition-colors duration-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          By creating an account, you agree to our{' '}
          <Link to="/TermsAndPrivacyPolicy" className="text-[#0066CC] hover:text-[#0052A3]">Terms</Link>{' '}
          and{' '}
          <Link to="/TermsAndPrivacyPolicy" className="text-[#0066CC] hover:text-[#0052A3]">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}