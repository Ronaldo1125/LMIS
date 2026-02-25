import { Search, Filter, UserCog, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  roleFilter, 
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onAddLibrarian,
  isAdmin,
  dark = false
}) {
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const inputBg      = dark ? '#081422' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#e2e8f0'
  const dropdownBg   = dark ? '#12294a' : '#ffffff'
  const dropdownHover= dark ? '#1a3356' : '#f1f5f9'
  const btnLibrarianBg = dark ? '#a855f7' : 'var(--secondary-1-medium)'
  const btnLibrarianBorder = dark ? '#7c3aed' : 'var(--secondary-1-dark)'

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

      if (isEscape) { setIsRoleOpen(false); setIsStatusOpen(false) }
      if (isSlash && !isTypingField) { event.preventDefault(); searchInputRef.current?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!roleDropdownRef.current?.contains(event.target)) setIsRoleOpen(false)
      if (!statusDropdownRef.current?.contains(event.target)) setIsStatusOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="bg-white shadow-md p-6 mb-8 border border-gray-100" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: textMuted }} size={20} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border focus:outline-none focus:ring-0 transition-all"
            style={{ borderColor: inputBorder, background: inputBg, color: textPrimary, fontFamily: 'inherit', fontSize: '1rem' }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 active:bg-transparent"
              style={{ color: textMuted }} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="relative" ref={roleDropdownRef}>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10" style={{ color: textMuted }} size={18} />
          <button type="button"
            onClick={() => { setIsRoleOpen(!isRoleOpen); setIsStatusOpen(false) }}
            className="pl-10 pr-8 py-3 border focus:outline-none focus:ring-0 flex items-center justify-between transition-all"
            style={{ borderColor: inputBorder, background: inputBg, color: textPrimary, fontFamily: 'inherit', minWidth: 150, borderRadius: '0.5rem' }}
            aria-haspopup="listbox" aria-expanded={isRoleOpen}>
            <span className="truncate" style={{ color: textPrimary }}>{roleFilter === 'All' ? 'All Roles' : roleFilter}</span>
            <span style={{ color: textMuted, marginLeft: 8 }}>▾</span>
          </button>
          {isRoleOpen && (
            <div className="absolute z-20 mt-2 w-full" style={{ border: `1px solid ${border}`, background: dropdownBg, boxShadow: dark ? '0 2px 8px rgba(16,37,70,0.25)' : '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '0.5rem' }}>
              <div className="max-h-64 overflow-y-auto py-2 text-sm">
                {roles.map(role => (
                  <button key={role} type="button" onClick={() => { setRoleFilter(role); setIsRoleOpen(false) }}
                    className="w-full text-left px-4 py-2 focus:outline-none focus:ring-0"
                    style={{ background: dropdownBg, color: textPrimary, fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = dropdownHover}
                    onMouseLeave={e => e.currentTarget.style.background = dropdownBg}>
                    {role === 'All' ? 'All Roles' : role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusDropdownRef}>
          <button type="button"
            onClick={() => { setIsStatusOpen(!isStatusOpen); setIsRoleOpen(false) }}
            className="pl-4 pr-8 py-3 border focus:outline-none focus:ring-0 flex items-center justify-between transition-all"
            style={{ borderColor: inputBorder, background: inputBg, color: textPrimary, fontFamily: 'inherit', minWidth: 150, borderRadius: '0.5rem' }}
            aria-haspopup="listbox" aria-expanded={isStatusOpen}>
            <span className="truncate" style={{ color: textPrimary }}>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
            <span style={{ color: textMuted, marginLeft: 8 }}>▾</span>
          </button>
          {isStatusOpen && (
            <div className="absolute z-20 mt-2 w-full" style={{ border: `1px solid ${border}`, background: dropdownBg, boxShadow: dark ? '0 2px 8px rgba(16,37,70,0.25)' : '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '0.5rem' }}>
              <div className="max-h-64 overflow-y-auto py-2 text-sm">
                {statuses.map(status => (
                  <button key={status} type="button" onClick={() => { setStatusFilter(status); setIsStatusOpen(false) }}
                    className="w-full text-left px-4 py-2 focus:outline-none focus:ring-0"
                    style={{ background: dropdownBg, color: textPrimary, fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = dropdownHover}
                    onMouseLeave={e => e.currentTarget.style.background = dropdownBg}>
                    {status === 'All' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Librarian button — only for admins */}
        {isAdmin && (
          <button
            onClick={onAddLibrarian}
            className="flex items-center gap-2 px-5 py-3 font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-0"
            style={{ background: btnLibrarianBg, color: '#fff', fontFamily: 'inherit', border: `1px solid ${btnLibrarianBorder}` }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? '#9333ea' : '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.background = btnLibrarianBg}
          >
            <UserCog size={18} />
            Add Librarian
          </button>
        )}
      </div>

      <style>{`
        button[aria-haspopup="listbox"]:hover {
          background-color: ${dark ? inputBg : '#fff'} !important;
        }
      `}</style>
    </div>
  )
}

export default SearchBar