import React, { useState, useMemo } from 'react'
import {
  BookOpenIcon,
  PencilSquareIcon,
  TrashIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline'
import Modal from './Modal'

const COLUMNS = [
  { key: 'category',    label: 'Category' },
  { key: 'call_number', label: 'Call Number' },
  { key: 'title',       label: 'Title' },
  { key: 'author',      label: 'Author' },
  { key: 'isbn',        label: 'ISBN' },
]

const BooksTable = ({ books = [], onEdit, onView, onDelete, onArchive, dark }) => {
  const [deleteModal, setDeleteModal]   = useState({ isOpen: false, book: null })
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, book: null, reason: '' })
  const [lockedMsg, setLockedMsg]       = useState(false)
  const [sortConfig, setSortConfig]     = useState({ key: null, direction: null })
  // direction: 'asc' | 'desc' | null

  // ── Theme Configuration ────────────────────────────────────
  const tableBg        = dark ? '#0f1f38' : '#ffffff'
  const tableBorder    = dark ? '#1e3a5f' : '#e2e8f0'
  const headerBg       = dark ? '#0d1d35' : 'var(--dark-blue-1, #154A9A)'
  const rowHover       = dark ? '#162a4a' : '#f8fafc'
  const textPrimary    = dark ? '#dde8f5' : '#1e293b'
  const textSecondary  = dark ? '#6b8cae' : '#64748b'
  const textMuted      = dark ? '#4a6b8c' : '#94a3b8'
  const stickyColumnBg = dark ? '#0f1f38' : '#ffffff'
  const sortIconActive = '#ffffff'
  const sortIconIdle   = 'rgba(255,255,255,0.45)'

  // ── Sorting Logic ─────────────────────────────────────────
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key)     return { key, direction: 'asc' }
      if (prev.direction === 'asc')  return { key, direction: 'desc' }
      if (prev.direction === 'desc') return { key: null, direction: null }
      return { key, direction: 'asc' }
    })
  }

  const sortedBooks = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return books
    return [...books].sort((a, b) => {
      const valA = (a[sortConfig.key] ?? '').toString().toLowerCase()
      const valB = (b[sortConfig.key] ?? '').toString().toLowerCase()
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valA > valB) return sortConfig.direction === 'asc' ?  1 : -1
      return 0
    })
  }, [books, sortConfig])

  // ── Helper Functions ──────────────────────────────────────
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

  const handleDeleteClick  = (book) => setDeleteModal({ isOpen: true, book })
  const handleArchiveClick = (book) => setArchiveModal({ isOpen: true, book, reason: '' })

  // ── Sort Icon Component ───────────────────────────────────
  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey
    const dir      = isActive ? sortConfig.direction : null

    const iconStyle = {
      width: '0.9rem',
      height: '0.9rem',
      flexShrink: 0,
      transition: 'color 0.15s ease',
    }

    if (dir === 'asc')  return <ChevronUpIcon   style={{ ...iconStyle, color: sortIconActive }} />
    if (dir === 'desc') return <ChevronDownIcon  style={{ ...iconStyle, color: sortIconActive }} />
    return <ChevronUpDownIcon style={{ ...iconStyle, color: sortIconIdle }} />
  }

  // ── Sortable Header Cell ──────────────────────────────────
  const SortableHeader = ({ column, sticky = false }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isActive = sortConfig.key === column.key

    return (
      <th
        onClick={() => handleSort(column.key)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '1rem 1.5rem',
          textAlign: 'left',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: `1px solid ${tableBorder}`,
          borderRight: `1px solid ${tableBorder}`,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          userSelect: 'none',
          background: isHovered
            ? (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)')
            : (isActive ? (dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)') : headerBg),
          transition: 'background 0.15s ease',
          ...(sticky
            ? { position: 'sticky', left: 0, zIndex: 20 }
            : {}),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {column.label}
          <SortIcon columnKey={column.key} />
        </div>
      </th>
    )
  }

  // ── Action Button Component ───────────────────────────────
  const ActionBtn = ({ icon: Icon, hoverColor, onClick, title }) => {
    const [isBtnHovered, setIsBtnHovered] = useState(false)
    return (
      <button
        onClick={onClick}
        title={title}
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={{
          padding: '0.5rem',
          background: isBtnHovered ? (dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          color: isBtnHovered ? hoverColor : textMuted,
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>
    )
  }

  return (
    <>
      <div style={{
        background: tableBg,
        borderRadius: '0.75rem',
        border: `1px solid ${tableBorder}`,
        boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ background: headerBg }}>
              <tr>
                {/* Sticky Category column */}
                <SortableHeader column={COLUMNS[0]} sticky />

                {/* Remaining columns */}
                {COLUMNS.slice(1).map((col) => (
                  <SortableHeader key={col.key} column={col} />
                ))}

                {/* Non-sortable Actions column */}
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `1px solid ${tableBorder}`,
                  whiteSpace: 'nowrap',
                }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedBooks.map((book) => (
                <tr
                  key={book.id}
                  onClick={() => onView && onView(book)}
                  style={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = rowHover
                    if (e.currentTarget.cells[0]) e.currentTarget.cells[0].style.background = rowHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    if (e.currentTarget.cells[0]) e.currentTarget.cells[0].style.background = stickyColumnBg
                  }}
                >
                  {/* Category (sticky) */}
                  <td style={{
                    padding: '1rem 1.5rem',
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    background: stickyColumnBg,
                    borderBottom: `1px solid ${tableBorder}`,
                    borderRight: `1px solid ${tableBorder}`,
                    transition: 'background 0.45s ease',
                  }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: dark ? 'rgba(96, 165, 250, 0.15)' : 'var(--secondary-3-light, #e0f2fe)',
                      color: dark ? '#60a5fa' : 'var(--dark-blue-1, #154A9A)',
                      textTransform: 'uppercase',
                    }}>
                      {renderValue(book.category)}
                    </span>
                  </td>

                  {/* Call Number */}
                  <td style={{ padding: '1rem 1.5rem', color: textSecondary, fontSize: '0.875rem', borderBottom: `1px solid ${tableBorder}`, borderRight: `1px solid ${tableBorder}` }}>
                    {renderValue(book.call_number)}
                  </td>

                  {/* Title */}
                  <td style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${tableBorder}`, borderRight: `1px solid ${tableBorder}`, minWidth: '240px' }}>
                    <div style={{ fontWeight: 600, color: textPrimary, fontSize: '0.875rem' }}>
                      {renderValue(book.title)}
                    </div>
                  </td>

                  {/* Author */}
                  <td style={{ padding: '1rem 1.5rem', color: textSecondary, fontSize: '0.875rem', borderBottom: `1px solid ${tableBorder}`, borderRight: `1px solid ${tableBorder}` }}>
                    {renderValue(book.author)}
                  </td>

                  {/* ISBN */}
                  <td style={{ padding: '1rem 1.5rem', color: textMuted, fontSize: '0.8125rem', fontFamily: 'monospace', borderBottom: `1px solid ${tableBorder}`, borderRight: `1px solid ${tableBorder}` }}>
                    {renderValue(book.isbn)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${tableBorder}` }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: book.is_accessioned ? 'center' : 'flex-start' }}>
                      {book.is_accessioned ? (
                        <ActionBtn
                          icon={LockClosedIcon}
                          hoverColor="#ef4444"
                          title="Locked — already in Accession"
                          onClick={(e) => {
                            e.stopPropagation()
                            setLockedMsg(true)
                            setTimeout(() => setLockedMsg(false), 2500)
                          }}
                        />
                      ) : (
                        <>
                          <ActionBtn
                            icon={PencilSquareIcon}
                            hoverColor={dark ? '#60a5fa' : '#2563eb'}
                            title="Edit"
                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(book) }}
                          />
                          <ActionBtn
                            icon={ArchiveBoxIcon}
                            hoverColor="#f59e0b"
                            title="Archive"
                            onClick={(e) => { e.stopPropagation(); handleArchiveClick(book) }}
                          />
                          <ActionBtn
                            icon={TrashIcon}
                            hoverColor="#ef4444"
                            title="Delete"
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(book) }}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedBooks.length === 0 && (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <BookOpenIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: textSecondary, opacity: 0.3 }} />
              <p style={{ color: textSecondary, fontSize: '1.125rem', fontWeight: 500 }}>No books found</p>
              <p style={{ color: textSecondary, fontSize: '0.875rem', opacity: 0.7 }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        dark={dark}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, book: null })}
        onConfirm={() => {
          onDelete && onDelete(deleteModal.book.id)
          setDeleteModal({ isOpen: false, book: null })
        }}
        title="Delete Book"
        message={`Are you sure you want to permanently delete "${deleteModal.book?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      {/* Archive Modal */}
      <Modal
        dark={dark}
        isOpen={archiveModal.isOpen}
        onClose={() => setArchiveModal({ isOpen: false, book: null, reason: '' })}
        onConfirm={() => {
          onArchive && onArchive(archiveModal.book.id, archiveModal.reason)
          setArchiveModal({ isOpen: false, book: null, reason: '' })
        }}
        title="Archive Book"
        message={`Are you sure you want to archive "${archiveModal.book?.title}"? This action can be reversed later.`}
        confirmText="Yes"
        cancelText="No"
        confirmColor="amber"
      />

      {/* Locked Toast */}
      {lockedMsg && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: dark ? '#0f1f38' : '#1e293b',
          color: '#ffffff', padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 999,
          border: dark ? '1px solid #1a3356' : 'none',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <LockClosedIcon style={{ width: '1rem', height: '1rem', color: '#f87171' }} />
          This book is already in Accession
        </div>
      )}
    </>
  )
}

export default BooksTable