import { useState, useEffect, useRef, useCallback } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const FormField = ({ label, required, children, colSpan, dark }) => (
  <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
    <label style={{
      display: 'block', fontSize: '0.7rem', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      color: dark ? '#2e4d70' : '#6b7280',
      marginBottom: '0.375rem',
    }}>
      {label} {required && <span style={{ color: '#f87171' }}>*</span>}
    </label>
    {children}
  </div>
)

const AddAccessionModal = ({ isOpen, onClose, onSubmit, newAccession, setNewAccession, dark }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [autofilled, setAutofilled] = useState(false)
  const [nextAccessionNo, setNextAccessionNo] = useState('')

  const searchRef = useRef(null)
  const resultsRef = useRef(null)
  const debounceRef = useRef(null)

  // ── Fetch suggested accession number on open ─────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    axios
      .get(`${API_BASE}/accessions/next-number`, { headers: getAuthHeaders() })
      .then(({ data }) => {
        setNextAccessionNo(data.next_accession_no)
        setNewAccession((prev) => ({
          ...prev,
          accession_no: data.next_accession_no,
        }))
      })
      .catch(() => {})
  }, [isOpen])

  // ── Close search results on outside click ────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (
        resultsRef.current && !resultsRef.current.contains(e.target) &&
        searchRef.current && !searchRef.current.contains(e.target)
      ) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Debounced search ─────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((e) => {
    const q = e.target.value
    setSearchQuery(q)
    setShowResults(true)

    clearTimeout(debounceRef.current)

    if (!q.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/accessions/search-books`, {
          params: { q },
          headers: getAuthHeaders(),
        })
        setSearchResults(data)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  // ── Autofill from selected book ──────────────────────────────────────────────
  const handleSelectBook = (book) => {
    setNewAccession((prev) => ({
      ...prev,
      book_id: book.id,
      title: book.title || '',
      author: book.author || '',
      editor: book.editor || '',
      edition: book.edition || '',
      publication: book.publication || '',
      publisher: book.publisher || '',
      date_of_publication: book.date_of_publication?.slice(0, 10) || '',
      extent: book.extent || '',
      other_physical_details: book.other_physical_details || '',
      dimensions: book.dimensions || '',
      accompanying_material: book.accompanying_material || '',
      isbn: book.isbn || '',
      issn: book.issn || '',
      notes_area: book.notes_area || '',
      subjects: book.subjects || '',
    }))
    setSearchQuery(book.title)
    setShowResults(false)
    setAutofilled(true)
  }

  const handleClearAutofill = () => {
    setAutofilled(false)
    setSearchQuery('')
    setSearchResults([])
    setNewAccession((prev) => ({
      ...prev,
      book_id: null,
      title: '', author: '', editor: '', edition: '', publication: '',
      publisher: '', date_of_publication: '', extent: '', other_physical_details: '',
      dimensions: '', accompanying_material: '', isbn: '', issn: '',
      notes_area: '', subjects: '',
    }))
  }

  if (!isOpen) return null

  // ── Colors ────────────────────────────────────────────────
  const modalBg      = dark ? '#0f1f38' : '#ffffff'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const inputBg      = dark ? '#081422' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#d1d5db'
  const readOnlyBg   = dark ? '#060f1c' : '#f8fafc'
  const readOnlyText = dark ? '#2e4d70' : '#6b7280'
  const sectionDivider = dark ? '#1a3356' : '#f1f5f9'

  // Search banner
  const bannerBg     = dark ? 'rgba(30,64,175,0.1)' : '#eff6ff'
  const bannerBorder = dark ? '#1a3356' : '#bfdbfe'
  const bannerTitle  = dark ? '#93c5fd' : '#1d4ed8'
  const bannerText   = dark ? '#6b8cae' : '#3b82f6'

  // Dropdown
  const dropdownBg   = dark ? '#0f1f38' : '#ffffff'
  const dropdownBorder = dark ? '#1a3356' : '#e2e8f0'
  const dropdownHover = dark ? '#0d1d35' : '#eff6ff'
  const dropdownText = dark ? '#dde8f5' : '#1f2937'
  const dropdownMuted = dark ? '#6b8cae' : '#6b7280'

  // Warning banner
  const warnBg      = dark ? 'rgba(217,119,6,0.1)' : '#fffbeb'
  const warnBorder  = dark ? 'rgba(217,119,6,0.25)' : '#fde68a'
  const warnTitle   = dark ? '#fde047' : '#92400e'
  const warnText    = dark ? '#fbbf24' : '#b45309'

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem', fontSize: '0.875rem',
    background: inputBg, color: textPrimary,
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box',
  }

  const readOnlyStyle = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${dark ? '#0f1f38' : '#e2e8f0'}`,
    borderRadius: '0.5rem', fontSize: '0.875rem',
    background: readOnlyBg, color: readOnlyText,
    cursor: 'not-allowed', outline: 'none',
    boxSizing: 'border-box',
  }

  const sectionLabelStyle = {
    fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: textMuted,
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px solid ${sectionDivider}`,
  }

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
        maxHeight: '90vh', overflowY: 'auto',
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
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>
            Add Accession
          </h2>
          <button
            onClick={onClose}
            style={{ padding: '0.5rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: textSecondary }} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── Book Search Banner ─────────────────────────────────────────── */}
          <div style={{
            borderRadius: '0.75rem',
            border: `2px dashed ${bannerBorder}`,
            background: bannerBg,
            padding: '1rem',
            transition: 'background 0.45s ease, border-color 0.45s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <SparklesIcon style={{ width: '1rem', height: '1rem', color: bannerTitle }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: bannerTitle }}>
                Select Cataloged Book
              </span>
              {autofilled && (
                <button
                  type="button"
                  onClick={handleClearAutofill}
                  style={{ marginLeft: 'auto', fontSize: '0.75rem', color: dark ? '#fca5a5' : '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear selection
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: bannerText, marginBottom: '0.75rem' }}>
              Search for a cataloged book to add to accessions. Bibliographic details will be locked from the catalog.
            </p>

            <div style={{ position: 'relative' }} ref={searchRef}>
              <MagnifyingGlassIcon style={{ width: '1rem', height: '1rem', color: textMuted, position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by title, author, call number, or ISBN..."
                style={{
                  ...inputStyle,
                  paddingLeft: '2.25rem',
                  borderColor: dark ? '#1a3356' : '#93c5fd',
                }}
                onFocus={e => { if (searchQuery) setShowResults(true); e.target.style.borderColor = '#2563eb' }}
                onBlur={e => e.target.style.borderColor = dark ? '#1a3356' : '#93c5fd'}
              />
              {autofilled && (
                <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.25rem', color: dark ? '#86efac' : '#16a34a', fontSize: '0.75rem', fontWeight: 500 }}>
                  <SparklesIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                  Selected
                </div>
              )}

              {/* Search Dropdown */}
              {showResults && (
                <div
                  ref={resultsRef}
                  style={{
                    position: 'absolute', zIndex: 30, marginTop: '0.25rem',
                    width: '100%',
                    background: dropdownBg,
                    border: `1px solid ${dropdownBorder}`,
                    borderRadius: '0.75rem',
                    boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    transition: 'background 0.45s ease',
                  }}
                >
                  {isSearching ? (
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg style={{ width: '1rem', height: '1rem', animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Searching catalog...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: textMuted }}>
                      No matching books found.
                    </div>
                  ) : (
                    <ul style={{ maxHeight: '14rem', overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0 }}>
                      {searchResults.map((book) => (
                        <li key={book.id} style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                          <button
                            type="button"
                            onClick={() => handleSelectBook(book)}
                            style={{
                              width: '100%', textAlign: 'left',
                              padding: '0.75rem 1rem',
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = dropdownHover}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <BookOpenIcon style={{ width: '1rem', height: '1rem', color: bannerTitle, marginTop: '0.125rem', flexShrink: 0 }} />
                              <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: dropdownText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {book.title}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: dropdownMuted, margin: '0.25rem 0 0', display: 'flex', gap: '0.5rem' }}>
                                  {book.author && <span>{book.author}</span>}
                                  {book.call_number && <span style={{ color: bannerTitle }}>{book.call_number}</span>}
                                </p>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Accession-Specific Fields ──────────────────────────────────── */}
          <div>
            <p style={sectionLabelStyle}>Accession Info</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Accession Number" required dark={dark}>
                <input
                  type="text"
                  required
                  value={newAccession.accession_no}
                  onChange={(e) => setNewAccession({ ...newAccession, accession_no: e.target.value })}
                  placeholder={nextAccessionNo || 'e.g. 2026-0001'}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </FormField>
              <FormField label="Date Accessioned" required dark={dark}>
                <input
                  type="date"
                  required
                  value={newAccession.date_accessioned}
                  onChange={(e) => setNewAccession({ ...newAccession, date_accessioned: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </FormField>
            </div>
          </div>

          {/* ── Bibliographic Fields (Read-only when autofilled) ──────────── */}
          {autofilled && (
            <div>
              <p style={sectionLabelStyle}>
                Bibliographic Details
                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', fontWeight: 400, color: bannerTitle, textTransform: 'none', letterSpacing: 'normal' }}>
                  — from catalog (read-only)
                </span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Title" required dark={dark}>
                    <input type="text" value={newAccession.title} readOnly style={readOnlyStyle} />
                  </FormField>
                </div>

                <FormField label="Author" dark={dark}>
                  <input type="text" value={newAccession.author} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Editor" dark={dark}>
                  <input type="text" value={newAccession.editor} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Edition" dark={dark}>
                  <input type="text" value={newAccession.edition} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Publication" dark={dark}>
                  <input type="text" value={newAccession.publication} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Publisher" dark={dark}>
                  <input type="text" value={newAccession.publisher} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Date of Publication" dark={dark}>
                  <input type="date" value={newAccession.date_of_publication} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Extent" dark={dark}>
                  <input type="text" value={newAccession.extent} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="Dimensions" dark={dark}>
                  <input type="text" value={newAccession.dimensions} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="ISBN" dark={dark}>
                  <input type="text" value={newAccession.isbn} readOnly style={readOnlyStyle} />
                </FormField>

                <FormField label="ISSN" dark={dark}>
                  <input type="text" value={newAccession.issn} readOnly style={readOnlyStyle} />
                </FormField>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Other Physical Details" dark={dark}>
                    <input type="text" value={newAccession.other_physical_details} readOnly style={readOnlyStyle} />
                  </FormField>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Accompanying Material" dark={dark}>
                    <input type="text" value={newAccession.accompanying_material} readOnly style={readOnlyStyle} />
                  </FormField>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Subjects" dark={dark}>
                    <input type="text" value={newAccession.subjects} readOnly style={readOnlyStyle} />
                  </FormField>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Notes Area" dark={dark}>
                    <textarea rows={3} value={newAccession.notes_area} readOnly style={{ ...readOnlyStyle, resize: 'none' }} />
                  </FormField>
                </div>

              </div>
            </div>
          )}

          {/* ── Warning when no book selected ──────────────────────────────── */}
          {!autofilled && (
            <div style={{
              borderRadius: '0.5rem',
              border: `1px solid ${warnBorder}`,
              background: warnBg,
              padding: '1rem',
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: dark ? '#fbbf24' : '#d97706', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: warnTitle, margin: 0 }}>No Book Selected</p>
                  <p style={{ fontSize: '0.75rem', color: warnText, marginTop: '0.25rem' }}>
                    Please select a cataloged book from the search above to proceed. Accessions must be linked to existing catalog records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            paddingTop: '0.5rem',
            borderTop: `1px solid ${border}`,
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                background: 'transparent',
                border: `1px solid ${inputBorder}`,
                color: textSecondary,
                borderRadius: '0.5rem', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500,
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!autofilled}
              style={{
                padding: '0.5rem 1.5rem',
                background: autofilled ? 'var(--secondary-3-medium)' : (dark ? '#1a3356' : '#e5e7eb'),
                color: autofilled ? '#ffffff' : (dark ? '#2e4d70' : '#9ca3af'),
                border: 'none', borderRadius: '0.5rem',
                cursor: autofilled ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem', fontWeight: 500,
                boxShadow: autofilled ? '0 2px 8px rgba(255,166,0,0.3)' : 'none',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              Add Accession
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddAccessionModal