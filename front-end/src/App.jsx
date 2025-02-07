import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/toast/toast-context';
import { Toaster } from './components/ui/toast/toaster';

// Page components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/forgetPassword';
import Profile from './pages/ProfilePage';
import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';
import Browserdetails from './pages/BrowseDetail';
import FilePage from './pages/ViewFilepage';

// Auth guard component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/BrowseDetail/:id" element={<Browserdetails />} />
          <Route path="/filepage/" element={<FilePage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
                <Profile />
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ToastProvider>
  );
};

export default AppRoutes;