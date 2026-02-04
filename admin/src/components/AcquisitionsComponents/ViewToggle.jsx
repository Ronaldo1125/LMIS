import React from 'react';

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex gap-2 p-1.5 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
      <button
        className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-300 ${
          viewMode === 'grid'
            ? 'bg-[#154A9A] text-white shadow-md'
            : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#0F61F7]'
        }`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="2" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="11.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      
      <button
        className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-300 ${
          viewMode === 'list'
            ? 'bg-[#154A9A] text-white shadow-md'
            : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#0F61F7]'
        }`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
        title="List view"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="3.5" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="14.5" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;