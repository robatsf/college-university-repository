import ProjectUploadForm from "../ProjectUploadForm";
const UploadModal = ({ isOpen, onClose, userDepartment }) => {
  if (!isOpen) return null;

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Add your submission logic here
    onClose();
  };
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div 
        className="bg-white/95 rounded-xl shadow-xl w-full max-w-3xl backdrop-blur supports-[backdrop-filter]:bg-white/80" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Upload New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <ProjectUploadForm 
            userDepartment={userDepartment} 
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;