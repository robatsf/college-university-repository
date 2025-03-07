import React, { ReactNode } from 'react';
import { Admin, Layout, LayoutProps, AppBar as RaAppBar, AppBarProps } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {roleResources,CustomLayout} from './layout/CustomLayout';
import  customDataProvider  from './dataProvider';
import LibrarianDashboard from './libriance/LibrarianDashboard';
import DepartmentDashboard from './departemnt_head/DepartmentDashboard';

// Custom AppBar component that extends react-admin's AppBar
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
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});


// App component
const App = () => {
  // librarian,department_head
  const role =  localStorage.getItem("user_type") || "department_head"
  const resources = roleResources[role] || [];

  if (!["librarian", "department_head"].includes(role)) {
    window.location.href = "/login";
  }

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

export default App;