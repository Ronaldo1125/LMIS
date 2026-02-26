import { useState, useMemo } from 'react'
import { XMarkIcon, ArrowUturnLeftIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const ArchivesModal = ({ isOpen, onClose, archivedAccessions, onRestore, dark }) => {
  // ── Hooks must be BEFORE any early return ─────────────────
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAccessions = useMemo(() => {
    if (!archivedAccessions) return []
    if (!searchQuery) return archivedAccessions
    const q = searchQuery.toLowerCase()
    return archivedAccessions.filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.accession_no?.toLowerCase().includes(q) ||
      item.author?.toLowerCase().includes(q)
    )
  }, [searchQuery, archivedAccessions])

  // ── Early return AFTER hooks ───────────────────────────────
  if (!isOpen) return null

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

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
      }}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
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
            {archivedAccessions?.length > 0 && (
              <p style={{ fontSize: '0.8125rem', color: textMuted, margin: '0.125rem 0 0' }}>
                {archivedAccessions.length} archived record{archivedAccessions.length !== 1 ? 's' : ''}
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

        {/* Search Bar */}
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
            placeholder="Filter by Title, Accession No, or Author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '0.875rem', fontWeight: 500,
              color: inputText,
            }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {filteredAccessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <ArchiveBoxIcon style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 0.75rem', color: emptyIcon }} />
              <p style={{ color: textSecondary, margin: 0 }}>
                {searchQuery ? 'No records match your search.' : 'No archived accessions.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredAccessions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${border}`,
                    borderRadius: '0.625rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
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
                        {item.accession_no || '-'}
                      </span>
                      {item.archived_at && (
                        <span style={{ fontSize: '0.75rem', color: textMuted }}>
                          Archived {formatDate(item.archived_at)}
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: 600, color: textPrimary, margin: '0.25rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title || '-'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0.25rem 0 0' }}>
                      {item.author && <span>{item.author}</span>}
                      {item.author && item.publisher && <span style={{ margin: '0 0.25rem' }}>·</span>}
                      {item.publisher && <span>{item.publisher}</span>}
                    </p>
                    {item.archive_reason && (
                      <p style={{ fontSize: '0.75rem', color: reasonText, margin: '0.25rem 0 0' }}>
                        Reason: {item.archive_reason}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onRestore(item.id)}
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