
// Enhanced Projects Section
const UploadedProjectsSection = () => {
    const projects = [
      { title: "AI Research", date: "01/05/2025", status: "Completed" },
      { title: "Data Science", date: "12/12/2024", status: "In Review" },
    ];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl">Uploaded Projects</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{project.title}</p>
                  <p className="text-sm text-gray-500 mt-1">Uploaded on: {project.date}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default UploadedProjectsSection;