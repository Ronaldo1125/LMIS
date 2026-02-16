import { Search, Filter, UserPlus, UserCog, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  roleFilter, 
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onAddStaff,
  onAddLibrarian,
  isAdmin // Changed from currentUserRole
}) {
  const searchInputRef = useRef(null)
  const roleDropdownRef = useRef(null)
  const statusDropdownRef = useRef(null)
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const roles = ['All', 'Staff', 'Librarian', 'Patron']
  const statuses = ['All', 'Active', 'Inactive']

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSlash = event.key === '/'
      const isEscape = event.key === 'Escape'
      const activeTag = document.activeElement?.tagName?.toLowerCase()
      const isTypingField = ['input', 'textarea', 'select'].includes(activeTag)

      if (isEscape) {
        setIsRoleOpen(false)
        setIsStatusOpen(false)
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
      if (!roleDropdownRef.current?.contains(event.target)) {
        setIsRoleOpen(false)
      }
      if (!statusDropdownRef.current?.contains(event.target)) {
        setIsStatusOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="bg-white shadow-md p-6 mb-8 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 transition-all"
            style={{ fontFamily: '"Inter", sans-serif' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent border-0 p-0 focus:outline-none focus:ring-0 active:bg-transparent"
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="relative" ref={roleDropdownRef}>
          <Filter 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" 
            size={18}
          />
          <button
            type="button"
            onClick={() => {
              setIsRoleOpen(!isRoleOpen)
              setIsStatusOpen(false)
            }}
            className="pl-10 pr-8 py-3 border border-gray-300 bg-white hover:bg-white focus:outline-none focus:ring-0 focus:border-gray-300 active:bg-white flex items-center justify-between transition-all"
            style={{ fontFamily: '"Inter", sans-serif', minWidth: '150px' }}
            aria-haspopup="listbox"
            aria-expanded={isRoleOpen}
          >
            <span className="truncate text-gray-800">
              {roleFilter === 'All' ? 'All Roles' : roleFilter}
            </span>
            <span className="text-gray-400">▾</span>
          </button>

          {isRoleOpen && (
            <div className="absolute z-20 mt-2 w-full border border-gray-200 bg-white shadow-lg">
              <div className="max-h-64 overflow-y-auto py-2 text-sm">
                {roles.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setRoleFilter(role)
                      setIsRoleOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 active:bg-white"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    {role === 'All' ? 'All Roles' : role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen)
              setIsRoleOpen(false)
            }}
            className="pl-4 pr-8 py-3 border border-gray-300 bg-white hover:bg-white focus:outline-none focus:ring-0 focus:border-gray-300 active:bg-white flex items-center justify-between transition-all"
            style={{ fontFamily: '"Inter", sans-serif', minWidth: '150px' }}
            aria-haspopup="listbox"
            aria-expanded={isStatusOpen}
          >
            <span className="truncate text-gray-800">
              {statusFilter === 'All' ? 'All Status' : statusFilter}
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
                      setStatusFilter(status)
                      setIsStatusOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 active:bg-white"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    {status === 'All' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Only show for admins */}
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={onAddStaff}
              className="flex items-center gap-2 px-5 py-3 font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-0"
              style={{
                backgroundColor: 'var(--dark-blue-1)',
                color: 'var(--white)',
                fontFamily: '"Inter", sans-serif',
                border: '1px solid var(--dark-blue-2)'
              }}
            >
              <UserPlus size={18} />
              Add Staff
            </button>

            <button
              onClick={onAddLibrarian}
              className="flex items-center gap-2 px-5 py-3 font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-0"
              style={{
                backgroundColor: 'var(--secondary-1-medium)',
                color: 'var(--white)',
                fontFamily: '"Inter", sans-serif',
                border: '1px solid var(--secondary-1-dark)'
              }}
            >
              <UserCog size={18} />
              Add Librarian
            </button>
          </div>
        )}
      </div>

      <style>{`
        button[aria-haspopup="listbox"]:hover {
          background-color: white !important;
        }
      `}</style>
    </div>
  )
}

export default SearchBar