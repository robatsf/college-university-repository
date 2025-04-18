import React from 'react';
import { useParams,Link } from 'react-router-dom';
import {  FaEyeSlash, FaBars } from 'react-icons/fa';
import {Home } from 'lucide-react';
import { useMediaQuery } from '@mui/material';
import { SecureWrapper } from '../components/document-viewer/SecureWrapper';
import { DocumentSidebar } from '../components/document-viewer/DocumentSidebar';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import Header from '../components/layout/Header';
import CustomPdfViewer from '../components/layout/pdfViewer';
import Agentview from "../Agent/Agentview"

const ViewFilePage = () => {
  const { id } = useParams();
  const {
    fileData,
    error,
    loading,
    isSidebarOpen,
    setIsSidebarOpen,
    handleDownload,
    handleRequestAccess,
  } = useDocumentViewer(id);

  // Determine if the screen is desktop (md and larger)
  const isDesktop = useMediaQuery('(min-width:768px)');

  return (
    <>
    <div className="flex flex-col h-screen">

    <Link
        to="/"
        className="absolute top-10 left-4 p-2 rounded-full bg-white 
                   shadow-lg hover:shadow-xl transition-all duration-200 
                   group hover:scale-105 z-50"
      >
        <Home className="h-5 w-5 text-[#0066CC] group-hover:text-[#0052A3]" />
      </Link>

      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Document View */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <SecureWrapper>
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="h-[calc(100vh-65px)] select-none">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-500 flex items-center gap-2">
                      <FaEyeSlash /> {error}
                    </div>
                  </div>
                ) : (
                  <div>
                    <CustomPdfViewer
                      encryptedUrl={btoa(fileData.url)}
                    />
                  </div>
                )}
              </div>
            </div>
          </SecureWrapper>
        </div>
        {/* <Agentview  id={fileData?.id}/> */}

        {/* Desktop Sidebar (always visible on md and larger screens) */}
        <div className="hidden md:block">
          <DocumentSidebar
            fileData={fileData}
            isSidebarOpen={isDesktop ? true : isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isViewOnly={fileData?.accessLevel}
            onDownload={handleDownload}
            onRequestAccess={handleRequestAccess}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          {/* Semi-transparent overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          {/* Sidebar sliding in from the right */}
          <div className="relative ml-auto w-80 bg-white shadow-lg">
          <DocumentSidebar
            fileData={fileData}
            isSidebarOpen={isDesktop ? true : isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isViewOnly={fileData?.accessLevel}
            onDownload={handleDownload}
            onRequestAccess={handleRequestAccess}
          />
          </div>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>
    </div>
    </>
  );
};

export default ViewFilePage;
