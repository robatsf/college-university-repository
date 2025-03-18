// src/components/CustomTopBar.tsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
} from '@mui/material';
import { 
  LogOut, 
  Menu as MenuIcon, 
} from 'lucide-react';
import { LogoutDialog } from './LogoutDialog';
import { useSidebarState } from 'react-admin';
import { localhost } from '../App';

export const CustomTopBar = ({ role }) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useSidebarState();

  const handleLogout = () => {
    localStorage.clear()
    localhost("/login")
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          
          <img
            src="../public/hu.jpeg"
            alt="HUDC Logo"
            style={{
              height: 40,
              marginRight: 16,
              borderRadius: 20
            }}
          />

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HUDC IRS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              color="inherit" 
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut 
                size={20} 
                color={role === 'librarian' ? "#d32f2f" : "#1976d2"} 
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <LogoutDialog 
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};