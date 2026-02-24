import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArchiveBoxIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const dropdownRef = useRef(null)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const searchPlaceholder = useMemo(() => {
    const placeholders = [
      'Search by accession number, title, or source...',
      'Try searching by donor name or date...',
      'Looking for something specific? Use quotes.'
    ]
    return placeholders[new Date().getDate() % placeholders.length]
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSlash = event.key === '/'
      const isEscape = event.key === 'Escape'
      const activeTag = document.activeElement?.tagName?.toLowerCase()
      const isTypingField = ['input', 'textarea', 'select'].includes(activeTag)

      if (isEscape) setIsStatusOpen(false)

      if (isSlash && !isTypingField) {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsStatusOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search accessions"
            className="
              w-full pl-10 pr-10 py-2
              border border-gray-300 bg-white
              focus:outline-none focus:ring-0 focus:border-gray-300
            "
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-gray-600
                bg-transparent border-0 p-0
                focus:outline-none focus:ring-0
              "
              aria-label="Clear search"
              title="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto" ref={dropdownRef}>
          <FunnelIcon className="w-5 h-5 text-gray-600" />

          <div className="relative w-full md:w-64">
            <button
              type="button"
              onClick={() => setIsStatusOpen(prev => !prev)}
              className="
                w-full px-4 py-2
                border border-gray-300
                text-left bg-white
                flex items-center justify-between
                focus:outline-none focus:ring-0
              "
              aria-haspopup="listbox"
              aria-expanded={isStatusOpen}
            >
              <span className="truncate text-gray-800">
                {selectedStatus === 'all' ? 'All Statuses' : selectedStatus}
              </span>
              <span className="text-gray-400">▾</span>
            </button>

            {isStatusOpen && (
              <div className="absolute z-20 mt-2 w-full border border-gray-200 bg-white shadow-lg">
                <div className="max-h-64 overflow-y-auto py-2 text-sm">
                  {statuses.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status)
                        setIsStatusOpen(false)
                      }}
                      className="
                        w-full text-left px-4 py-2
                        bg-white hover:bg-gray-50
                        text-gray-700
                        focus:outline-none focus:ring-0
                      "
                    >
                      {status === 'all' ? 'All Statuses' : status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onArchiveClick}
            className="
              flex items-center gap-2 px-6 py-2
              text-gray-700 bg-white
              border border-gray-300 shadow-sm
              hover:bg-gray-50 hover:shadow-md
              transition-all
              w-full md:w-auto justify-center
              focus:outline-none focus:ring-0
            "
            title="View archived accessions"
          >
            <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Archives</span>
          </button>

          <button
            onClick={onAddClick}
            className="
              flex items-center gap-2 px-6 py-2
              text-gray-800 bg-gray-200
              shadow-sm hover:bg-gray-300 hover:shadow-md
              transition-all
              w-full md:w-auto justify-center
              focus:outline-none focus:ring-0
            "
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



