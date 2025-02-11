
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-12 text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-[#0066CC]/10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-[#0066CC] dark:text-white">
              Oops!
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Page not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been 
            removed or the link might be broken.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto border-[#0066CC] text-[#0066CC] 
                     hover:bg-[#0066CC]/10 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button 
              className="w-full bg-[#0066CC] hover:bg-[#0052A3] 
                       text-white transition-colors duration-200"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Need help? Try these:</p>
          <div className="flex items-center justify-center gap-3">
            <Link 
              to="/search" 
              className="hover:text-[#0066CC] transition-colors duration-200
                       underline underline-offset-4"
            >
              policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/help" 
              className="hover:text-[#0066CC] transition-colors duration-200
                       underline underline-offset-4"
            >
              Help Center
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/contact" 
              className="hover:text-[#0066CC] transition-colors duration-200
                       underline underline-offset-4"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 HUDC Institutional Repository. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}