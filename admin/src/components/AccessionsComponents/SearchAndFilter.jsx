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
  onArchiveClick,
  dark
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

  // ── Colors ────────────────────────────────────────────────
  const containerBg     = dark ? '#0f1f38' : '#ffffff'
  const containerBorder = dark ? '#1a3356' : '#e5e7eb'
  const inputBg         = dark ? '#081422' : '#ffffff'
  const inputBorder     = dark ? '#1a3356' : '#d1d5db'
  const inputText       = dark ? '#dde8f5' : '#111827'
  const iconColor       = dark ? '#6b8cae' : '#9ca3af'
  const funnelColor     = dark ? '#6b8cae' : '#4b5563'
  const dropdownBg      = dark ? '#0f1f38' : '#ffffff'
  const dropdownBorder  = dark ? '#1a3356' : '#e5e7eb'
  const dropdownText    = dark ? '#dde8f5' : '#374151'
  const dropdownHover   = dark ? '#0d1d35' : '#f9fafb'
  const archiveBg       = dark ? '#0f1f38' : '#ffffff'
  const archiveBorder   = dark ? '#1a3356' : '#d1d5db'
  const archiveText     = dark ? '#6b8cae' : '#374151'
  const archiveHover    = dark ? '#1a3356' : '#f9fafb'
  const addBg           = dark ? '#1a3356' : '#e5e7eb'
  const addText         = dark ? '#dde8f5' : '#1f2937'
  const addHover        = dark ? '#2e4d70' : '#d1d5db'

  const inputStyle = {
    width: '100%',
    paddingLeft: '2.5rem', paddingRight: searchTerm ? '2.5rem' : '1rem',
    paddingTop: '0.5rem', paddingBottom: '0.5rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg, color: inputText,
    fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: containerBg,
      border: `1px solid ${containerBorder}`,
      borderRadius: '0.75rem',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'background 0.45s ease, border-color 0.45s ease',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '28rem' }}>
          <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem', color: iconColor, position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search accessions"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = inputBorder}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              title="Clear search"
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: iconColor, transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = inputText}
              onMouseLeave={e => e.currentTarget.style.color = iconColor}
            >
              <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} ref={dropdownRef}>
          <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: funnelColor, flexShrink: 0 }} />

          <div style={{ position: 'relative', width: '16rem' }}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(prev => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isStatusOpen}
              style={{
                width: '100%', padding: '0.5rem 1rem',
                border: `1px solid ${inputBorder}`,
                borderRadius: '0.5rem',
                background: inputBg, color: inputText,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', fontSize: '0.875rem', outline: 'none',
                transition: 'background 0.45s ease, border-color 0.45s ease',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedStatus === 'all' ? 'All Statuses' : selectedStatus}
              </span>
              <span style={{ color: iconColor, fontSize: '0.75rem' }}>▾</span>
            </button>

            {isStatusOpen && (
              <div style={{
                position: 'absolute', zIndex: 20, marginTop: '0.25rem',
                width: '100%',
                background: dropdownBg,
                border: `1px solid ${dropdownBorder}`,
                borderRadius: '0.5rem',
                boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'background 0.45s ease',
              }}>
                <div style={{ maxHeight: '16rem', overflowY: 'auto', padding: '0.25rem 0', fontSize: '0.875rem' }}>
                  {statuses.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status)
                        setIsStatusOpen(false)
                      }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.5rem 1rem',
                        background: 'transparent', color: dropdownText,
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        outline: 'none',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = dropdownHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onArchiveClick}
            title="View archived accessions"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              background: archiveBg, color: archiveText,
              border: `1px solid ${archiveBorder}`,
              borderRadius: '0.5rem', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500,
              transition: 'background 0.2s ease, box-shadow 0.2s ease',
              boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = archiveHover}
            onMouseLeave={e => e.currentTarget.style.background = archiveBg}
          >
            <ArchiveBoxIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Archives
          </button>

          <button
            onClick={onAddClick}
            title="Add new accession"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              background: addBg, color: addText,
              border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = addHover}
            onMouseLeave={e => e.currentTarget.style.background = addBg}
          >
            <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Add Accession
          </button>
        </div>

      </div>
    </div>
  )
}

export default SearchAndFilter