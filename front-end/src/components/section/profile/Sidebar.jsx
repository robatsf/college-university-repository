import LogoutConfirmModal from './modal/LogoutConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { X, Bell, User, Home, LogOut } from "lucide-react";
import { getTokenData } from '../../../hooks/auth/token'; 
import BackendUrl from '../../../hooks/config'; 

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = getTokenData();
    setUserData(user);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getProfilePath = () => {
    if (!userData) return '/';
    
    if (['teacher', 'student'].includes(userData.user_type)) {
      return `/Profile/${userData.user_type}`;
    }
    if (['department_head', 'librarian'].includes(userData.user_type)) {
      return `/dashboard/${userData.user_type}`;
    }
    return '/';
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Home',
      onClick: () => navigate('/'),
      className: 'text-gray-700'
    },
    // {
    //   icon: <Bell className="h-5 w-5" />,
    //   label: 'Notifications',
    //   onClick: () => navigate('/notifications'),
    //   className: 'text-gray-600'
    // },
    {
      icon: <LogOut className="h-5 w-5" />,
      label: 'Logout',
      onClick: handleLogout,
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  const renderUserAvatar = () => {
    if (!userData) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full text-lg font-bold shadow-lg">
          <User className="h-6 w-6" />
        </div>
      );
    }

    if (userData.image_path) {
      const imageSrc = `${BackendUrl.imageUrl}/${userData.image_path}`

      return (
        <img
          src={imageSrc}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png'; // Add a default avatar image path
          }}
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-[#0052A3] text-white flex items-center justify-center rounded-full text-lg font-bold shadow-lg">
        {userData.user_name?.[0]?.toUpperCase() || 'U'}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white p-6 border-r transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center lg:hidden">
          <h2 className="text-2xl font-bold text-blue-600">HUDC-IR</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* User Profile */}
        <div className="mt-6">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
               onClick={() => navigate(getProfilePath())}>
            {renderUserAvatar()}
            <div className="ml-3">
              <p className="text-lg font-semibold">{userData?.user_name || 'Guest User'}</p>
              <p className="text-sm text-gray-500">
                {userData ? (
                  <>
                    {userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1)}
                    {userData.id && ` - ID: ${userData.id}`}
                  </>
                ) : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-grow">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <button 
                  onClick={item.onClick}
                  className={`w-full p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center group ${item.className}`}
                >
                  <span className="mr-3 group-hover:text-blue-600">
                    {item.icon}
                  </span>
                  <span className="group-hover:text-blue-600">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Sidebar;