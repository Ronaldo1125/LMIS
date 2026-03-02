import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusOption = ({ label, active, onClick, dark, textPrimary }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: '100%', padding: '0.5rem 1rem', textAlign: 'left',
        fontSize: '0.875rem', cursor: 'pointer', border: 'none',
        background: hover
          ? (dark ? '#1a3356' : '#f1f5f9')
          : active ? (dark ? 'rgba(21,74,154,0.2)' : '#eff6ff') : 'transparent',
        color: textPrimary,
        fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

const ActionButton = ({ onClick, icon: Icon, label, variant, dark, border }) => {
  const [hover, setHover] = useState(false)

  const getColors = () => {
    if (variant === 'primary') return { bg: dark ? '#154A9A' : '#1e293b', text: '#fff', hoverBg: '#1a3a6d' }
    return { bg: dark ? 'rgba(255,255,255,0.05)' : '#fff', text: dark ? '#6b8cae' : '#4b5563', hoverBg: dark ? '#1a3356' : '#f1f5f9' }
  }

  const c = getColors()

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
        background: hover ? c.hoverBg : c.bg,
        border: variant === 'primary' ? 'none' : `1px solid ${border}`,
        color: c.text, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        fontFamily: 'inherit',
      }}
    >
      <Icon style={{ width: '1.125rem', height: '1.125rem' }} />
      <span>{label}</span>
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

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
  // ── Colors ────────────────────────────────────────────────
  const containerBg  = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const inputBg      = dark ? '#0d1d35' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const dropdownBg   = dark ? '#162a4a' : '#ffffff'

  const searchInputRef  = useRef(null)
  const roleDropdownRef = useRef(null)
  const statusDropdownRef = useRef(null)
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const roles    = ['All', 'Staff', 'Librarian', 'Patron']
  const statuses = ['All', 'Active', 'Inactive']

  const handleClearAll = () => {
    setSearchQuery('')
    setRoleFilter('All')
    setStatusFilter('All')
    setIsRoleOpen(false)
    setIsStatusOpen(false)
  }

  const isFiltered = searchQuery || roleFilter !== 'All' || statusFilter !== 'All'

  useEffect(() => {
    const onKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase()
      const isTyping  = ['input', 'textarea', 'select'].includes(activeTag)
      if (e.key === 'Escape') handleClearAll()
      if (e.key === '/' && !isTyping) { e.preventDefault(); searchInputRef.current?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSearchQuery, setRoleFilter, setStatusFilter])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!roleDropdownRef.current?.contains(e.target))   setIsRoleOpen(false)
      if (!statusDropdownRef.current?.contains(e.target)) setIsStatusOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 2.5rem 0.625rem 2.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg, color: textPrimary,
    fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const dropdownBtnStyle = {
    width: '100%', padding: '0.625rem 1rem',
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem', textAlign: 'left', color: textPrimary,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit',
  }

  const dropdownMenuStyle = {
    position: 'absolute', top: '110%', left: 0, width: '100%',
    background: dropdownBg, border: `1px solid ${border}`,
    borderRadius: '0.5rem', zIndex: 50, overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  }

  return (
    <div style={{
      background: containerBg,
      padding: '1.25rem',
      borderRadius: '0.75rem',
      border: `1px solid ${border}`,
      boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '1.5rem',
      transition: 'all 0.45s ease',
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = dark ? '#93c5fd' : '#154A9A'}
            onBlur={e => e.target.style.borderColor = inputBorder}
          />
          {searchQuery && (
            <XMarkIcon
              onClick={() => setSearchQuery('')}
              style={{ width: '1.125rem', height: '1.125rem', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: textSecondary }}
            />
          )}
          {isFiltered && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: dark ? '#93c5fd' : '#64748b', margin: 0 }}>
                Press{' '}
                <kbd style={{
                  padding: '1px 6px',
                  border: `1px solid ${dark ? '#93c5fd' : '#e2e8f0'}`,
                  borderRadius: 4, fontSize: '0.75rem', fontWeight: 600,
                  background: dark ? '#1a3356' : '#f1f5f9',
                  color: dark ? '#93c5fd' : '#475569',
                }}>Esc</kbd>{' '}
                to clear all filters
              </p>
            </div>
          )}
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '0 1 180px', position: 'relative' }} ref={roleDropdownRef}>
          <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary, flexShrink: 0 }} />
          <div style={{ position: 'relative', width: '100%' }}>
            <button onClick={() => { setIsRoleOpen(p => !p); setIsStatusOpen(false) }} style={dropdownBtnStyle}>
              <span>{roleFilter === 'All' ? 'All Roles' : roleFilter}</span>
              <span style={{ color: textSecondary }}>▾</span>
            </button>
            {isRoleOpen && (
              <div style={dropdownMenuStyle}>
                <div style={{ maxHeight: '14rem', overflowY: 'auto', padding: '0.5rem 0' }}>
                  {roles.map(role => (
                    <StatusOption
                      key={role}
                      label={role === 'All' ? 'All Roles' : role}
                      active={roleFilter === role}
                      onClick={() => { setRoleFilter(role); setIsRoleOpen(false) }}
                      dark={dark}
                      textPrimary={textPrimary}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ position: 'relative', flex: '0 1 160px' }} ref={statusDropdownRef}>
          <button onClick={() => { setIsStatusOpen(p => !p); setIsRoleOpen(false) }} style={dropdownBtnStyle}>
            <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
            <span style={{ color: textSecondary }}>▾</span>
          </button>
          {isStatusOpen && (
            <div style={dropdownMenuStyle}>
              <div style={{ maxHeight: '14rem', overflowY: 'auto', padding: '0.5rem 0' }}>
                {statuses.map(status => (
                  <StatusOption
                    key={status}
                    label={status === 'All' ? 'All Status' : status}
                    active={statusFilter === status}
                    onClick={() => { setStatusFilter(status); setIsStatusOpen(false) }}
                    dark={dark}
                    textPrimary={textPrimary}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Librarian Button */}
        {isAdmin && (
          <ActionButton
            onClick={onAddLibrarian}
            icon={UserPlusIcon}
            label="Add Librarian"
            variant="primary"
            dark={dark}
            border={border}
          />
        )}

      </div>
    </div>
  )
}

export default SearchBar