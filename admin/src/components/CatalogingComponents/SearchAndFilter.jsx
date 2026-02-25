import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  onAddClick,
  onArchiveClick,
  onImportClick,
  dark
}) => {
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState({
    Reports: false,
    Periodicals: false,
    'Reference Materials': false
  })

  // ── Colors ────────────────────────────────────────────────
  const containerBg   = dark ? '#0f1f38' : '#ffffff'
  const borderCol     = dark ? '#1a3356' : '#e2e8f0'
  const inputBg       = dark ? '#0d1d35' : '#ffffff'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const dropdownBg    = dark ? '#162a4a' : '#ffffff'

  const searchPlaceholder = useMemo(() => {
    const placeholders = [
      'Search by title, author, or ISBN...',
      'Try "climate change" or "atlas"...',
      'Press "/" to focus search'
    ]
    return placeholders[new Date().getDate() % placeholders.length]
  }, [])

  const groupedCategories = useMemo(() => {
    const groupMap = {
      Reports: ['Annual Reports', 'Special Reports'],
      Periodicals: ['Magazines', 'Newspapers', 'Journals'],
      'Reference Materials': ['Encyclopedia', 'Atlas']
    }
    const standalone = ['Books', 'Sourcebook', 'Thesis/Research papers', 'Statute/Law/Legal Documents', 'Guides/Manuals']
    const has = (value) => categories.includes(value)
    
    const groups = Object.entries(groupMap)
      .filter(([label]) => has(label))
      .map(([label, children]) => ({ label, options: [label, ...children.filter(has)] }))

    const singles = standalone.filter(has)
    return { groups, singles }
  }, [categories])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsCategoryOpen(false)
      if (e.key === '/' && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    const onClickOutside = (e) => { if (!dropdownRef.current?.contains(e.target)) setIsCategoryOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    return () => { window.removeEventListener('keydown', onKeyDown); document.removeEventListener('mousedown', onClickOutside); }
  }, [])

  return (
    <div style={{
      background: containerBg,
      padding: '1.25rem',
      borderRadius: '0.75rem',
      border: `1px solid ${borderCol}`,
      boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '1.5rem',
      transition: 'all 0.45s ease'
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <MagnifyingGlassIcon style={{ 
            width: '1.25rem', height: '1.25rem', 
            position: 'absolute', left: '0.75rem', top: '50%', 
            transform: 'translateY(-50%)', color: textSecondary 
          }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '0.625rem 2.5rem 0.625rem 2.75rem',
              background: inputBg, border: `1px solid ${borderCol}`,
              borderRadius: '0.5rem', color: textPrimary, outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
          {searchTerm && (
            <XMarkIcon 
              onClick={() => setSearchTerm('')}
              style={{ 
                width: '1.125rem', height: '1.125rem', position: 'absolute', 
                right: '0.75rem', top: '50%', transform: 'translateY(-50%)', 
                cursor: 'pointer', color: textSecondary 
              }} 
            />
          )}
        </div>

        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 250px' }} ref={dropdownRef}>
          <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary }} />
          <div style={{ position: 'relative', width: '100%' }}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              style={{
                width: '100%', padding: '0.625rem 1rem', background: inputBg,
                border: `1px solid ${borderCol}`, borderRadius: '0.5rem',
                textAlign: 'left', color: textPrimary, display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              <span style={{ color: textSecondary }}>▾</span>
            </button>

            {isCategoryOpen && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, width: '100%',
                background: dropdownBg, border: `1px solid ${borderCol}`,
                borderRadius: '0.5rem', zIndex: 50, overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}>
                <div style={{ maxHeight: '16rem', overflowY: 'auto', padding: '0.5rem 0' }}>
                  <FilterOption label="All Categories" onClick={() => { setSelectedCategory('all'); setIsCategoryOpen(false); }} dark={dark} />
                  {groupedCategories.groups.map(group => (
                    <div key={group.label}>
                      <button
                        onClick={() => setOpenGroups(p => ({ ...p, [group.label]: !p[group.label] }))}
                        style={{
                          width: '100%', padding: '0.625rem 1rem', textAlign: 'left',
                          background: 'transparent', border: 'none', color: textPrimary,
                          fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                          display: 'flex', justifyContent: 'space-between', cursor: 'pointer'
                        }}
                      >
                        {group.label} <span>{openGroups[group.label] ? '–' : '+'}</span>
                      </button>
                      {openGroups[group.label] && group.options.map(opt => (
                        <FilterOption key={opt} label={opt === group.label ? `All ${opt}` : opt} inset 
                          onClick={() => { setSelectedCategory(opt); setIsCategoryOpen(false); }} dark={dark} />
                      ))}
                    </div>
                  ))}
                  {groupedCategories.singles.map(opt => (
                    <FilterOption key={opt} label={opt} onClick={() => { setSelectedCategory(opt); setIsCategoryOpen(false); }} dark={dark} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <ActionButton onClick={onArchiveClick} icon={ArchiveBoxIcon} label="Archives" dark={dark} />
          <ActionButton 
            onClick={onImportClick} 
            icon={ArrowUpTrayIcon} 
            label="Import Excel" 
            variant="emerald" 
            dark={dark} 
          />
          <ActionButton 
            onClick={onAddClick} 
            icon={PlusIcon} 
            label="Add New" 
            variant="primary" 
            dark={dark} 
          />
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

const FilterOption = ({ label, onClick, inset, dark }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: '100%', padding: `0.5rem ${inset ? '1.5rem' : '1rem'}`,
        textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer',
        background: hover ? (dark ? '#1a3356' : '#f1f5f9') : 'transparent',
        color: dark ? '#dde8f5' : '#1e293b', border: 'none', transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  )
}

const ActionButton = ({ onClick, icon: Icon, label, variant, dark }) => {
  const [hover, setHover] = useState(false)
  
  const getColors = () => {
    if (variant === 'primary') return { bg: dark ? '#154A9A' : '#1e293b', text: '#fff' }
    if (variant === 'emerald') return { bg: dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', text: dark ? '#34d399' : '#047857', border: dark ? '#059669' : '#10b981' }
    return { bg: dark ? 'rgba(255,255,255,0.05)' : '#fff', text: dark ? '#6b8cae' : '#4b5563', border: dark ? '#1a3356' : '#d1d5db' }
  }
  
  const colors = getColors()

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
        background: hover ? (variant === 'primary' ? '#1a3a6d' : colors.bg) : colors.bg,
        border: variant === 'primary' ? 'none' : `1px solid ${colors.border || 'transparent'}`,
        color: colors.text, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
        transition: 'all 0.2s ease', transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <Icon style={{ width: '1.125rem', height: '1.125rem' }} />
      <span>{label}</span>
    </button>
  )
}

export default SearchAndFilter