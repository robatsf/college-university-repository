// src/hooks/useDocumentViewer.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tokenManager from '../uites/tokenManager';
import BackendUrl from './config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useDocumentViewer = () => {
  // Get the document id from the URL
  const { id: docId } = useParams();

  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect to fetch document data when the docId changes.
  useEffect(() => {
    let isActive = true;

    if (!docId) {
      setError("No document provided");
      setLoading(false);
      toast.error("No document provided", { autoClose: 3000 });
      return;
    }

    const handleViewFile = async () => {
      try {
        const url = `${BackendUrl.file}/view/${docId}/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
            Accept: 'application/json',
          },
        });
        if (!response.ok) throw new Error("Failed to fetch document");

        const data = await response.json();
        if (!data.file_url) throw new Error("Invalid response from server");

        const fileDataFromResponse = {
          id : data.id,
          url: data.file_url,
          title: data.title || "unknown",
          author: data.author || "Unknown",
          department: data.department || "Unknown",
          summary: data.summary || "No summary available.",
          year: data.year || "Unknown",
          extension: data.file_extension || "pdf",
          size: data.size || "Unknown",
          category: data.category || "Uncategorized",
          accessLevel: data.accessLevel,
          RequestAccess : data.asked_request
        };

        if (isActive) {
          setFileData(fileDataFromResponse);
          setLoading(false);
        }
      } catch (err) {
        if (isActive) {
          console.error("Error viewing file:", err);
          setError(err.message || "Error loading document");
          setLoading(false);
          toast.error("Error loading document", { autoClose: 3000 });
        }
      }
    };

    handleViewFile();

    return () => {
      isActive = false;
    };
  }, [docId]);

  const handleDownload = async () => {
    if (!docId) {
      toast.warn("Invalid document ID", { autoClose: 3000 });
      return false;
    }
  
    try {
      const response = await fetch(`${BackendUrl.file}/documents/${docId}/download/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.statusText}`);
      }
      const blob = await response.blob();
      const fileName = fileData?.title || `document_${docId}`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Download started", { autoClose: 3000 });
      return true;
    } catch (err) {
      console.error("Error downloading document:", err);
      toast.error("Error downloading document", { autoClose: 3000 });
      return false;
    }
  };
  

  // Function to handle access requests.
  const handleRequestAccess = async () => {
    if (!docId) {
      toast.warn("Invalid document ID", { autoClose: 3000 });
      return false;
    }
  
    try {
      const response = await fetch(`${BackendUrl.file}/request-access/${docId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        },
      });
  
      const data = await response.json().catch(() => null)
  
      if (!response.ok) {
        throw new Error(data?.message || "Failed to request access");
      }
  
        setFileData((prev) => ({
          ...prev,
          RequestAccess : true
        }));
        toast.success("Access requested successfully", { autoClose: 3000 });
        return true;
      
    } catch (err) {
      console.error("Error requesting access:", err);
      toast.error(err.message || "Error requesting access", { autoClose: 3000 });
      return false;
    }
  };
  

  return {
    fileData,
    error,
    loading,
    isSidebarOpen,
    setIsSidebarOpen,
    handleDownload,
    handleRequestAccess,
  };
};

export default useDocumentViewer;
