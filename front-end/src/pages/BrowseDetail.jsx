import { useSearchParams, useNavigate , Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  User, 
  Eye,
  Download,
  Files,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { useDepartmentFiles } from '../hooks/useDepartmentFiles';
import Header from '../components/layout/Header';
import Footer from '../components/layout/footer';
import { Button } from '../components/ui/button';

export default function DepartmentDetail() {
  const { files, loading, error, pagination, setSearchParams } = useDepartmentFiles();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading files...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center text-red-600">
              <h2 className="text-xl font-semibold mb-2">Unable to load files</h2>
              <p className="text-sm text-gray-600">{error.message}</p>
              <Button 
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalPages = Math.ceil(pagination.count / 7);

  return (
    <>
          {/* Home Button */}
     <Link
        to="/"
        className="absolute top-10 left-4 p-2 rounded-full bg-white 
                   shadow-lg hover:shadow-xl transition-all duration-200 
                   group hover:scale-105 z-50"
      >
        <Home className="h-5 w-5 text-[#0066CC] group-hover:text-[#0052A3]" />
      </Link>

      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Files Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Files className="h-5 w-5 text-[#0066CC]" />  
              <h2 className="text-xl font-semibold text-gray-900">Searched Files</h2>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-6">
            {files.map((file) => (
              <div 
                key={file.id}
                className="group border-b border-gray-100 pb-6 last:border-0 last:pb-0 cursor-pointer"
                onClick={() => navigate(`/fileViwe/${file.id}`)}
              >
                <h3 className="font-medium text-gray-900 group-hover:text-[#0066CC] 
                             transition-colors duration-200 mb-3">
                  {file.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{file.author || 'Unknown Author'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{file.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats and Type */}
                {/* <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{file.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{file.downloads || 0}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full 
                               bg-[#0066CC]/10 text-[#0066CC]">
                    {file.type || 'Document'}
                  </span>
                </div> */}
              </div>
            ))}

            {/* No files message */}
            {files.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No files to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination - Separated from card */}
        {pagination.count > 0 && (
          <div className="flex justify-center items-center gap-2">
            {/* Previous button */}
            <Button
              variant="outline"
              className="text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= pagination.currentPage - 1 && 
                 pageNumber <= pagination.currentPage + 1)
              ) {
                return (
                  <Button
                    key={i}
                    variant={pagination.currentPage === pageNumber ? "default" : "outline"}
                    className={`px-4 py-2 min-w-[40px] ${
                      pagination.currentPage === pageNumber
                        ? 'bg-[#0066CC] text-white'
                        : 'text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5'
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                pageNumber === pagination.currentPage - 2 ||
                pageNumber === pagination.currentPage + 2
              ) {
                return (
                  <span
                    key={i}
                    className="px-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* Next button */}
            <Button
              variant="outline"
              className="text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}