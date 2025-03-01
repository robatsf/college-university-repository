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

        // Construct fileData using defaults and values from the response.
        const fileDataFromResponse = {
          url: data.file_url,
          title: data.title || "unknown",
          author: data.author || "Unknown",
          department: data.department || "Unknown",
          summary: data.summary || "No summary available.",
          year: data.year || "Unknown",
          extension: data.file_extension || "pdf",
          size: data.size || "Unknown",
          category: data.category || "Uncategorized",
          accessLevel: data.accessLevel || "view-only",
        };

        if (isActive) {
          setFileData(fileDataFromResponse);
          setLoading(false);
          toast.success("Document loaded successfully", { autoClose: 3000 });
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

  // Function to handle document download.
  const handleDownload = async () => {
    if (!fileData?.url) {
      console.error("No file URL provided");
      return false;
    }
    try {
      const response = await fetch(`${BackendUrl.file}/documents/${docId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to track download");

      // Trigger the download by creating a temporary link.
      const link = document.createElement('a');
      link.href = fileData.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (err) {
      console.error("Error downloading document:", err);
      toast.error("Error downloading document", { autoClose: 3000 });
      return false;
    }
  };

  // Function to handle access requests.
  const handleRequestAccess = async () => {
    if (!docId) return false;
    try {
      const response = await fetch(`${BackendUrl.file}/documents/${docId}/request-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        },
        body: JSON.stringify({ documentId: docId, requestType: 'full-access' }),
      });
      if (!response.ok) throw new Error("Failed to request access");

      const data = await response.json();
      if (data.success) {
        setFileData((prev) => ({
          ...prev,
          accessLevel: 'pending',
        }));
        toast.success("Access requested successfully", { autoClose: 3000 });
      }
      return data.success;
    } catch (err) {
      console.error("Error requesting access:", err);
      toast.error("Error requesting access", { autoClose: 3000 });
      return false;
    }
  };

  // Viewer configuration that can be passed to your document viewer component.
  const viewerConfig = {
    header: {
      disableHeader: false,
      disableFileName: false,
    },
    iframeProps: {
      sandbox: "allow-scripts allow-same-origin",
    },
    defaultScale: 1.2,
    allowDragging: true,
    allowZoom: true,
    allowPrint: true,
    allowDownload: true,
    allowFullScreen: true,
    renderMode: 'canvas',
  };

  return {
    fileData,
    error,
    loading,
    isSidebarOpen,
    setIsSidebarOpen,
    handleDownload,
    handleRequestAccess,
    viewerConfig,
  };
};

export default useDocumentViewer;
