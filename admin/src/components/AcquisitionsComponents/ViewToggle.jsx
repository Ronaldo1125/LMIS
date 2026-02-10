import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline';

const ViewToggle = ({ viewMode, onViewChange }) => {
  const isGridActive = viewMode === 'grid';
  const isListActive = viewMode === 'list';

  return (
    <div className="inline-flex items-center bg-white border border-slate-300 shadow-sm p-1">
      
      {/* Grid */}
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        className={`
          !border-0 !p-0 !m-0
          flex h-10 w-10 items-center justify-center
          transition-all duration-300 ease-out
          ${isGridActive ? '!bg-[#154A9A]' : '!bg-transparent hover:!bg-slate-100'}
        `}
      >
        <Squares2X2Icon
          className="h-5 w-5"
          stroke={isGridActive ? '#ffffff' : '#154A9A'}
          strokeWidth={2}
        />
      </button>

      {/* List */}
      <button
        type="button"
        onClick={() => onViewChange('list')}
        aria-label="List view"
        className={`
          !border-0 !p-0 !m-0
          flex h-10 w-10 items-center justify-center
          transition-all duration-300 ease-out
          ${isListActive ? '!bg-[#154A9A]' : '!bg-transparent hover:!bg-slate-100'}
        `}
      >
        <Bars3Icon
          className="h-5 w-5"
          stroke={isListActive ? '#ffffff' : '#154A9A'}
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default ViewToggle;

