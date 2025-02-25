import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Page components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/forgetPassword';
import Profile from './pages/ProfilePage';
import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';
import Browserdetails from './pages/BrowseDetail';
import FileViewerPage from './pages/ViewFilepage'
import TermsAndPrivacyPolicy from './pages/TermsAndPrivacyPolicy';
import TeacherDashboard from './pages/teacherDasbord';


// Auth guard component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Routing configuration */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} /> {/* Fixed route name */}
        <Route path="/browsedetail/:id" element={<Browserdetails />} /> {/* Improved route naming */}
        <Route path="/TermsAndPrivacyPolicy" element={<TermsAndPrivacyPolicy />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
         <Route path="/TeacherDashboard"
          element={ <TeacherDashboard/> }
           />

        <Route
          path="/fileViwe/:id"
          element={
            // <PrivateRoute>
              <FileViewerPage />
           // </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Add ToastContainer for react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: Use a colored theme
      />
    </BrowserRouter>
  );
};

export default AppRoutes;