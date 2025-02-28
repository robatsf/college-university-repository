import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTokenData } from "../hooks/auth/token"; // Adjust path as needed
import RecentHistorySection from "../components/section/profile/RecentHistorySection";
import Sidebar from "../components/section/profile/Sidebar";
import StudentInfoCard from "../components/section/profile/StudentInfoCard";
import UploadedProjectsSection from "../components/section/profile/UploadedProjectsSection";
import UpdatePasswordSection from "../components/section/profile/UpdatePasswordSection";
import UploadModal from "../components/section/profile/modal/UploadModal";

const Studentdashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [departmentInfo, setDepartmentInfo] = useState({
    departmentName: '',
    departmentId: ''
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();


  const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
    };

  useEffect(() => {
    try {
      const userData = getTokenData();
      if (!userData) {
        navigate('/login');
        return;
      }
      
      setDepartmentInfo({
        departmentName: userData.department || 'Unknown Department',
        departmentId: userData.department_id || ''
      });
    } catch (error) {
      console.error('Error getting department info:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-blue-600">HUDC-IR</h1>
        <div className="w-6" />
      </div>

      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          departmentName={departmentInfo.departmentName}
        />
        
        <main className="flex-1 p-4 lg:p-8 space-y-6 pb-20">
          <StudentInfoCard 
            onUploadClick={() => setModalOpen(true)}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <UploadedProjectsSection 
              departmentId={departmentInfo.departmentId}
              refreshKey={refreshKey} 
            />
            <div className="space-y-6">
              <RecentHistorySection refreshKey={refreshKey} />
              <UpdatePasswordSection />
            </div>
          </div>
        </main>
      </div>

      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => {setModalOpen(false);
          handleRefresh(); 
        }}
        userDepartment={departmentInfo.departmentName}
        DepartmentId={departmentInfo.departmentId}
        
      />
    </div>
  );
};

export default Studentdashboard;