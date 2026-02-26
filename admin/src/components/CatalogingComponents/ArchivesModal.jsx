import React, { useState, useEffect, useMemo } from 'react'
import api from '../../utils/api'
import { 
  XMarkIcon, 
  ArrowUturnLeftIcon, 
  EyeIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  InboxStackIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  InformationCircleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'

const ArchivesModal = ({ isOpen, onClose, onRestore, dark = true }) => {
  const [archivedBooks, setArchivedBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // ── Colors ────────────────────────────────────────────────
  const modalBg       = dark ? '#0f1f38' : '#ffffff'
  const headerBg      = dark ? '#0d1d35' : '#ffffff'
  const headerBorder  = dark ? '#1a3356' : '#e2e8f0'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#6b7280'
  const textMuted     = dark ? '#2e4d70' : '#9ca3af'
  const rowHoverBg    = dark ? '#0d1d35' : '#f8fafc'
  const badgeBg       = dark ? 'rgba(253,186,116,0.15)' : 'var(--secondary-3-light)'
  const badgeText     = dark ? '#fdba74' : 'var(--dark-blue-1)'
  const reasonText    = dark ? '#fbbf24' : '#d97706'
  const restoreBg     = dark ? '#1a3356' : '#f1f5f9'
  const restoreText   = dark ? '#93c5fd' : '#374151'
  const restoreHover  = dark ? '#2e4d70' : '#e2e8f0'
  const emptyIcon     = dark ? '#1a3356' : '#e5e7eb'
  const closeHover    = dark ? '#1a3356' : '#f1f5f9'
  const searchBg      = dark ? '#0c1a2e' : '#f8fafc'
  const inputText     = dark ? '#dde8f5' : '#111827'
  const inputPlaceholder = dark ? '#2e4d70' : '#9ca3af'

  useEffect(() => {
    if (isOpen) {
      fetchArchivedBooks()
    } else {
      setSearchQuery('')
      setShowDetails(false)
      setSelectedBook(null)
    }
  }, [isOpen])

  const fetchArchivedBooks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/books', {
        params: { showArchived: 'true', limit: 200 }
      })
      setArchivedBooks(response.data.books || [])
    } catch (err) {
      setError('Failed to load archived books.')
    } finally {
      setLoading(false)
    }
  }

  const filteredArchives = useMemo(() => {
    if (!searchQuery) return archivedBooks
    const q = searchQuery.toLowerCase()
    return archivedBooks.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.isbn?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    )
  }, [searchQuery, archivedBooks])

  const handleRestoreAction = async (id, e) => {
    if (e) e.stopPropagation()
    try {
      await onRestore(id)
      fetchArchivedBooks()
      if (showDetails) setShowDetails(false)
    } catch (err) {
      setError('Reintegration sequence failed.')
    }
  }

  const renderValue = (val) => (val && val !== '' ? val : <span style={{ opacity: 0.3, fontStyle: 'italic' }}>Not Recorded</span>)

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  if (!isOpen) return null

  // ── DETAIL VIEW ───────────────────────────────────────────
  const DetailView = () => (
    <div>
      {/* Decommission Log */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.625rem',
        border: `1.5px dashed ${reasonText}`,
        background: dark ? 'rgba(251,191,36,0.05)' : '#fffbeb',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldCheckIcon style={{ width: '1.25rem', height: '1.25rem', color: reasonText }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: reasonText, margin: 0 }}>
            Decommission Protocol Log
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: textMuted, marginBottom: '0.25rem' }}>Archived Date</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: 0, fontFamily: 'monospace' }}>
              {new Date(selectedBook.archived_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: textMuted, marginBottom: '0.25rem' }}>Authorized Officer</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {selectedBook.archived_by || 'System Admin'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: textMuted, marginBottom: '0.25rem' }}>Integrity Status</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#22c55e', margin: 0 }}>ReadOnly / Dormant</p>
          </div>
          <div style={{ gridColumn: '1 / -1', paddingTop: '0.75rem', borderTop: `1px solid ${border}` }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: textMuted, marginBottom: '0.25rem' }}>Statement of Reason</p>
            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: textPrimary, margin: 0, lineHeight: 1.6 }}>
              "{selectedBook.archive_reason || 'No specific justification log provided by the operator.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Book Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem', marginBottom: '1.5rem' }}>
        {[
          { icon: <BookOpenIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Title / Monograph', value: selectedBook.title },
          { icon: <UserIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Principal Author', value: selectedBook.author },
          { icon: <InformationCircleIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Classification', value: selectedBook.category },
          { icon: <ArrowsRightLeftIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Call Number', value: selectedBook.call_number },
          { icon: <InboxStackIcon style={{ width: '1rem', height: '1rem' }} />, label: 'ISBN Identifier', value: selectedBook.isbn },
          { icon: <ClockIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Edition / Date', value: `${selectedBook.edition || ''} ${selectedBook.date_of_publication || ''}` },
        ].map((field, idx) => (
          <div key={idx} style={{ borderBottom: `1px solid ${border}`, paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '0.375rem' }}>
              {field.icon} {field.label}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {renderValue(field.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
        <button
          onClick={() => setShowDetails(false)}
          style={{
            padding: '0.5rem 1.25rem',
            background: restoreBg, color: restoreText,
            border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
            fontSize: '0.8125rem', fontWeight: 600,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = restoreHover}
          onMouseLeave={e => e.currentTarget.style.background = restoreBg}
        >
          ← Back
        </button>
        <button
          onClick={() => handleRestoreAction(selectedBook.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: '#2563eb', color: '#ffffff',
            border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
            fontSize: '0.8125rem', fontWeight: 600,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
        >
          <ArrowUturnLeftIcon style={{ width: '1rem', height: '1rem' }} />
          Restore
        </button>
      </div>
    </div>
  )

  // ── MAIN RENDER ───────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', zIndex: 50,
    }}>
      <div style={{
        background: modalBg,
        borderRadius: '1rem',
        boxShadow: dark
          ? '0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.03) inset'
          : '0 24px 64px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: '48rem',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        border: dark ? `1px solid ${headerBorder}` : 'none',
        transition: 'background 0.45s ease',
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '1rem 1rem 0 0',
          flexShrink: 0,
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>
              Archives
            </h2>
            {archivedBooks.length > 0 && (
              <p style={{ fontSize: '0.8125rem', color: textMuted, margin: '0.125rem 0 0' }}>
                {showDetails ? `Record: ${selectedBook?.id}` : `${archivedBooks.length} archived record${archivedBooks.length !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ padding: '0.5rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = closeHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: textSecondary }} />
          </button>
        </div>

        {/* Search Bar (List View only) */}
        {!showDetails && (
          <div style={{
            background: searchBg,
            borderBottom: `1px solid ${headerBorder}`,
            padding: '0.75rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            flexShrink: 0,
            transition: 'background 0.45s ease',
          }}>
            <MagnifyingGlassIcon style={{ width: '1.125rem', height: '1.125rem', color: textMuted, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Filter by Title, ISBN, or Author..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '0.875rem', fontWeight: 500,
                color: inputText,
              }}
            />
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              marginBottom: '1rem', padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '0.5rem',
            }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ef4444', margin: 0 }}>{error}</p>
            </div>
          )}

          {showDetails ? (
            <DetailView />
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                border: `3px solid ${border}`, borderTopColor: '#3b82f6',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
              }} />
              <p style={{ color: textMuted, fontSize: '0.8125rem', margin: 0 }}>Loading archives...</p>
            </div>
          ) : filteredArchives.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <ArchiveBoxIcon style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 0.75rem', color: emptyIcon }} />
              <p style={{ color: textSecondary, margin: 0 }}>
                {searchQuery ? 'No records match your search.' : 'No archived books.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredArchives.map((book) => (
                <div
                  key={book.id}
                  onClick={() => { setSelectedBook(book); setShowDetails(true) }}
                  style={{
                    border: `1px solid ${border}`,
                    borderRadius: '0.625rem',
                    padding: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', cursor: 'pointer',
                    transition: 'background 0.15s ease, border-color 0.45s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: '0.25rem',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: badgeBg, color: badgeText,
                      }}>
                        {book.category || 'GENERAL'}
                      </span>
                      {book.archived_at && (
                        <span style={{ fontSize: '0.75rem', color: textMuted }}>
                          Archived {formatDate(book.archived_at)}
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: 600, color: textPrimary, margin: '0.25rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {book.title || '-'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0.25rem 0 0' }}>
                      {book.author && <span>{book.author}</span>}
                      {book.author && book.isbn && <span style={{ margin: '0 0.25rem' }}>·</span>}
                      {book.isbn && <span style={{ fontFamily: 'monospace' }}>ISBN: {book.isbn}</span>}
                    </p>
                    {book.archive_reason && (
                      <p style={{ fontSize: '0.75rem', color: reasonText, margin: '0.25rem 0 0' }}>
                        Reason: {book.archive_reason}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleRestoreAction(book.id, e)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: restoreBg, color: restoreText,
                      border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 500, flexShrink: 0,
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = restoreHover}
                    onMouseLeave={e => e.currentTarget.style.background = restoreBg}
                  >
                    <ArrowUturnLeftIcon style={{ width: '1rem', height: '1rem' }} />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArchivesModal