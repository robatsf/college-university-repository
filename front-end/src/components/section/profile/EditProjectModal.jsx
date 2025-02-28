// components/EditProjectModal.jsx
import { Upload, X } from "lucide-react";
import { useEditProject } from "../../../hooks/useEditProject";

const EditProjectModal = ({ project, isOpen, onClose, onSuccess }) => {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleFileChange,
    updateProject
  } = useEditProject(project);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject();
      onSuccess?.();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-900">Edit Project</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-black  w-full" />
          
          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-4">
                  Project updated successfully!
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
                      Project File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white/50">
                      <input 
                        type="file" 
                        className="hidden" 
                        id="file-upload-edit"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        accept=".pdf"
                      />
                      <label 
                        htmlFor="file-upload-edit" 
                        className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                      >
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          {formData.file ? formData.file.name : "Click to upload new file (optional)"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Updating...</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Project'}
                </button>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;