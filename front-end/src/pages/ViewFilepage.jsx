import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShieldAlt, FaEyeSlash } from 'react-icons/fa';
import { SecureWrapper } from '../components/document-viewer/SecureWrapper';
import { DocumentSidebar } from '../components/document-viewer/DocumentSidebar';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import Header from '../components/layout/Header';
import { setupSecurityListeners } from '../uites/security'

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
    viewerConfig,
  } = useDocumentViewer(id);

  const iframeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        try {
          const iDoc =
            iframeRef.current.contentDocument ||
            iframeRef.current.contentWindow.document;
          if (cleanup) cleanup();
        } catch (err) {
          console.error('Error during iframe cleanup:', err);
        }
      }
    };
  }, []);

  const handleIframeLoad = (e) => {
    try {
      const iDoc =
        e.target.contentDocument || e.target.contentWindow.document;
      if (iDoc) {
        // Apply security listeners to the iframe's document.
        setupSecurityListeners(iDoc);
      }
    } catch (error) {
      console.error('Error setting up security listeners on iframe', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Document View */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <SecureWrapper>
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="absolute top-6 right-8 z-10 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                <FaShieldAlt /> Protected View
              </div>

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
                  <iframe
                  ref={iframeRef}
                  src={fileData.url}
                  title="Document Viewer"
                  style={{ 
                    height: '100%', 
                    width: '100%', 
                    border: 'none',
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    overflow: "hidden",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none" 
                  }}
                  className="overflow-hidden no-scrollbar"
                  onLoad={handleIframeLoad}
                />
                
                )}
              </div>
            </div>
          </SecureWrapper>
        </div>

        <DocumentSidebar
          fileData={fileData}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isViewOnly={fileData?.accessLevel === 'view-only'}
          onDownload={handleDownload}
          onRequestAccess={handleRequestAccess}
        />
      </div>
    </div>
  );
};

export default ViewFilePage;
