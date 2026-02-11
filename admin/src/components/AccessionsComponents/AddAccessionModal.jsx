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
                Autofill from Catalog
              </span>
              {autofilled && (
                <button
                  type="button"
                  onClick={handleClearAutofill}
                  className="ml-auto text-xs text-red-500 hover:text-red-700 underline"
                >
                  Clear autofill
                </button>
              )}
            </div>
            <p className="text-xs text-blue-500 mb-3">
              Search for an existing cataloged book to automatically fill in the bibliographic fields below.
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
                  Autofilled
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

          {/* ── Bibliographic Fields ───────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
              Bibliographic Details
              {autofilled && (
                <span className="ml-2 text-xs font-normal text-blue-500 normal-case tracking-normal">
                  — autofilled, edit if needed
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Title" required colSpan={2}>
                <input
                  type="text"
                  required
                  value={newAccession.title}
                  onChange={(e) => setNewAccession({ ...newAccession, title: e.target.value })}
                  className={inputClass}
                  placeholder="Book title"
                />
              </FormField>

              <FormField label="Author">
                <input
                  type="text"
                  value={newAccession.author}
                  onChange={(e) => setNewAccession({ ...newAccession, author: e.target.value })}
                  className={inputClass}
                  placeholder="Author name"
                />
              </FormField>

              <FormField label="Editor">
                <input
                  type="text"
                  value={newAccession.editor}
                  onChange={(e) => setNewAccession({ ...newAccession, editor: e.target.value })}
                  className={inputClass}
                  placeholder="Editor name"
                />
              </FormField>

              <FormField label="Edition">
                <input
                  type="text"
                  value={newAccession.edition}
                  onChange={(e) => setNewAccession({ ...newAccession, edition: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 3rd edition"
                />
              </FormField>

              <FormField label="Publication">
                <input
                  type="text"
                  value={newAccession.publication}
                  onChange={(e) => setNewAccession({ ...newAccession, publication: e.target.value })}
                  className={inputClass}
                  placeholder="Place of publication"
                />
              </FormField>

              <FormField label="Publisher">
                <input
                  type="text"
                  value={newAccession.publisher}
                  onChange={(e) => setNewAccession({ ...newAccession, publisher: e.target.value })}
                  className={inputClass}
                  placeholder="Publisher name"
                />
              </FormField>

              <FormField label="Date of Publication">
                <input
                  type="date"
                  value={newAccession.date_of_publication}
                  onChange={(e) => setNewAccession({ ...newAccession, date_of_publication: e.target.value })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Extent">
                <input
                  type="text"
                  value={newAccession.extent}
                  onChange={(e) => setNewAccession({ ...newAccession, extent: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 320 p."
                />
              </FormField>

              <FormField label="Dimensions">
                <input
                  type="text"
                  value={newAccession.dimensions}
                  onChange={(e) => setNewAccession({ ...newAccession, dimensions: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 23 cm"
                />
              </FormField>

              <FormField label="ISBN">
                <input
                  type="text"
                  value={newAccession.isbn}
                  onChange={(e) => setNewAccession({ ...newAccession, isbn: e.target.value })}
                  className={inputClass}
                  placeholder="ISBN"
                />
              </FormField>

              <FormField label="ISSN">
                <input
                  type="text"
                  value={newAccession.issn}
                  onChange={(e) => setNewAccession({ ...newAccession, issn: e.target.value })}
                  className={inputClass}
                  placeholder="ISSN"
                />
              </FormField>

              <FormField label="Other Physical Details" colSpan={2}>
                <input
                  type="text"
                  value={newAccession.other_physical_details}
                  onChange={(e) => setNewAccession({ ...newAccession, other_physical_details: e.target.value })}
                  className={inputClass}
                  placeholder="Illustrations, maps, etc."
                />
              </FormField>

              <FormField label="Accompanying Material" colSpan={2}>
                <input
                  type="text"
                  value={newAccession.accompanying_material}
                  onChange={(e) => setNewAccession({ ...newAccession, accompanying_material: e.target.value })}
                  className={inputClass}
                  placeholder="CD, maps, etc."
                />
              </FormField>

              <FormField label="Subjects" colSpan={2}>
                <input
                  type="text"
                  value={newAccession.subjects}
                  onChange={(e) => setNewAccession({ ...newAccession, subjects: e.target.value })}
                  className={inputClass}
                  placeholder="Subject headings"
                />
              </FormField>

              <FormField label="Notes Area" colSpan={2}>
                <textarea
                  rows={3}
                  value={newAccession.notes_area}
                  onChange={(e) => setNewAccession({ ...newAccession, notes_area: e.target.value })}
                  className={inputClass}
                  placeholder="Additional notes"
                />
              </FormField>

            </div>
          </div>

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
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-sm"
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