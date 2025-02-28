import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Page components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/forgetPassword';
import Studentdashboard from './pages/Studentdashboard';
import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';
import Browserdetails from './pages/BrowseDetail';
import FileViewerPage from './pages/ViewFilepage'
import TermsAndPrivacyPolicy from './pages/TermsAndPrivacyPolicy';
import TeacherDashboard from './pages/teacherDasbord';
import HelpPage from './pages/help';


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
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/browsedetail/*" element={<Browserdetails />} />
        <Route path="/TermsAndPrivacyPolicy" element={<TermsAndPrivacyPolicy />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path='/dashboard' element={<iframe src="/dist/index.html" style={{ width: "100%", height: "100vh", border: "none" }} />} />



        {/* Protected Routes */}
        <Route
          path="/Profile/student"
          element={
            <PrivateRoute>
              <Studentdashboard />
           </PrivateRoute>
          }
        />
         <Route path="/Profile/teacher"
          element={ 
          <PrivateRoute>
          <TeacherDashboard/> 
         </PrivateRoute>
          }/>

        <Route
          path="/fileViwe/:id"
          element={
           <PrivateRoute>
              <FileViewerPage />
           </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
        theme="colored"
      />
    </BrowserRouter>
  );
};

export default AppRoutes;