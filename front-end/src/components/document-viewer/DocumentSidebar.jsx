import React, { useState } from 'react';
import { 
  FaFileAlt, FaUser, FaBuilding, 
  FaCalendarAlt, FaFile, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { DetailGroup } from './DetailGroup';
import { DetailItem } from './DetailItem';
import { ActionButton, getFileIcon } from './actions';
export const DocumentSidebar = ({ 
  fileData, 
  isSidebarOpen, 
  setIsSidebarOpen,
  isViewOnly = true,
  onRequestAccess,
  onDownload 
}) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  
  const handleActionClick = () => {
    if (isViewOnly) {
      onRequestAccess?.();
    } else {
      onDownload?.(fileData);
    }
  };

  // Function to truncate summary text
  const renderSummary = () => {
    const summary = fileData?.summary || 'No summary available.';
    const words = summary.split(/\s+/);
    
    if (words.length <= 2 || showFullSummary) {
      return summary;
    }
    
    return words.slice(0, 2).join(' ') + '...';
  };

  // Function to toggle summary visibility
  const toggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };

  // Check if summary needs a toggle button
  const summaryHasToggle = fileData?.summary && fileData.summary.split(/\s+/).length > 2;
  
  return (
    <div 
      className={`
        fixed top-16 right-0 w-80 bg-white shadow-lg border-l border-gray-200
        transform transition-transform duration-300 h-[calc(100vh-64px)]
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col z-20
      `}
      onCopy={e => e.preventDefault()}
      onPaste={e => e.preventDefault()}
      onCut={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 select-none">
          {/* Header */}
          <div className="flex items-center space-x-3">
            {getFileIcon(fileData?.extension)}
            <h2 className="text-xl font-bold text-gray-800 break-words">{fileData?.title}</h2>
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
            <div className="text-sm text-gray-600 leading-relaxed select-none">
              <p id="summary-text">{renderSummary()}</p>
              
              {summaryHasToggle && (
                <button 
                  onClick={toggleSummary}
                  className="mt-2 flex items-center justify-center w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium py-1.5 px-2 rounded-md transition-colors duration-200 border border-transparent hover:border-blue-200"
                  aria-expanded={showFullSummary}
                  aria-controls="summary-text"
                >
                  <span className="flex items-center">
                    {showFullSummary ? (
                      <>
                        <FaChevronUp className="mr-1.5 text-blue-500" aria-hidden="true" /> 
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <FaChevronDown className="mr-1.5 text-blue-500" aria-hidden="true" /> 
                        <span>Show more</span>
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          </DetailGroup>
        </div>
      </div>

      {/* Action Button - Fixed at the bottom */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <ActionButton 
          isViewOnly={isViewOnly} 
          RequestAccess={fileData?.RequestAccess}
          onClick={handleActionClick} 
        />
      </div>
    </div>
  );
};