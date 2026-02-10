import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative w-full md:w-96">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className="
            w-full pl-12 pr-12 py-3
            border border-gray-200 bg-white shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#154A9A]/20 focus:border-[#154A9A]
            transition-all duration-200
            text-[15px] font-normal tracking-normal
            placeholder:text-gray-400 placeholder:font-normal
          "
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
              p-1 hover:bg-gray-100
            "
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="absolute left-0 right-0 top-full mt-2">
          <p className="text-xs text-gray-500 font-normal tracking-wide">
            Press{' '}
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 font-medium">
              Esc
            </kbd>{' '}
            to clear
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

