// src/components/DocumentSidebar.jsx
import React from 'react';
import { 
  FaFileDownload, FaFileAlt, FaUser, FaBuilding, 
  FaCalendarAlt, FaFilePdf, FaFileWord, FaFile,
  FaKey 
} from 'react-icons/fa';
import { DetailGroup } from './DetailGroup';
import { DetailItem } from './DetailItem';

// FileIcon Helper
const getFileIcon = (extension) => {
    switch (extension?.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-xl" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 text-xl" />;
      default:
        return <FaFile className="text-gray-500 text-xl" />;
    }
  };
  
  // Action Button Component
  const ActionButton = ({ isViewOnly, onClick }) => (
    <button
      className={`
        w-full mt-4 px-4 py-2 rounded-lg flex items-center justify-center gap-2 
        transition-all duration-300 
        ${isViewOnly 
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
          : 'bg-blue-600 text-white hover:bg-blue-700'}
      `}
      onClick={onClick}
    >
      {isViewOnly ? (
        <>
          <FaKey className="text-gray-600" />
          Request Access
        </>
      ) : (
        <>
          <FaFileDownload />
          Download Document
        </>
      )}
    </button>
  );
  
  // Main DocumentSidebar Component
  export const DocumentSidebar = ({ 
    fileData, 
    isSidebarOpen, 
    setIsSidebarOpen,
    isViewOnly = true,
    onRequestAccess,
    onDownload 
  }) => {
    const handleActionClick = () => {
      if (isViewOnly) {
        onRequestAccess?.();
      } else {
        onDownload?.(fileData);
      }
    };
  
    return (
      <div 
        className={`
          w-80 bg-white shadow-lg overflow-y-auto border-l border-gray-200
          transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onCopy={e => e.preventDefault()}
        onPaste={e => e.preventDefault()}
        onCut={e => e.preventDefault()}
        onContextMenu={e => e.preventDefault()}
      >
        <div className="p-6 space-y-6 select-none">
          {/* Header */}
          <div className="flex items-center space-x-3">
            {getFileIcon(fileData?.extension)}
            <h2 className="text-xl font-bold text-gray-800">{"unknown title"}</h2>
          </div>
  
          {/* Access Level Indicator */}
          <div className={`
            text-sm rounded-full px-3 py-1 flex items-center gap-2
            ${isViewOnly 
              ? 'bg-gray-100 text-gray-600' 
              : 'bg-green-100 text-green-700'}
          `}>
            {isViewOnly ? 'View Only Access' : 'Full Access'}
          </div>
  
          {/* Document Details Section */}
          <DetailGroup title="Document Details">
            <DetailItem 
              icon={<FaFileAlt />} 
              label="Type" 
              value={fileData?.extension || 'Unknown'} 
            />
            <DetailItem 
              icon={<FaFile />} 
              label="Size" 
              value={fileData?.size || 'Unknown'} 
            />
            <DetailItem 
              icon={<FaCalendarAlt />} 
              label="Year" 
              value={fileData?.year || 'Unknown'} 
            />
          </DetailGroup>
  
          {/* Ownership Section */}
          <DetailGroup title="Ownership">
            <DetailItem 
              icon={<FaUser />} 
              label="Author" 
              value={fileData?.author || 'Unknown'} 
            />
            <DetailItem 
              icon={<FaBuilding />} 
              label="Department" 
              value={fileData?.department || 'Unknown'} 
            />
            <DetailItem 
              icon={<FaFileAlt />} 
              label="Category" 
              value={fileData?.category || 'Unknown'} 
            />
          </DetailGroup>
  
          {/* Summary Section */}
          <DetailGroup title="Summary">
            <p className="text-sm text-gray-600 leading-relaxed select-none">
              {fileData?.summary || 'No summary available.'}
            </p>
          </DetailGroup>
  
          {/* Action Button */}
          <ActionButton 
            isViewOnly={isViewOnly} 
            onClick={handleActionClick} 
          />
        </div>
      </div>
    );
  };