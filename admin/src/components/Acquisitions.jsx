import { useState, useMemo } from 'react';
import ViewToggle from './AcquisitionsComponents/ViewToggle';
import SortControls from './AcquisitionsComponents/SortControls';
import AcquisitionsList from './AcquisitionsComponents/AcquisitionsList';
import AcquisitionsGrid from './AcquisitionsComponents/AcquisitionsGrid';

const Acquisitions = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('date'); // 'alphabetical' or 'date'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Sample data - replace with your actual data source
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

  // Sorting logic
  const sortedAcquisitions = useMemo(() => {
    const sorted = [...acquisitionsData];
    
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
  }, [sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same sort option
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to descending for new sort
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b-2 border-slate-200">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-5xl font-bold mb-2 tracking-tight text-[#154A9A]">
            Acquisitions
          </h1>
          <p className="text-base text-slate-600 font-medium">
            {sortedAcquisitions.length} {sortedAcquisitions.length === 1 ? 'book' : 'books'} acquired
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
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
      </div>

      <div>
        {viewMode === 'grid' ? (
          <AcquisitionsGrid acquisitions={sortedAcquisitions} />
        ) : (
          <AcquisitionsList acquisitions={sortedAcquisitions} />
        )}
      </div>
    </div>
  );
};

export default Acquisitions;