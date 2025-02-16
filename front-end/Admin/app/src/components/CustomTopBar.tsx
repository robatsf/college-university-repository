// src/components/CustomTopBar.tsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputBase,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Bell, 
  LogOut, 
  Menu as MenuIcon, 
  Search as SearchIcon,
  Mail,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { LogoutDialog } from './LogoutDialog';
import { styled, alpha } from '@mui/material/styles';
import { useSidebarState } from 'react-admin';



// Styled Search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: 'New Document Upload',
    message: 'A new document has been uploaded to the system',
    time: '5 minutes ago',
    type: 'upload'
  },
  {
    id: 2,
    title: 'Approval Required',
    message: 'New document needs your approval',
    time: '1 hour ago',
    type: 'approval'
  },
  {
    id: 2,
    title: 'Approval Required',
    message: 'New document needs your approval',
    time: '1 hour ago',
    type: 'approval'
  },
  // Add more mock notifications as needed
];

export const CustomTopBar = ({ role }) => {
  // Use React state for logout and notifications drawer
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
//   const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Use react-admin’s sidebar state for toggling the side menu
  const [sidebarOpen, setSidebarOpen] = useSidebarState();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // When notifications icon is clicked:
  // • Open the notifications drawer.
  // • Mark notifications as read (clear the notifications array).
  const handleNotificationClick = () => {
    setNotificationsOpen(true);
    setNotifications(mockNotifications);
  };

  const handleNotificationClose = () => {
    setNotificationsOpen(false);
     setNotifications([]);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // If there are any unread notifications, display "New" on the badge.
  const badgeContent = notifications.length > 0 ? "New" : null;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* Hamburger icon toggles the react-admin sidebar */}
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
            src="../public/hu.jpeg" // Replace with your actual logo path
            alt="HUDC Logo"
            style={{
              height: 40,
              marginRight: 16,
              borderRadius: 20
            }}
          />

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HUDC IR SYSTEM
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge 
                badgeContent={badgeContent} 
                color={role === 'librarian' ? "success" : "warning"}
              >
                <Bell 
                  size={20} 
                  color={role === 'librarian' ? "#4caf50" : "#ff9800"} 
                />
              </Badge>
            </IconButton>
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

      {/* Notifications Drawer */}
      <Drawer
        anchor="right"
        open={notificationsOpen}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 350 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Notifications
            </Typography>
            <IconButton onClick={handleNotificationClose}>
              <X size={20} />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon size={20} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search notifications…"
                value={searchQuery}
                onChange={handleSearch}
              />
            </Search>
          </Box>

          {/* <Box sx={{ mb: 2 }}>
            <IconButton onClick={handleFilterClick}>
              <Filter size={20} />
            </IconButton>
          </Box> */}

          <Divider />

          <List>
            {filteredNotifications.map((notification) => (
              <ListItem key={notification.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {notification.type === 'upload' ? <Mail size={20} /> : <Clock size={20} />}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      {notification.message}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Filter Menu */}
      {/* <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={handleFilterClose}>All</MenuItem>
        <MenuItem onClick={handleFilterClose}>Uploads</MenuItem>
        <MenuItem onClick={handleFilterClose}>Approvals</MenuItem>
      </Menu> */}

      <LogoutDialog 
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
