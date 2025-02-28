// components/ProjectUploadForm.jsx
import { Upload } from "lucide-react";
import { useProjectUpload } from "../../../hooks/useUpload"; 

const ProjectUploadForm = ({ DepartmentId, userDepartment, onSubmit }) => {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleFileChange,
    uploadProject,
    resetForm
  } = useProjectUpload(userDepartment, DepartmentId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadProject();
      onSubmit(formData);
    } catch (error) {
      // Error is handled by the hook
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative ">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-4">
          Project uploaded successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              placeholder="Enter project title"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input 
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              placeholder="Enter author name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input 
              type="text"
              value={formData.department}
              className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
              disabled
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Summary *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-h-[120px]"
              placeholder="Provide a brief description of your project"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white/50">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={handleFileChange}
                required
                disabled={isLoading}
                accept=".pdf"
              />
              <label 
                htmlFor="file-upload" 
                className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
              >
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Uploading...</span>
          </div>
        )}
        <button 
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Project'}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </form>
  );
};

export default ProjectUploadForm;