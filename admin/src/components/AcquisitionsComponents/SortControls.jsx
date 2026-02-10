import React from 'react';

const SortControls = ({ sortBy, sortOrder, onSortChange }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-slate-200 shadow-sm hover:border-[#0F61F7] transition-all duration-300">
      <span className="text-sm font-semibold text-slate-600 tracking-wide">
        Sort by:
      </span>

      {/* Alphabetical */}
      <button
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          sortBy === 'alphabetical'
            ? 'bg-[#154A9A] text-white shadow-md'
            : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#0F61F7]'
        }`}
        onClick={() => onSortChange('alphabetical')}
      >
        <span>A-Z</span>
        {sortBy === 'alphabetical' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${
              sortOrder === 'desc' ? 'rotate-180' : ''
            }`}
          >
            <path d="M8 3L12 7H4L8 3Z" fill="currentColor" />
            <path d="M8 13L4 9H12L8 13Z" fill="currentColor" opacity="0.3" />
          </svg>
        )}
      </button>

      {/* Date */}
      <button
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          sortBy === 'date'
            ? 'bg-[#154A9A] text-white shadow-md'
            : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#0F61F7]'
        }`}
        onClick={() => onSortChange('date')}
      >
        <span>Date</span>
        {sortBy === 'date' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${
              sortOrder === 'desc' ? 'rotate-180' : ''
            }`}
          >
            <path d="M8 3L12 7H4L8 3Z" fill="currentColor" />
            <path d="M8 13L4 9H12L8 13Z" fill="currentColor" opacity="0.3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SortControls;

