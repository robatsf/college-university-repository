import { Mail } from "lucide-react";
import { 
  FaFilePdf, FaFileWord, FaFile,
  FaKey, FaFileDownload
} from "react-icons/fa";
import { useState } from "react";

export const getFileIcon = (extension) => {
  switch (extension?.toLowerCase()) {
    case ".pdf":
      return <FaFilePdf className="text-red-500 text-xl" />;
    case ".doc":
    case ".docx":
      return <FaFileWord className="text-blue-500 text-xl" />;
    default:
      return <FaFile className="text-gray-500 text-xl" />;
  }
};

export const ActionButton = ({ isViewOnly, RequestAccess, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true); // Set loading state first
    await new Promise((resolve) => setTimeout(resolve, 50)); // Force a small delay to ensure re-render

    try {
      if (onClick) {
        await onClick(); // Make sure `onClick` is an async function
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false); // Ensure loading state resets
    }
  };

  return (
    <button
      className={`
        w-full mt-4 px-4 py-2 rounded-lg flex items-center justify-center gap-2 
        transition-all duration-300 
        ${isViewOnly 
          ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
          : "bg-blue-600 text-white hover:bg-blue-700"}
      `}
      onClick={handleClick}
      disabled={RequestAccess || loading} // Disable button while loading
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Processing...
        </>
      ) : RequestAccess ? (
        <>
          <Mail />
          Check your email
        </>
      ) : isViewOnly ? (
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
};
