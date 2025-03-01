// src/components/DocumentSidebar.jsx
import React from 'react';
import { 
   FaFileAlt, FaUser, FaBuilding, 
  FaCalendarAlt, FaFile,
} from 'react-icons/fa';
import { DetailGroup } from './DetailGroup';
import { DetailItem } from './DetailItem';
import { ActionButton, getFileIcon } from './actions';
  
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
          h-screen
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
            <h2 className="text-xl font-bold text-gray-800">{fileData?.title}</h2>
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
              value={`${Math.floor(fileData?.size / 1000000)} Mb` || 'Unknown'} 
            />
            <DetailItem 
              icon={<FaCalendarAlt />} 
              label="Uploaded date" 
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
            RequestAccess = {fileData?.RequestAccess}
            onClick={handleActionClick} 
          />
        </div>
      </div>
    );
  };