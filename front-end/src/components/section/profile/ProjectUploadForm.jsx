import { Upload } from "lucide-react";
const ProjectUploadForm = ({ userDepartment, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      author: '',
      description: '',
      department: userDepartment || '', // Set default from props
      file: null
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          file
        }));
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
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
                />
                <label htmlFor="file-upload" className="cursor-pointer">
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
          <button 
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Upload Project
          </button>
        </div>
      </form>
    );
  };

export default ProjectUploadForm;