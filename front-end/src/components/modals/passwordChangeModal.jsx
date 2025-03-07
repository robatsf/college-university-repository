import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { X, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { usePasswordUpdate } from '../../hooks/usePasswordUpdate';

const PasswordChangeModal = ({ open, onClose }) => {
  const {
    register,
    onSubmit,
    errors,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    isMatching,
    watch,
    getPasswordRequirements,
    isNewPasswordFocused,
    handleNewPasswordFocus,
    handleNewPasswordBlur,
  } = usePasswordUpdate();

  const newPassword = watch('newPassword');
  const requirements = getPasswordRequirements(newPassword);

  // Extend the onSubmit function to close the modal on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(e);
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1500); // Close after 1.5s to allow user to see success message
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-lg">Update Password</span>
        </div>
        {!isLoading && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <X size={18} />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                {...register('currentPassword')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                {...register('newPassword')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter new password"
                onFocus={handleNewPasswordFocus}
                onBlur={handleNewPasswordBlur}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div
              className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                isNewPasswordFocused ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {requirements.map((req) => (
                <div 
                  key={req.id} 
                  className={`flex items-center gap-1 text-sm transition-all duration-300 ${
                    isNewPasswordFocused ? 'translate-y-0' : 'translate-y-2'
                  }`}
                >
                  {req.met ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={req.met ? 'text-green-700' : 'text-red-600'}>
                    {req.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                {...register('confirmPassword')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isMatching}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Updating...
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;