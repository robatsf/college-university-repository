// src/components/UpdatePassword.tsx
import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
} from "react-admin";
import { Card, CardContent, Typography, Box } from '@mui/material';

// Custom validation
const validatePasswordMatch = (value, allValues) => {
  if (value !== allValues.newPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

const validatePassword = (value) => {
  if (!value) return 'Required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return undefined;
};

// Custom toolbar
const CustomToolbar = props => (
  <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'center' }}>
    <SaveButton label="Update Password" />
  </Toolbar>
);

export const UpdatePasswordEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('Password updated successfully');
    redirect('/');
  };

  return (
    <Box>
        <CardContent>
          <Typography >
            Update Password
          </Typography>
          
          <Create
            resource="updatePassword"
            redirect="/"
            mutationOptions={{ onSuccess }}
          >
            <SimpleForm 
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
          </Create>
        </CardContent>
    </Box>
  );
};