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
import Dashboard from './Admin/src/App';


// Auth guard component
const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userType)) return <Navigate to="/" replace />;
  
  return children;
};

// 'departmenthead': 'department_head',
// 'teacher': 'teacher',
// 'student': 'student',
// 'librarian': 'librarian'


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


        {/* Protected Routes */}
        <Route path='/dashboard/*'
        element={
          <PrivateRoute allowedRoles={['department_head', 'librarian',"guest"]}>
            <Dashboard/>
          </PrivateRoute>
       } />

        <Route
          path="/Profile/student"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Studentdashboard />
              </PrivateRoute >
          }
        />
         <Route path="/Profile/teacher"
          element={ 
            <PrivateRoute allowedRoles={['teacher']}>
          <TeacherDashboard/> 
          </PrivateRoute >
          }/>

        <Route
          path="/fileViwe/:id"
          element={
           <PrivateRoute allowedRoles={['department_head',"teacher", 'librarian',"student","guest" ,"Guest"]}>
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