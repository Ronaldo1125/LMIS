import { useState } from 'react'
import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  TrashIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const AccessionsTable = ({
  accessions,
  onArchive,
  onDelete,
  onEdit,
  onView,
  dark,
  // Pagination props
  pagination,
  onPageChange,
}) => {
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  // ── Colors ────────────────────────────────────────────────
  const tableBg     = dark ? '#0f1f38' : '#ffffff'
  const border      = dark ? '#1a3356' : '#d1d5db'
  const theadBg     = dark ? '#0d1d35' : 'var(--dark-blue-1)'
  const theadText   = '#ffffff'
  const theadBorder = dark ? '#1a3356' : '#d1d5db'
  const rowHoverBg  = dark ? '#0d1d35' : '#f1f5f9'
  const cellBg      = dark ? '#0f1f38' : '#ffffff'
  const cellText    = dark ? '#dde8f5' : '#374151'
  const divider     = dark ? '#1a3356' : '#e5e7eb'
  const badgeBg     = dark ? 'rgba(253,186,116,0.15)' : 'var(--secondary-3-light)'
  const badgeText   = dark ? '#fdba74' : 'var(--dark-blue-1)'
  const titleColor  = dark ? '#93c5fd' : 'var(--dark-blue-1)'
  const hintText    = dark ? '#2e4d70' : '#9ca3af'
  const emptyIcon   = dark ? '#2e4d70' : '#d1d5db'
  const emptyText   = dark ? '#6b8cae' : '#6b7280'
  const emptyMuted  = dark ? '#2e4d70' : '#9ca3af'
  const pagerBg     = dark ? '#0d1d35' : '#f8fafc'
  const pagerBorder = dark ? '#1a3356' : '#e2e8f0'
  const pagerText   = dark ? '#6b8cae' : '#64748b'

  const columns = [
    { label: 'Accession No.',    sticky: true  },
    { label: 'Title',            minWidth: '220px' },
    { label: 'Author',           minWidth: '160px' },
    { label: 'Publisher'                           },
    { label: 'Date Accessioned'                    },
    { label: 'ISBN'                                },
    { label: 'Access Level'                        },
    { label: 'Actions'                             },
  ]

  return (
    <div style={{
      background: tableBg,
      border: `1px solid ${border}`,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.08)',
      transition: 'background 0.45s ease, border-color 0.45s ease',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theadBg, borderBottom: `1px solid ${theadBorder}` }}>
              {columns.map(({ label, sticky, minWidth }) => (
                <th
                  key={label}
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem', fontWeight: 600,
                    color: theadText,
                    borderRight: `1px solid ${theadBorder}`,
                    minWidth: minWidth || undefined,
                    position: sticky ? 'sticky' : undefined,
                    left: sticky ? 0 : undefined,
                    zIndex: sticky ? 20 : undefined,
                    background: sticky ? theadBg : undefined,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accessions.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${divider}`,
                  cursor: 'pointer',
                  animationDelay: `${index * 50}ms`,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = rowHoverBg
                  const stickyCell = e.currentTarget.querySelector('[data-sticky]')
                  if (stickyCell) stickyCell.style.background = rowHoverBg
                  const hint = e.currentTarget.querySelector('[data-hint]')
                  if (hint) hint.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  const stickyCell = e.currentTarget.querySelector('[data-sticky]')
                  if (stickyCell) stickyCell.style.background = cellBg
                  const hint = e.currentTarget.querySelector('[data-hint]')
                  if (hint) hint.style.opacity = '0'
                }}
                onClick={() => onView && onView(item)}
              >
                {/* Accession No. — sticky */}
                <td
                  data-sticky
                  style={{
                    padding: '1rem 1.5rem',
                    position: 'sticky', left: 0, zIndex: 10,
                    background: cellBg,
                    borderRight: `1px solid ${divider}`,
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span style={{
                    padding: '0.2rem 0.625rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: badgeBg,
                    color: badgeText,
                  }}>
                    {renderValue(item.accession_no)}
                  </span>
                </td>

                {/* Title */}
                <td style={{ padding: '1rem 1.5rem', borderRight: `1px solid ${divider}`, maxWidth: '220px' }}>
                  <div
                    style={{ fontWeight: 500, color: titleColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={item.title}
                  >
                    {renderValue(item.title)}
                  </div>
                  <div
                    data-hint
                    style={{ fontSize: '0.75rem', color: hintText, marginTop: '0.25rem', opacity: 0, transition: 'opacity 0.2s ease' }}
                  >
                    Click to view details
                  </div>
                </td>

                {/* Author */}
                <td
                  style={{ padding: '1rem 1.5rem', color: cellText, borderRight: `1px solid ${divider}`, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}
                  title={item.author}
                >
                  {renderValue(item.author)}
                </td>

                {/* Publisher */}
                <td
                  style={{ padding: '1rem 1.5rem', color: cellText, borderRight: `1px solid ${divider}`, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}
                  title={item.publisher}
                >
                  {renderValue(item.publisher)}
                </td>

                {/* Date Accessioned */}
                <td style={{ padding: '1rem 1.5rem', color: cellText, borderRight: `1px solid ${divider}`, whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {formatDate(item.date_accessioned)}
                </td>

                {/* ISBN */}
                <td style={{ padding: '1rem 1.5rem', color: cellText, borderRight: `1px solid ${divider}`, fontSize: '0.875rem' }}>
                  {renderValue(item.isbn)}
                </td>

                {/* Access Level — NEW */}
                <td style={{ padding: '1rem 1.5rem', borderRight: `1px solid ${divider}` }}>
                  <AccessLevelBadge level={item.access_level} dark={dark} />
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ActionBtn
                      onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item) }}
                      title="Edit"
                      hoverColor={dark ? '#93c5fd' : '#2563eb'}
                      dark={dark}
                    >
                      <PencilSquareIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </ActionBtn>
                    <ActionBtn
                      onClick={(e) => { e.stopPropagation(); onArchive && onArchive(item) }}
                      title="Archive"
                      hoverColor={dark ? '#fde047' : '#d97706'}
                      dark={dark}
                    >
                      <ArchiveBoxIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </ActionBtn>
                    <ActionBtn
                      onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item) }}
                      title="De-accession"
                      hoverColor={dark ? '#fca5a5' : '#dc2626'}
                      dark={dark}
                    >
                      <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <ClipboardDocumentCheckIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: emptyIcon }} />
            <p style={{ fontSize: '1.125rem', color: emptyText, margin: '0 0 0.25rem' }}>No accessions found</p>
            <p style={{ fontSize: '0.875rem', color: emptyMuted, margin: 0 }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: pagerBg,
          borderTop: `1px solid ${pagerBorder}`,
          transition: 'background 0.45s ease',
        }}>
          <span style={{ fontSize: '0.8125rem', color: pagerText }}>
            Page {pagination.page} of {pagination.totalPages} &nbsp;·&nbsp; {pagination.total} total
          </span>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <PagerBtn
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              dark={dark}
            >
              ← Prev
            </PagerBtn>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - pagination.page) <= 2)
              .map(p => (
                <PagerBtn
                  key={p}
                  active={p === pagination.page}
                  onClick={() => onPageChange && onPageChange(p)}
                  dark={dark}
                >
                  {p}
                </PagerBtn>
              ))}
            <PagerBtn
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              dark={dark}
            >
              Next →
            </PagerBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Access Level Badge ─────────────────────────────────────────────────────────
const AccessLevelBadge = ({ level, dark }) => {
  const isStaff = level === 'staff_only'
  const bg    = isStaff
    ? (dark ? 'rgba(239,68,68,0.15)' : '#fef2f2')
    : (dark ? 'rgba(34,197,94,0.12)' : '#f0fdf4')
  const color = isStaff
    ? (dark ? '#fca5a5' : '#dc2626')
    : (dark ? '#86efac' : '#16a34a')
  const Icon  = isStaff ? LockClosedIcon : GlobeAltIcon

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.6rem',
      borderRadius: '0.375rem',
      fontSize: '0.72rem', fontWeight: 600,
      background: bg, color,
      whiteSpace: 'nowrap',
    }}>
      <Icon style={{ width: '0.8rem', height: '0.8rem' }} />
      {isStaff ? 'Staff Only' : 'Public'}
    </span>
  )
}

// ── Action Button ──────────────────────────────────────────────────────────────
const ActionBtn = ({ onClick, title, hoverColor, dark, children }) => {
  const [hovered, setHovered] = useState(false)
  const defaultColor = dark ? '#6b8cae' : '#6b7280'
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0.375rem',
        background: 'transparent',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        color: hovered ? hoverColor : defaultColor,
        transition: 'color 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}

// ── Pagination Button ──────────────────────────────────────────────────────────
const PagerBtn = ({ onClick, disabled, active, dark, children }) => {
  const [hovered, setHovered] = useState(false)
  const bg = active
    ? 'var(--dark-blue-1)'
    : hovered && !disabled
      ? (dark ? '#1a3356' : '#e2e8f0')
      : 'transparent'
  const color = active ? '#fff' : disabled ? (dark ? '#2e4d70' : '#d1d5db') : (dark ? '#6b8cae' : '#374151')

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0.3rem 0.65rem',
        border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}`,
        borderRadius: '0.375rem',
        background: bg,
        color,
        fontSize: '0.8rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s ease, color 0.15s ease',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  )
}

export default AccessionsTable