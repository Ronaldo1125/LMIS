import { useState, useMemo, useEffect } from 'react';
import { BookMarked } from 'lucide-react';
import ViewToggle from './AcquisitionsComponents/ViewToggle';
import SortControls from './AcquisitionsComponents/SortControls';
import SearchBar from './AcquisitionsComponents/SearchBar';
import AcquisitionsList from './AcquisitionsComponents/AcquisitionsList';
import AcquisitionsGrid from './AcquisitionsComponents/AcquisitionsGrid';

const Acquisitions = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('date'); // 'alphabetical' or 'date'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const acquisitionsData = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      acquisitionDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      acquisitionDate: "2024-02-03"
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      acquisitionDate: "2024-01-28"
    },
    {
      id: 4,
      title: "Educated",
      author: "Tara Westover",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      acquisitionDate: "2024-02-01"
    },
    {
      id: 5,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      acquisitionDate: "2024-01-20"
    },
    {
      id: 6,
      title: "Dune",
      author: "Frank Herbert",
      coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
      acquisitionDate: "2024-01-10"
    }
  ];

  const filteredAndSortedAcquisitions = useMemo(() => {
    let filtered = acquisitionsData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = acquisitionsData.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
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
  }, [sortBy, sortOrder, searchQuery]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookMarked className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Acquisitions</h1>
            <p className="text-sm text-gray-600">
              {filteredAndSortedAcquisitions.length}{' '}
              {filteredAndSortedAcquisitions.length === 1 ? 'book' : 'books'}
              {searchQuery && ' found'}
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
                No books found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors duration-200 font-medium tracking-normal"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Acquisitions;
