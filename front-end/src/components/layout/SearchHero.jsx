import { useState, useEffect } from 'react';
import { Search, X, Bookmark, Users, FileText, Calendar } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../cards/card';
import { useSearch } from '../../hooks/useSearch';

export default function SearchHero({ defaultFilter = null }) {
  const [searchParams] = useSearchParams();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSearches,
    isLoading,
    error
  } = useSearch();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showBrowseItems, setShowBrowseItems] = useState(false);

  // Handle default filter on component mount
  useEffect(() => {
    if (defaultFilter) {
      setSearchQuery(`@${defaultFilter} `);
      setIsSearchFocused(true);
    }
  }, [defaultFilter]);

  // Handle filter from URL params on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setSearchQuery(`@${filterParam} `);
      setIsSearchFocused(true);
    }
  }, []);

  const browseItems = [
    { 
      icon: Bookmark, 
      text: 'Titles',
      filter: '@title',
      description: 'Search through item titles'
    },
    { 
      icon: Users, 
      text: 'Authors',
      filter: '@author',
      description: 'Explore works by author names'
    },
    { 
      icon: FileText, 
      text: 'Academic Departments',
      filter: '@department',
      description: 'Browse through all communities and collections'
    },
    { 
      icon: Calendar, 
      text: 'By Date',
      filter: '@year',
      description: 'Find items by date of publication'
    },
  ];

  // Monitor search query for @ symbol
  useEffect(() => {
    if (searchQuery === '@') {
      setShowBrowseItems(true);
    } else if (!searchQuery.startsWith('@')) {
      setShowBrowseItems(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    setShowBrowseItems(false);
  };

  const handleBrowseItemClick = (filter) => {
    const filterValue = filter.replace('@', '');
    setSearchQuery(`@${filterValue} `);
    setShowBrowseItems(false);
    setIsSearchFocused(true);
  };

  // Determine when to show browse items
  const shouldShowBrowseItems = showBrowseItems || searchQuery === '@';

  // Determine when to show search results
  const shouldShowResults = isSearchFocused && searchQuery && !searchQuery.endsWith('@') && !showBrowseItems;

  return (
    <div className="relative min-h-[40vh] flex flex-col items-center pt-12 bg-white text-gray-900">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#0066CC] transition-all duration-300 transform hover:scale-105 text-center">
        HUDC Institutional Repository
      </h1>

      {isSearchFocused && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/5 z-20 transition-opacity duration-300 ease-in-out"
          onClick={clearSearch}
        />
      )}

      <section className={`w-full transition-all duration-300 relative z-30 ${isSearchFocused ? 'pt-8' : 'pt-0'}`}>
        <div className="max-w-2xl mx-auto px-4">
          <form 
            onSubmit={handleSearch} 
            className={`relative transition-all duration-300 ${isSearchFocused ? 'transform -translate-y-28' : ''}`}
          >
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                 id="searchInput"
                  type="search"
                  placeholder="Search for papers, theses, projects... (Type @ for filters)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full h-12 pl-12 pr-12 rounded-full text-sm transition-all duration-300 bg-white
                    border focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20
                    ${isLoading ? 'border-[#0066CC]' : 'border-gray-200'}
                    ${isSearchFocused ? 'shadow-lg' : ''}
                    appearance-none`}
                  style={{ WebkitAppearance: 'none' }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#0066CC] animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-1 rounded-full bg-[#0066CC] animate-[pulse_0.8s_ease-in-out_0.2s_infinite]"></div>
                      <div className="w-1 h-1 rounded-full bg-[#0066CC] animate-[pulse_0.8s_ease-in-out_0.4s_infinite]"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {isSearchFocused && (
                <Button
                  onClick={clearSearch}
                  type="button"
                  className="h-8 w-8 p-0 rounded-full shrink-0 bg-gray-200 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Browse Items */}
            {shouldShowBrowseItems && (
              <div className="absolute top-full left-0 right-0 mt-2">
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden bg-white">
                  {browseItems.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleBrowseItemClick(item.filter)}
                      className="w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-[#0066CC]" />
                        <span className="text-sm font-medium text-[#0066CC]">{item.text}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </Card>
              </div>
            )}

            {/* Search Results */}
            {shouldShowResults && (
              <div className="absolute top-full left-0 right-0 mt-5">
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden bg-white">
                  {isLoading ? (
                    <div className="p-4 flex flex-col items-center">
                      <div className="space-y-2 w-full">
                        {[1, 2, 3, 4].map((i) => (
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
                  ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={`/viewfile/${result.id}`}
                        className="block p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <h3 className="text-sm font-medium text-[#0066CC] hover:text-[#0052A3]">
                          {result.title}
                        </h3>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>{result.author}</span>
                          <span>{result.department}</span>
                          <span>{new Date(result.created_at).getFullYear()}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches?.length > 0 && !shouldShowBrowseItems && !shouldShowResults && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-gray-500">Popular:</span>
                {popularSearches.map((search, index) => (
                  <button
                    key={`${search.query}-${index}`}
                    type="button"
                    onClick={() => {
                      setSearchQuery(search.query);
                      setIsSearchFocused(true);
                    }}
                    className="px-2 py-1 rounded-full transition-colors duration-200 bg-gray-100 hover:bg-gray-200"
                  >
                    {search.query}
                  </button>
                ))}
              </div>
            )}
                      </form>
        </div>
      </section>
    </div>
  );
}
