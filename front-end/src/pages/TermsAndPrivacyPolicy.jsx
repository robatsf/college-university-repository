import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndPrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 px-4 py-8">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-[#0066CC] hover:text-[#0052A3] transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service & Privacy Policy
        </h1>

        {/* Tabs for Navigation */}
        <div className="mb-6">
          <ul className="flex space-x-4">
            <li>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                id="terms-tab"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                id="privacy-tab"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div id="terms-content" className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-400 mb-4">
            Welcome to our platform! By accessing or using our services, you agree to comply with and be bound by the following terms.
          </p>
          <ol className="list-decimal list-inside ml-6">
            <li className="mb-2">
              <strong>Eligibility:</strong> You must be at least 18 years old to use our services.
            </li>
            <li className="mb-2">
              <strong>Account Creation:</strong> You are responsible for maintaining the confidentiality of your account credentials.
            </li>
            <li className="mb-2">
              <strong>Content Ownership:</strong> Any content you upload remains your property, but you grant us a license to use it as necessary for the operation of our services.
            </li>
            <li className="mb-2">
              <strong>Termination:</strong> We reserve the right to terminate your access to our services at any time without notice.
            </li>
          </ol>
        </div>

        <div id="privacy-content">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-400 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <ol className="list-decimal list-inside ml-6">
            <li className="mb-2">
              <strong>Data Collection:</strong> We collect information such as your email address, username, and usage data when you interact with our platform.
            </li>
            <li className="mb-2">
              <strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze site usage.
            </li>
            <li className="mb-2">
              <strong>Data Sharing:</strong> We do not sell your personal information. However, we may share it with trusted third parties for operational purposes.
            </li>
            <li className="mb-2">
              <strong>Data Security:</strong> We implement industry-standard security measures to protect your data from unauthorized access.
            </li>
            <li className="mb-2">
              <strong>Your Rights:</strong> You have the right to access, update, or delete your personal information. Contact us for assistance.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyPolicy;