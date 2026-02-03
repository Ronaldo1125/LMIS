import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories,
  onAddClick 
}) => {
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState({
    Reports: false,
    Periodicals: false,
    'Reference Materials': false
  })

  const searchPlaceholder = useMemo(() => {
    const placeholders = [
      'Search by title, author, or ISBN...',
      'Try “climate change”, “atlas”, or “policy”...',
      'Looking for a phrase? Use quotes like “water scarcity”.'
    ]
    return placeholders[new Date().getDate() % placeholders.length]
  }, [])

  const groupedCategories = useMemo(() => {
    const groupMap = {
      Reports: ['Annual Reports', 'Special Reports'],
      Periodicals: ['Magazines', 'Newspapers', 'Journals'],
      'Reference Materials': ['Encyclopedia', 'Atlas']
    }

    const standalone = [
      'Books',
      'Sourcebook',
      'Thesis/Research papers',
      'Statute/Law/Legal Documents',
      'Guides/Manuals'
    ]

    const has = (value) => categories.includes(value)

    const groups = Object.entries(groupMap)
      .filter(([label]) => has(label))
      .map(([label, children]) => ({
        label,
        options: [label, ...children.filter(has)]
      }))

    const singles = standalone.filter(has)

    return { groups, singles }
  }, [categories])

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSlash = event.key === '/'
      const isEscape = event.key === 'Escape'
      const activeTag = document.activeElement?.tagName?.toLowerCase()
      const isTypingField = ['input', 'textarea', 'select'].includes(activeTag)

      if (isEscape) {
        setIsCategoryOpen(false)
      }

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
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search catalog"
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

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto" ref={dropdownRef}>
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <div className="relative w-full md:w-72">
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-white focus:outline-none focus:ring-0 focus:border-gray-300 active:bg-white flex items-center justify-between"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
            >
              <span className="truncate text-gray-800">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </span>
              <span className="text-gray-400">▾</span>
            </button>

            {isCategoryOpen && (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="max-h-64 overflow-y-auto py-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all')
                      setIsCategoryOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 focus:bg-white active:bg-white"
                  >
                    All Categories
                  </button>

                  {groupedCategories.groups.map(group => {
                    const isOpen = openGroups[group.label]
                    return (
                      <div key={group.label} className="border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenGroups((prev) => ({
                              ...prev,
                              [group.label]: !prev[group.label]
                            }))
                          }
                          className="w-full text-left px-4 py-2 flex items-center justify-between text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 active:bg-white"
                        >
                          <span className="font-medium">{group.label}</span>
                          <span className="text-gray-400">{isOpen ? '–' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div className="pb-2">
                            {group.options.map(option => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(option)
                                  setIsCategoryOpen(false)
                                }}
                                className="w-full text-left px-6 py-2 bg-white hover:bg-gray-50 text-gray-600 focus:outline-none focus:ring-0 active:bg-white"
                              >
                                {option === group.label ? `All ${group.label}` : option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {groupedCategories.singles.length > 0 && (
                    <div className="border-t border-gray-100">
                      {groupedCategories.singles.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(option)
                            setIsCategoryOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 active:bg-white"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Book Button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2 text-gray-800 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 hover:shadow-md transition-all w-full md:w-auto justify-center focus:outline-none focus:ring-0"
          title="Add a new catalog item"
        >
          <PlusIcon className="w-5 h-5 text-gray-700" />
          <span className="font-medium">Add New Book</span>
        </button>
      </div>
    </div>
  )
}

export default SearchAndFilter
