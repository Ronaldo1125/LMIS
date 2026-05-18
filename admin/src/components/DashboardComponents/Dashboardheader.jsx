import { MagnifyingGlassIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { HomeIcon, BookOpenIcon, DocumentPlusIcon, UsersIcon, ShieldCheckIcon,
  ClipboardDocumentCheckIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { MessageSquare, FileText } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import AccountMenu from './AccountMenu'

// Expanded search index: pages + actions grouped by section
const ALL_SEARCH_ITEMS = [
  // ── Dashboard ──────────────────────────────────────────────────────────
  {
    id: 'dashboard', label: 'Dashboard', description: 'Go to dashboard overview',
    section: 'Dashboard', icon: HomeIcon, type: 'page',
  },

  // ── Cataloging ─────────────────────────────────────────────────────────
  {
    id: 'cataloging', label: 'Cataloging', description: 'Go to cataloging',
    section: 'Cataloging', icon: BookOpenIcon, type: 'page',
  },
  {
    id: 'cataloging', label: 'Add New Book', description: 'Create a new catalog entry',
    section: 'Cataloging', icon: BookOpenIcon, type: 'action',
  },
  {
    id: 'cataloging', label: 'Import Books from Excel', description: 'Bulk import via spreadsheet',
    section: 'Cataloging', icon: BookOpenIcon, type: 'action',
  },

  // ── Accessions ─────────────────────────────────────────────────────────
  {
    id: 'accessions', label: 'Accessions', description: 'Go to accessions',
    section: 'Accessions', icon: DocumentPlusIcon, type: 'page',
  },
  {
    id: 'accessions', label: 'Add Accession', description: 'Register a new accession record',
    section: 'Accessions', icon: DocumentPlusIcon, type: 'action',
  },
  {
    id: 'accessions', label: 'Edit Accession', description: 'Modify an existing accession',
    section: 'Accessions', icon: DocumentPlusIcon, type: 'action',
  },
  {
    id: 'accessions', label: 'Archive or Delete Accession', description: 'Remove or archive a record',
    section: 'Accessions', icon: DocumentPlusIcon, type: 'action',
  },
  {
    id: 'accessions', label: 'Accession Details', description: 'View full accession information',
    section: 'Accessions', icon: DocumentPlusIcon, type: 'action',
  },

  // ── Acquisitions ───────────────────────────────────────────────────────
  {
    id: 'acquisitions', label: 'Acquisitions', description: 'Go to acquisitions',
    section: 'Acquisitions', icon: ClipboardDocumentCheckIcon, type: 'page',
  },
  {
    id: 'acquisitions', label: 'Acquisition Details', description: 'View full acquisition record',
    section: 'Acquisitions', icon: ClipboardDocumentCheckIcon, type: 'action',
  },
  {
    id: 'acquisitions', label: 'Search Acquisitions', description: 'Find and filter acquisitions',
    section: 'Acquisitions', icon: ClipboardDocumentCheckIcon, type: 'action',
  },

  // ── News & Announcements ───────────────────────────────────────────────
  {
    id: 'news', label: 'Announcements', description: 'Go to announcements',
    section: 'News & Announcements', icon: NewspaperIcon, type: 'page',
  },
  {
    id: 'news', label: 'Publish Article', description: 'Write and publish a news article',
    section: 'News & Announcements', icon: NewspaperIcon, type: 'action',
  },
  {
    id: 'news', label: 'Send Announcements', description: 'Broadcast a message to users',
    section: 'News & Announcements', icon: NewspaperIcon, type: 'action',
  },

  // ── Feedbacks ──────────────────────────────────────────────────────────
  {
    id: 'feedbacks', label: 'Feedbacks', description: 'Go to feedback management',
    section: 'Feedbacks', icon: MessageSquare, type: 'page',
  },
  {
    id: 'feedbacks', label: 'Monitor Feedbacks', description: 'Review and respond to feedback',
    section: 'Feedbacks', icon: MessageSquare, type: 'action',
  },

  // ── User Management ────────────────────────────────────────────────────
  {
    id: 'user-management', label: 'User Management', description: 'Go to user management',
    section: 'User Management', icon: UsersIcon, type: 'page',
  },
  {
    id: 'user-management', label: 'Add Librarian', description: 'Register a new librarian account',
    section: 'User Management', icon: UsersIcon, type: 'action',
  },
  {
    id: 'user-management', label: 'Make Staff', description: 'Assign staff role to a user',
    section: 'User Management', icon: UsersIcon, type: 'action',
  },
  {
    id: 'user-management', label: 'Set as Active Librarian', description: 'Activate a librarian account',
    section: 'User Management', icon: UsersIcon, type: 'action',
  },
  {
    id: 'user-management', label: 'Deactivate Account', description: 'Suspend a user account',
    section: 'User Management', icon: UsersIcon, type: 'action',
  },

  // ── Privacy & Terms ────────────────────────────────────────────────────
  {
    id: 'privacy-terms', label: 'Privacy & Terms', description: 'Go to privacy & terms editor',
    section: 'Privacy & Terms', icon: FileText, type: 'page',
  },
  {
    id: 'privacy-terms', label: 'Manage Privacy Policy', description: 'Edit your privacy policy content',
    section: 'Privacy & Terms', icon: FileText, type: 'action',
  },
  {
    id: 'privacy-terms', label: 'Manage Terms and Conditions', description: 'Edit your terms of service content',
    section: 'Privacy & Terms', icon: FileText, type: 'action',
  },

  // ── Security ───────────────────────────────────────────────────────────
  {
    id: 'security', label: 'Security', description: 'Go to security settings',
    section: 'Security', icon: ShieldCheckIcon, type: 'page',
  },
  {
    id: 'security', label: 'Export Logs as CSV', description: 'Download system logs as a CSV file',
    section: 'Security', icon: ShieldCheckIcon, type: 'action',
  },
  {
    id: 'security', label: 'Purge Logs', description: 'Permanently clear all system logs',
    section: 'Security', icon: ShieldCheckIcon, type: 'action',
  },
]

const DashboardHeader = ({ user, setCurrentView, dark }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isSticky, setIsSticky] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // Filter and group results
  const filtered = searchQuery.trim().length === 0
    ? []
    : ALL_SEARCH_ITEMS.filter(v =>
        v.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

  // Group filtered results by section, flat list with index for keyboard nav
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const handleScroll = () => {
      const scrollContainer = document.querySelector('main')
      if (scrollContainer) setIsSticky(scrollContainer.scrollTop > 20)
    }
    const scrollContainer = document.querySelector('main')
    if (scrollContainer) scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearInterval(timer)
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    setShowDropdown(true)
    setActiveIndex(-1)
  }

  const handleSelect = (item) => {
    setCurrentView(item.id)
    setSearchQuery('')
    setShowDropdown(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIndex(-1)
    }
  }

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const handleMyProfile = () => { setShowAccountMenu(false); setCurrentView('profile') }
  const handleHelpSupport = () => { setShowAccountMenu(false); setCurrentView('help') }

  // ── Colors ──────────────────────────────────────────────────────────────
  const headerBg          = dark ? '#0d1d35' : '#ffffff'
  const headerBorder      = dark ? '#1a3356' : '#e2e8f0'
  const titleColor        = dark ? '#dde8f5' : 'var(--dark-blue-1)'
  const subtitleColor     = dark ? '#6b8cae' : '#4b5563'
  const clockBg           = dark ? '#081422' : '#f8fafc'
  const clockBorder       = dark ? '#1a3356' : '#e2e8f0'
  const clockText         = dark ? '#6b8cae' : '#374151'
  const clockTime         = dark ? '#93c5fd' : 'var(--secondary-4-grey)'
  const clockDivider      = dark ? '#1a3356' : '#d1d5db'
  const inputBg           = dark ? '#081422' : '#ffffff'
  const inputBorder       = dark ? '#1a3356' : '#d1d5db'
  const inputText         = dark ? '#dde8f5' : '#1f2937'
  const inputPlaceholder  = dark ? '#2e4d70' : '#9ca3af'
  const iconBtnBg         = dark ? '#0f1f38' : '#f8fafc'
  const iconBtnBorder     = dark ? '#1a3356' : '#e2e8f0'
  const iconColor         = dark ? '#93c5fd' : 'var(--dark-blue-2)'
  const dropdownBg        = dark ? '#0c1c34' : '#ffffff'
  const dropdownBorder    = dark ? '#1a3356' : '#e2e8f0'
  const dropdownShadow    = dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)'
  const dropdownActiveBg  = dark ? '#1e3f6e' : '#e0eaff'
  const dropdownText      = dark ? '#dde8f5' : '#1f2937'
  const dropdownSubText   = dark ? '#6b8cae' : '#94a3b8'
  const emptyText         = dark ? '#2e4d70' : '#94a3b8'

  const iconBtnStyle = {
    padding: '0.5rem', borderRadius: '0.5rem',
    background: iconBtnBg, border: `1px solid ${iconBtnBorder}`,
    cursor: 'pointer', position: 'relative',
    transition: 'background 0.2s ease, border-color 0.2s ease', outline: 'none',
  }

  return (
    <div style={{
      background: headerBg,
      border: `1px solid ${isSticky ? headerBorder : 'transparent'}`,
      borderRadius: isSticky ? '0' : '0.5rem',
      boxShadow: isSticky
        ? (dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)')
        : (dark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'),
      padding: '1rem', marginBottom: '1.5rem',
      position: 'sticky', top: 0, zIndex: 50,
      transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.3s ease, border-radius 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <img
            src="/LOGO.svg" alt="LMIS Logo"
            style={{
              width: isSticky ? '2.5rem' : '3rem', height: isSticky ? '2.5rem' : '3rem',
              transition: 'all 0.3s ease',
              filter: dark ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <div>
            <h1 style={{ fontWeight: 700, color: titleColor, fontSize: isSticky ? '1.25rem' : '1.5rem', margin: 0, transition: 'all 0.3s ease' }}>
              LMIS - DRO5
            </h1>
            <p style={{
              fontSize: '0.75rem', color: subtitleColor, margin: 0,
              maxHeight: isSticky ? 0 : '2.5rem', opacity: isSticky ? 0 : 1,
              overflow: 'hidden', transition: 'all 0.3s ease',
            }}>
              Library Management Information System
            </p>
          </div>
        </div>

        {/* Center — Clock */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: '0.5rem',
          background: clockBg, border: `1px solid ${clockBorder}`,
          opacity: isSticky ? 1 : 0,
          transform: isSticky ? 'translateY(0) scale(1)' : 'translateY(-1rem) scale(0.95)',
          pointerEvents: isSticky ? 'auto' : 'none',
          position: isSticky ? 'relative' : 'absolute',
          transition: 'all 0.3s ease',
        }}>
          <CalendarIcon style={{ width: '1rem', height: '1rem', color: clockTime }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 500, color: clockText }}>{formatDate(currentTime)}</span>
            <span style={{ width: '1px', height: '1rem', background: clockDivider }} />
            <span style={{ fontWeight: 600, color: clockTime, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right — Search + Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Search with Dropdown */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true) }}
              style={{
                paddingLeft: '2.25rem', paddingRight: searchQuery ? '2rem' : '0.75rem',
                paddingTop: '0.5rem', paddingBottom: '0.5rem',
                fontSize: '0.875rem', borderRadius: '0.5rem',
                border: `1px solid ${showDropdown && filtered.length > 0 ? 'var(--dark-blue-2)' : inputBorder}`,
                background: inputBg, color: inputText,
                width: isSticky ? '12rem' : '16rem',
                outline: 'none',
                boxShadow: showDropdown && filtered.length > 0 ? '0 0 0 2px rgba(15,97,247,0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <MagnifyingGlassIcon style={{
              width: '1rem', height: '1rem', position: 'absolute',
              left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              color: showDropdown && filtered.length > 0 ? 'var(--dark-blue-2)' : inputPlaceholder,
              transition: 'color 0.2s ease',
            }} />

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowDropdown(false); inputRef.current?.focus() }}
                style={{
                  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.125rem',
                  color: inputPlaceholder, fontSize: '1rem', lineHeight: 1,
                  display: 'flex', alignItems: 'center',
                }}
              >
                ×
              </button>
            )}

            {/* Dropdown */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 0.5rem)',
                left: 'auto', right: 0,
                width: '22rem',
                background: dropdownBg,
                border: `1px solid ${dropdownBorder}`,
                borderRadius: '0.75rem',
                boxShadow: dropdownShadow,
                overflow: 'hidden',
                zIndex: 200,
                animation: 'dropIn 0.15s ease',
                maxHeight: '28rem',
                overflowY: 'auto',
              }}>
                <style>{`
                  @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                  }
                  .search-scroll::-webkit-scrollbar { width: 4px; }
                  .search-scroll::-webkit-scrollbar-track { background: transparent; }
                  .search-scroll::-webkit-scrollbar-thumb { background: ${dark ? '#1a3356' : '#e2e8f0'}; border-radius: 4px; }
                `}</style>

                {filtered.length === 0 ? (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: emptyText, fontSize: '0.8rem' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔍</div>
                    No results for "<strong>{searchQuery}</strong>"
                  </div>
                ) : (
                  <div className="search-scroll">
                    {/* Result count hint */}
                    <div style={{
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.625rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: dropdownSubText,
                      borderBottom: `1px solid ${dropdownBorder}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span>Results</span>
                      <span style={{
                        background: dark ? '#1a3356' : '#e0eaff',
                        color: dark ? '#93c5fd' : 'var(--dark-blue-2)',
                        borderRadius: '99px', padding: '0.1rem 0.5rem',
                        fontSize: '0.6rem', fontWeight: 700,
                      }}>{filtered.length}</span>
                    </div>

                    {Object.entries(grouped).map(([section, items]) => {
                      const SectionIcon = items[0].icon
                      return (
                        <div key={section}>
                          {/* Section header */}
                          <div style={{
                            padding: '0.5rem 0.875rem 0.25rem',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontSize: '0.625rem', fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: dropdownSubText,
                          }}>
                            <SectionIcon style={{ width: '0.7rem', height: '0.7rem' }} />
                            {section}
                          </div>

                          {/* Items in section */}
                          {items.map((item) => {
                            const flatIdx = filtered.indexOf(item)
                            const isAct = flatIdx === activeIndex
                            const Icon = item.icon
                            const isAction = item.type === 'action'
                            return (
                              <button
                                key={`${item.id}-${item.label}`}
                                onMouseEnter={() => setActiveIndex(flatIdx)}
                                onMouseLeave={() => setActiveIndex(-1)}
                                onClick={() => handleSelect(item)}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center',
                                  gap: '0.625rem', padding: '0.5rem 0.875rem',
                                  background: isAct ? dropdownActiveBg : 'transparent',
                                  border: 'none', cursor: 'pointer', textAlign: 'left',
                                  transition: 'background 0.12s ease',
                                }}
                              >
                                {/* Icon */}
                                <div style={{
                                  width: '1.875rem', height: '1.875rem', borderRadius: '0.4rem',
                                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: isAct
                                    ? (dark ? 'rgba(15,97,247,0.25)' : 'rgba(15,97,247,0.12)')
                                    : (isAction
                                        ? (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
                                        : (dark ? 'rgba(15,97,247,0.12)' : 'rgba(15,97,247,0.07)')),
                                  transition: 'background 0.12s ease',
                                }}>
                                  <Icon style={{
                                    width: '0.9rem', height: '0.9rem',
                                    color: isAct ? 'var(--dark-blue-2)' : (isAction ? dropdownSubText : (dark ? '#93c5fd' : 'var(--dark-blue-2)')),
                                    transition: 'color 0.12s ease',
                                  }} />
                                </div>

                                {/* Text */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: '0.8125rem', fontWeight: 500,
                                    color: dropdownText, whiteSpace: 'nowrap',
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                  }}>
                                    {item.label}
                                  </div>
                                  <div style={{
                                    fontSize: '0.6875rem', color: dropdownSubText,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                  }}>
                                    {item.description}
                                  </div>
                                </div>

                                {/* Right side: type badge + enter hint */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                                  <span style={{
                                    fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.06em',
                                    textTransform: 'uppercase', padding: '0.1rem 0.375rem',
                                    borderRadius: '99px',
                                    background: isAction
                                      ? (dark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)')
                                      : (dark ? 'rgba(15,97,247,0.2)' : 'rgba(15,97,247,0.1)'),
                                    color: isAction
                                      ? (dark ? '#a78bfa' : '#7c3aed')
                                      : (dark ? '#93c5fd' : 'var(--dark-blue-2)'),
                                  }}>
                                    {isAction ? 'Action' : 'Page'}
                                  </span>
                                  {isAct && (
                                    <span style={{ fontSize: '0.65rem', color: dropdownSubText }}>↵</span>
                                  )}
                                </div>
                              </button>
                            )
                          })}

                          {/* Section divider */}
                          <div style={{ height: '1px', background: dropdownBorder, margin: '0.25rem 0' }} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountMenu(prev => !prev)}
              style={iconBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--dark-blue-1)'; e.currentTarget.style.borderColor = 'var(--dark-blue-1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = iconBtnBg; e.currentTarget.style.borderColor = iconBtnBorder }}
            >
              <UserCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
            </button>
            <AccountMenu
              isOpen={showAccountMenu}
              onClose={() => setShowAccountMenu(false)}
              user={user}
              isSticky={isSticky}
              onMyProfile={handleMyProfile}
              onHelpSupport={handleHelpSupport}
              dark={dark}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardHeader