import { useState, useEffect, useRef, useCallback } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const FormField = ({ label, required, children, colSpan }) => (
  <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
)

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white'

const readOnlyInputClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed'

const AddAccessionModal = ({ isOpen, onClose, onSubmit, newAccession, setNewAccession }) => {
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
      title: '',
      author: '',
      editor: '',
      edition: '',
      publication: '',
      publisher: '',
      date_of_publication: '',
      extent: '',
      other_physical_details: '',
      dimensions: '',
      accompanying_material: '',
      isbn: '',
      issn: '',
      notes_area: '',
      subjects: '',
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Add Accession
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">

          {/* ── Book Search Banner ─────────────────────────────────────────── */}
          <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">
                Select Cataloged Book
              </span>
              {autofilled && (
                <button
                  type="button"
                  onClick={handleClearAutofill}
                  className="ml-auto text-xs text-red-500 hover:text-red-700 underline"
                >
                  Clear selection
                </button>
              )}
            </div>
            <p className="text-xs text-blue-500 mb-3">
              Search for a cataloged book to add to accessions. Bibliographic details will be locked from the catalog.
            </p>
            <div className="relative" ref={searchRef}>
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
                placeholder="Search by title, author, call number, or ISBN..."
                className="w-full pl-9 pr-4 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {autofilled && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 text-xs font-medium">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Selected
                </div>
              )}

              {/* Search Dropdown */}
              {showResults && (
                <div
                  ref={resultsRef}
                  className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                >
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Searching catalog...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No matching books found.
                    </div>
                  ) : (
                    <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                      {searchResults.map((book) => (
                        <li key={book.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectBook(book)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <BookOpenIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                  {book.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {book.author && <span>{book.author}</span>}
                                  {book.call_number && (
                                    <span className="ml-2 text-blue-500">
                                      {book.call_number}
                                    </span>
                                  )}
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
              Accession Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Accession Number" required>
                <input
                  type="text"
                  required
                  value={newAccession.accession_no}
                  onChange={(e) => setNewAccession({ ...newAccession, accession_no: e.target.value })}
                  placeholder={nextAccessionNo || 'e.g. 2026-0001'}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Date Accessioned" required>
                <input
                  type="date"
                  required
                  value={newAccession.date_accessioned}
                  onChange={(e) => setNewAccession({ ...newAccession, date_accessioned: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          {/* ── Bibliographic Fields (Read-only when autofilled) ──────────── */}
          {autofilled && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
                Bibliographic Details
                <span className="ml-2 text-xs font-normal text-blue-500 normal-case tracking-normal">
                  — from catalog (read-only)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField label="Title" required colSpan={2}>
                  <input
                    type="text"
                    value={newAccession.title}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Author">
                  <input
                    type="text"
                    value={newAccession.author}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Editor">
                  <input
                    type="text"
                    value={newAccession.editor}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Edition">
                  <input
                    type="text"
                    value={newAccession.edition}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Publication">
                  <input
                    type="text"
                    value={newAccession.publication}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Publisher">
                  <input
                    type="text"
                    value={newAccession.publisher}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Date of Publication">
                  <input
                    type="date"
                    value={newAccession.date_of_publication}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Extent">
                  <input
                    type="text"
                    value={newAccession.extent}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Dimensions">
                  <input
                    type="text"
                    value={newAccession.dimensions}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="ISBN">
                  <input
                    type="text"
                    value={newAccession.isbn}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="ISSN">
                  <input
                    type="text"
                    value={newAccession.issn}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Other Physical Details" colSpan={2}>
                  <input
                    type="text"
                    value={newAccession.other_physical_details}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Accompanying Material" colSpan={2}>
                  <input
                    type="text"
                    value={newAccession.accompanying_material}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Subjects" colSpan={2}>
                  <input
                    type="text"
                    value={newAccession.subjects}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

                <FormField label="Notes Area" colSpan={2}>
                  <textarea
                    rows={3}
                    value={newAccession.notes_area}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </FormField>

              </div>
            </div>
          )}

          {/* ── Warning when no book selected ──────────────────────────────── */}
          {!autofilled && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">No Book Selected</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Please select a cataloged book from the search above to proceed. Accessions must be linked to existing catalog records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ────────────────────────────────────────────────────── */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!autofilled}
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              style={{ backgroundColor: 'var(--secondary-3-medium)' }}
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