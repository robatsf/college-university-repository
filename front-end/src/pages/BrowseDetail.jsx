import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/footer";

const BrowserDetails = () => {
    const { id } = useParams(); // Get the ID from URL
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch(`/api/projects/${id}`);
                if (!response.ok) {
                    throw new Error('Project not found');
                }
                const data = await response.json();
                setProjectDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-4">
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                ) : projectDetails ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Project Header */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                {projectDetails.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-600">
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Author:</span>
                                    {projectDetails.author}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Department:</span>
                                    {projectDetails.department}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Date:</span>
                                    {new Date(projectDetails.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Project Content */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            {/* Abstract */}
                            <section>
                                <h2 className="text-xl font-semibold mb-3">Abstract</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {projectDetails.abstract}
                                </p>
                            </section>

                            {/* Keywords */}
                            <section>
                                <h2 className="text-xl font-semibold mb-3">Keywords</h2>
                                <div className="flex flex-wrap gap-2">
                                    {projectDetails.keywords?.map((keyword, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Download Section */}
                            <section className="border-t pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">Download Project</h2>
                                        <p className="text-sm text-gray-500">PDF format, {projectDetails.fileSize}</p>
                                    </div>
                                    <button 
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => window.open(projectDetails.downloadUrl)}
                                    >
                                        Download
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        No project details found
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BrowserDetails;