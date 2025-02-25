import React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
} from "react-admin";
import { CardContent, Typography, Box } from '@mui/material';
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

// Custom toolbar with centered Save button
const CustomToolbar = props => (
  <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'center' }}>
    <SaveButton label="Update Password" />
  </Toolbar>
);

export const UpdateLibriancePassword = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Manual submit handler calling the data provider
  const handleSubmit = async (data) => {
    try {
      // Transform the data to match your backend expected fields
      const transformedData = {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      };

      // Call the custom data provider for "change-password"
      await customDataProvider.create("change-password", { data: transformedData });
      notify("Password updated successfully", { type: "success" });
      redirect("/");
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>
        <SimpleForm
          onSubmit={handleSubmit}  // Use our custom submit handler
          toolbar={<CustomToolbar />}
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
            sx={{ mb: 2 }}
          />
          <TextInput
            source="newPassword"
            label="New Password"
            type="password"
            fullWidth
            validate={[required(), validatePassword]}
            helperText="Password must be at least 8 characters"
            sx={{ mb: 2 }}
          />
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
