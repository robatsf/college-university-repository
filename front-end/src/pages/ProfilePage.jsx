import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import RecentHistorySection from "../components/section/profile/RecentHistorySection";
import Sidebar from "../components/section/profile/Sidebar";
import StudentInfoCard from "../components/section/profile/StudentInfoCard";
import UploadedProjectsSection from "../components/section/profile/UploadedProjectsSection";
import UpdatePasswordSection from "../components/section/profile/UpdatePasswordSection";
import UploadModal from "../components/section/profile/modal/UploadModal";


// Main Dashboard Component
const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userDepartment = "Computer Science"; // Get this from your user context or props


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
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-blue-600">HUDC-IR</h1>
        <button className="p-2">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 lg:p-8 space-y-6 pb-20">
          <StudentInfoCard onUploadClick={() => setModalOpen(true)} />
          <div className="grid md:grid-cols-2 gap-6">
            <UploadedProjectsSection />
            <div className="space-y-6">
              <RecentHistorySection />
              <UpdatePasswordSection />
            </div>
          </div>
        </main>
      </div>

      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userDepartment={userDepartment}
      />
    </div>
  );
};

export default Dashboard;
