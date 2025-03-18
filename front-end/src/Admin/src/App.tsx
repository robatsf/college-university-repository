import React, { useState, useEffect } from 'react';
import { Admin, AppBar as RaAppBar, AppBarProps } from 'react-admin';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { roleResources, CustomLayout } from './layout/CustomLayout';
import customDataProvider from './dataProvider';
import LibrarianDashboard from './libriance/LibrarianDashboard';
import DepartmentDashboard from './departemnt_head/DepartmentDashboard';

export const localhost = (value) => {
  window.location = "http://localhost:5173" + value;
};

// Custom AppBar
const CustomAppBar = (props: AppBarProps) => (
  <RaAppBar {...props}>
    <Box display="flex" alignItems="center" width="100%">
      <img
        src="./public/hu.jpeg"
        alt="Logo"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          marginRight: '10px'
        }}
      />
      <Typography variant="h6">HUDC IR</Typography>
    </Box>
  </RaAppBar>
);

// Custom theme
const customTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#000000' },
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  typography: { fontFamily: "Arial, sans-serif" },
  components: {
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#1976d2' } } },
  },
});

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    setTimeout(() => { 
      const userType = localStorage.getItem("user_type") || "department_head";
      setRole(userType);
      setLoading(false);
    }, 1000); 
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!["librarian", "department_head"].includes(role)) {
    localhost("/login");
    return null;
  }

  const resources = roleResources[role] || [];

  return (
    <Admin
      title="HUDC IR SYSTEM"
      layout={CustomLayout}
      dataProvider={customDataProvider}
      darkTheme={null}
      dashboard={role === "department_head" ? DepartmentDashboard : LibrarianDashboard}
    >
      {resources}
    </Admin>
  );
};

export default Dashboard;
