import { useState, useMemo, useEffect } from 'react';
import { BookMarked, AlertCircle } from 'lucide-react';
import ViewToggle from './AcquisitionsComponents/ViewToggle';
import SortControls from './AcquisitionsComponents/SortControls';
import SearchBar from './AcquisitionsComponents/SearchBar';
import AcquisitionsList from './AcquisitionsComponents/AcquisitionsList';
import AcquisitionsGrid from './AcquisitionsComponents/AcquisitionsGrid';
import api from '../utils/api'; // Import your API util

const Acquisitions = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for API data
  const [acquisitionsData, setAcquisitionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch acquisitions from API
  useEffect(() => {
    const fetchAcquisitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/acquisitions');

        const transformedData = response.data.data.map(item => ({
        id: item.accession_id,
        accessionNo: item.accession_no,
        title: item.title,
        author: item.author,
        coverImage: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1544947950-fa07a98d237f' : '1495446815901-a7297e633e8d'}?w=400&h=600&fit=crop`,
        acquisitionDate: item.date_accessioned
        // isbn, publisher, publicationYear are not in the view
      }));
        setAcquisitionsData(transformedData);
      } catch (err) {
        console.error('Error fetching acquisitions:', err);
        setError(err.response?.data?.message || 'Failed to load acquisitions');
      } finally {
        setLoading(false);
      }
    };

    fetchAcquisitions();
  }, []);

  const filteredAndSortedAcquisitions = useMemo(() => {
    let filtered = acquisitionsData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = acquisitionsData.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.accessionNo && book.accessionNo.toLowerCase().includes(query))
      );
    }

    const sorted = [...filtered];

    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.acquisitionDate);
        const dateB = new Date(b.acquisitionDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return sorted;
  }, [acquisitionsData, sortBy, sortOrder, searchQuery]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading acquisitions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookMarked className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Recent Acquisitions</h1>
            <p className="text-sm text-gray-600">
              {filteredAndSortedAcquisitions.length}{' '}
              {filteredAndSortedAcquisitions.length === 1 ? 'book' : 'books'}
              {searchQuery && ' found'} • Last 14 days
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Sticky Controls */}
        <div className="sticky top-0 z-40 bg-gray-50 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <SortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
            <ViewToggle
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Content */}
        <div>
          {filteredAndSortedAcquisitions.length > 0 ? (
            viewMode === 'grid' ? (
              <AcquisitionsGrid acquisitions={filteredAndSortedAcquisitions} />
            ) : (
              <AcquisitionsList acquisitions={filteredAndSortedAcquisitions} />
            )
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-16 text-center">
              <p className="text-gray-500 text-lg font-normal tracking-normal">
                {searchQuery 
                  ? `No books found matching "${searchQuery}"`
                  : 'No acquisitions in the last 14 days'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             transition-colors duration-200 font-medium tracking-normal"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Acquisitions;