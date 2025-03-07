import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu as MenuIcon, X, LogOut, Key, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getTokenData, removeToken } from '../../hooks/auth/token';
import BackendUrl from '../../hooks/config';
import PasswordChangeModal from '../modals/passwordChangeModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getTokenData();
    setUser(userData);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    handleMenuClose();
  };

  const handleOpenPasswordModal = () => {
    handleMenuClose();
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const navItems = !user ? [{ name: 'Sign In', path: '/login' }] : [];

  const renderUserAvatar = () => {
    if (!user) return null;

    const getAvatarContent = () => {
      // For guest users
      if (user.user_type === 'guest') {
        return (
          <>
            <div className="flex items-center">
              <div className="mr-3 flex flex-col items-end">
                <span className="text-sm font-medium">{user.user_name || 'Guest'}</span>
                <span className="text-xs text-gray-200">{user.email}</span>
              </div>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  width: 35,
                  height: 35,
                  bgcolor: '#0066CC',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#0052A3',
                  },
                  border: '2px solid white',
                }}
              >
                {user.user_name?.[0]?.toUpperCase() || 'G'}
              </IconButton>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <ListItemIcon>
                  <Mail className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText>{user.email}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenPasswordModal}>
                <ListItemIcon>
                  <Key className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText>Change Password</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogOut className="h-4 w-4 text-red-500" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </>
        );
      }

      // For teacher and student
      if (['teacher', 'student'].includes(user.user_type)) {
        return (
          <div className="flex items-center">
            <div className="mr-3 flex flex-col items-end">
              <span className="text-sm font-medium">{user.user_name}</span>
              <span className="text-xs text-gray-200">{user.email}</span>
            </div>
              <Avatar
                src={`${BackendUrl.imageUrl}/${user.image_path}`}
                alt={`Profile/${user.user_type}`}
                onClick={() => navigate(`/Profile/${user.user_type}`)}
                sx={{
                  float:'right',
                  width: 35,
                  height: 35,
                  border: '2px solid white',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                  backgroundColor: '#0052A3',
                  fontSize: '1rem',
                }}
              >
                {user.user_name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
          </div>
        );
      }

      // For department_head and librarian
      if (['department_head', 'librarian'].includes(user.user_type)) {
        return (
          <div className="flex items-center">
            <div className="mr-3 flex flex-col items-end">
              <span className="text-sm font-medium">{user.user_name}</span>
              <span className="text-xs text-gray-200">{user.email}</span>
            </div>
              <Avatar
                src={`${BackendUrl.imageUrl}/${user.image_path}`}
                alt="Profile"
                onClick={() => navigate('/dashboard')}
                sx={{
                  width: 35,
                  height: 35,
                  border: '2px solid white',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                  backgroundColor: '#0052A3',
                  fontSize: '1rem',
                }}
              >
                {user.user_name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
          </div>
        );
      }
    };

    return (
      <div className="ml-2">
        {getAvatarContent()}
      </div>
    );
  };

  return (
    <>
      <nav className="bg-[#0066CC] text-white shadow-md transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200"
              >
                <BookOpen className="h-6 w-6" />
                <span className="font-bold text-lg">HUDC IRS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-1.5 rounded-md hover:bg-[#0052A3] transition-colors duration-200 text-sm"
                >
                  {item.name}
                </Link>
              ))}
              {renderUserAvatar()}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden text-white hover:bg-[#0052A3] transition-colors duration-200 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slideDown">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0066CC] border-t border-[#0052A3]">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md hover:bg-[#0052A3] transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                {renderUserAvatar()}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Password Change Modal */}
      <PasswordChangeModal 
        open={passwordModalOpen} 
        onClose={handleClosePasswordModal} 
      />
    </>
  );
}