// components/search/SearchHero.jsx
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../cards/card';

const POPULAR_SEARCHES = ['Machine Learning', 'IoT', 'Blockchain', 'AI', 'Data Science'];

export default function SearchHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = false;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        // Simulated API call
        const results = [
          {
            title: `Research on ${searchQuery}`,
            author: 'John Doe',
            type: 'Research Paper',
            year: '2024',
          },
          {
            title: `Analysis of ${searchQuery}`,
            author: 'Jane Smith',
            type: 'Thesis',
            year: '2023',
          }
        ];
        setTimeout(() => {
          setSearchResults(results);
          setIsLoading(false);
        }, 800);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <div className={`relative min-h-[40vh] flex flex-col items-center pt-12 
                    ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#0066CC] 
                     transition-all duration-300 transform hover:scale-105 text-center">
        HUDC Institutional Repository
      </h1>

      {isSearchFocused && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/5 z-20 
                     transition-opacity duration-300 ease-in-out"
          onClick={clearSearch}
        />
      )}

      <section className={`w-full transition-all duration-300 relative z-30
                         ${isSearchFocused ? 'pt-8' : 'pt-0'}`}>
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSearch} 
                className={`relative transition-all duration-300
                           ${isSearchFocused ? 'transform -translate-y-28' : ''}`}>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search for papers, theses, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full h-12 pl-12 pr-12 rounded-full text-sm
                             transition-all duration-300
                             border focus:outline-none focus:ring-2 focus:ring-blue-200
                             ${isLoading ? 'border-blue-500' : 'border-gray-200'}
                             ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                             ${isSearchFocused ? 'shadow-lg' : ''}
                             appearance-none`}
                  style={{ WebkitAppearance: 'none' }}
                />
                {/* {isLoading ? (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                   h-4 w-4 text-gray-400" />
                )} */}

                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                   h-4 w-4 text-gray-400" />  

                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_0.2s_infinite]"></div>
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_0.4s_infinite]"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {isSearchFocused && (
                <Button
                  onClick={clearSearch}
                  type="button"
                  className="h-8 w-8 p-0 rounded-full shrink-0
                           bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 
                           dark:hover:bg-gray-600 transition-all duration-200
                           transform hover:scale-105"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2">
                <Card className={`shadow-lg border-0 rounded-lg overflow-hidden
                                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {isLoading ? (
                    <div className="p-4 flex flex-col items-center">
                      <div className="space-y-2 w-full">
                        {[1, 2, 3,4].map((i) => (
                          <div key={i} className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="space-y-3">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div  
                        key={index}
                        className={`p-3 border-b last:border-b-0 cursor-pointer
                                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      >
                        <h3 className="text-sm font-medium">{result.title}</h3>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>{result.author}</span>
                          <span>{result.year}</span>
                        </div>
                      </div>
                    ))
                  ) : searchQuery.length > 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No results found
                    </div>
                  ) : null}
                </Card>
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="text-gray-500">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setIsSearchFocused(true);
                  }}
                  className={`px-2 py-1 rounded-full transition-colors duration-200
                             ${isDarkMode 
                               ? 'bg-gray-800 hover:bg-gray-700' 
                               : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {term}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}