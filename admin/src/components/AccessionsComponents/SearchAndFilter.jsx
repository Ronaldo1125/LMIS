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
    const onKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(activeTag)
      if (e.key === 'Escape') setIsStatusOpen(false)
      if (e.key === '/' && !isTyping) { e.preventDefault(); searchInputRef.current?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => { if (!dropdownRef.current?.contains(e.target)) setIsStatusOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ── Colors — same tokens as ActivityLogs / SearchAndFilter (Cataloging) ──
  const containerBg   = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const inputBg       = dark ? '#0d1d35' : '#ffffff'
  const inputBorder   = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const dropdownBg    = dark ? '#162a4a' : '#ffffff'

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 2.5rem 0.625rem 2.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg, color: textPrimary,
    fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box',
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

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search accessions"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = dark ? '#93c5fd' : '#154A9A'}
            onBlur={e => e.target.style.borderColor = inputBorder}
          />
          {searchTerm && (
            <XMarkIcon
              onClick={() => setSearchTerm('')}
              style={{ width: '1.125rem', height: '1.125rem', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: textSecondary }}
            />
          )}
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 180px', position: 'relative' }} ref={dropdownRef}>
          <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary, flexShrink: 0 }} />
          <div style={{ position: 'relative', width: '100%' }}>
            <button
              onClick={() => setIsStatusOpen(p => !p)}
              style={{
                width: '100%', padding: '0.625rem 1rem',
                background: inputBg, border: `1px solid ${inputBorder}`,
                borderRadius: '0.5rem', textAlign: 'left', color: textPrimary,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              <span>{selectedStatus === 'all' ? 'All Statuses' : selectedStatus}</span>
              <span style={{ color: textSecondary }}>▾</span>
            </button>

            {isStatusOpen && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, width: '100%',
                background: dropdownBg, border: `1px solid ${border}`,
                borderRadius: '0.5rem', zIndex: 50, overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}>
                <div style={{ maxHeight: '14rem', overflowY: 'auto', padding: '0.5rem 0' }}>
                  {statuses.map(status => (
                    <StatusOption
                      key={status}
                      label={status === 'all' ? 'All Statuses' : status}
                      active={selectedStatus === status}
                      onClick={() => { setSelectedStatus(status); setIsStatusOpen(false) }}
                      dark={dark}
                      textPrimary={textPrimary}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <ActionButton onClick={onArchiveClick} icon={ArchiveBoxIcon} label="Archives" dark={dark} border={border} />
          <ActionButton onClick={onAddClick} icon={PlusIcon} label="Add Accession" variant="primary" dark={dark} border={border} />
        </div>

      </div>
    </div>
  )
}

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
      }}
    >
      <Icon style={{ width: '1.125rem', height: '1.125rem' }} />
      <span>{label}</span>
    </button>
  )
}

export default SearchAndFilter