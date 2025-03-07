import React, { useState } from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  useTranslate,
} from "react-admin";
import { CardContent, Typography, Box, CircularProgress } from '@mui/material';
import customDataProvider from '../dataProvider';

// Custom validation for matching passwords
const validatePasswordMatch = (value, allValues) => {
  if (value !== allValues.newPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

// Custom validation for password requirements
const validatePassword = (value) => {
  if (!value) return 'Required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return undefined;
};

// Custom error message component with red text
const ErrorMessage = ({ message }) => (
  message ? <Typography color="error" variant="caption" sx={{ mt: -1, mb: 1, display: 'block' }}>
    {message}
  </Typography> : null
);

// Custom toolbar with centered Save button
const CustomToolbar = ({ saving, ...props }) => (
  <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'center' }}>
    <SaveButton label="Update Password" disabled={saving} />
    {saving && <CircularProgress size={24} sx={{ ml: 1 }} />}
  </Toolbar>
);

export const UpdateDepartemntPassword = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  // Manual submit handler calling the data provider
  const handleSubmit = async (data) => {
    setSaving(true);
    setServerErrors({});
    
    try {
      // Transform the data to match your backend expected fields
      const transformedData = {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      };
      
      await customDataProvider.create("change-password", { data: transformedData });
      notify("Password updated successfully", { type: "success" });
      redirect("/");
    } catch (error) {
      console.error("Password update error:", error);
      
      // Handle different types of errors
      if (error.body && typeof error.body === 'object') {
        // Handle structured error responses from the API
        const errorData = error.body;
        
        // Extract field-specific errors
        const fieldErrors = {};
        
        if (errorData.old_password) {
          fieldErrors.oldPassword = Array.isArray(errorData.old_password) 
            ? errorData.old_password[0] 
            : errorData.old_password;
        }
        
        if (errorData.new_password) {
          fieldErrors.newPassword = Array.isArray(errorData.new_password) 
            ? errorData.new_password[0] 
            : errorData.new_password;
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          setServerErrors(fieldErrors);
          notify("Please correct the errors below", { type: "warning" });
        } else if (errorData.detail || errorData.error) {
          // General error message
          notify(`Error: ${errorData.detail || errorData.error}`, { type: "error" });
        } else {
          // Fallback for other structured errors
          notify("An error occurred while updating your password", { type: "error" });
        }
      } else {
        // Handle string error messages or unexpected errors
        const errorMessage = error.message || "An unexpected error occurred";
        notify(`Error: ${errorMessage}`, { type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>
        <SimpleForm
          onSubmit={handleSubmit}
          toolbar={<CustomToolbar saving={saving} />}
          sx={{
            '& .RaSimpleForm-form': {
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            },
          }}
        >
          <TextInput
            source="oldPassword"
            label="Current Password"
            type="password"
            fullWidth
            validate={[required()]}
            sx={{ mb: serverErrors.oldPassword ? 0 : 2 }}
            error={!!serverErrors.oldPassword}
          />
          {/* Custom error message component for old password */}
          <ErrorMessage message={serverErrors.oldPassword} />
          
          <TextInput
            source="newPassword"
            label="New Password"
            type="password"
            fullWidth
            validate={[required(), validatePassword]}
            helperText="Password must be at least 8 characters"
            sx={{ mb: serverErrors.newPassword ? 0 : 2 }}
            error={!!serverErrors.newPassword}
          />
          {/* Custom error message component for new password */}
          <ErrorMessage message={serverErrors.newPassword} />
          
          <TextInput
            source="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            validate={[required(), validatePasswordMatch]}
            sx={{ mb: 2 }}
          />
        </SimpleForm>
      </CardContent>
    </Box>
  );
};