import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange, dark = false }) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative w-full md:w-96">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? 'text-gray-300' : 'text-gray-400'}`}
          size={20}
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className={`w-full pl-12 pr-12 py-3 border shadow-lg rounded-xl transition-all duration-200 text-[15px] font-normal tracking-normal placeholder:font-normal ${dark ? 'bg-[#0a1628] border-[#1a3356] text-gray-200 placeholder:text-gray-400 focus:ring-[#93c5fd]/20 focus:border-[#93c5fd]' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-[#154A9A]/20 focus:border-[#154A9A]'}`}
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 rounded ${dark ? 'text-gray-300 hover:text-white hover:bg-[#1a3356]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="absolute left-0 right-0 top-full mt-2">
          <p className={`text-xs font-normal tracking-wide ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Press{' '}
            <kbd className={`px-2 py-0.5 border font-medium ${dark ? 'bg-[#1a3356] border-[#93c5fd] text-[#93c5fd]' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>Esc</kbd>{' '}to clear
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

