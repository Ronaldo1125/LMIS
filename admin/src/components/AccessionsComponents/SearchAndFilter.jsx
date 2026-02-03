import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArchiveBoxIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useRef } from 'react'

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  statuses,
  onAddClick,
  onArchiveClick
}) => {
  const searchInputRef = useRef(null)

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by accession number, title, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search accessions"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent border-0 p-0 focus:outline-none focus:ring-0 active:bg-transparent"
              aria-label="Clear search"
              title="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <div className="relative w-full md:w-64">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              aria-label="Filter by status"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onArchiveClick}
            className="flex items-center gap-2 px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all w-full md:w-auto justify-center focus:outline-none focus:ring-0"
            title="View archived accessions"
          >
            <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Archives</span>
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-2 text-gray-800 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 hover:shadow-md transition-all w-full md:w-auto justify-center focus:outline-none focus:ring-0"
            title="Add new accession"
          >
            <PlusIcon className="w-5 h-5 text-gray-700" />
            <span className="font-medium">Add Accession</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilter
