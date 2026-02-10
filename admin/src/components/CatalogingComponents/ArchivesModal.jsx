import { useState, useEffect } from 'react'
import axios from 'axios'
import { XMarkIcon, ArrowUturnLeftIcon, EyeIcon } from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ArchivesModal = ({ isOpen, onClose, onRestore }) => {
  const [archivedBooks, setArchivedBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Fetch archived books when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchArchivedBooks()
    }
  }, [isOpen])

  const fetchArchivedBooks = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('authToken')
      
      const response = await axios.get(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          showArchived: 'true',
          limit: 100 // Get all archived books
        }
      })
      
      setArchivedBooks(response.data.books)
    } catch (err) {
      console.error('Error fetching archived books:', err)
      setError('Failed to load archived books')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id, e) => {
    e.stopPropagation() // Prevent opening details when clicking restore
    try {
      await onRestore(id)
      // Refresh the archived books list after restore
      fetchArchivedBooks()
    } catch (err) {
      console.error('Error restoring book:', err)
      setError('Failed to restore book')
    }
  }

  const handleRowClick = (book) => {
    setSelectedBook(book)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedBook(null)
  }

  if (!isOpen) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

  // Book Details View
  if (showDetails && selectedBook) {
    const details = [
      { label: 'Category', value: selectedBook.category },
      { label: 'Call Number', value: selectedBook.call_number },
      { label: 'Title', value: selectedBook.title },
      { label: 'Author', value: selectedBook.author },
      { label: 'Editor', value: selectedBook.editor },
      { label: 'Edition', value: selectedBook.edition },
      { label: 'Publication', value: selectedBook.publication },
      { label: 'Publisher', value: selectedBook.publisher },
      { label: 'Date of Publication', value: selectedBook.date_of_publication },
      { label: 'Extent of Item', value: selectedBook.extent },
      { label: 'Dimensions', value: selectedBook.dimensions },
      { label: 'Other Physical Details', value: selectedBook.other_physical_details },
      { label: 'Accompanying Material', value: selectedBook.accompanying_material },
      { label: 'ISBN', value: selectedBook.isbn },
      { label: 'ISSN', value: selectedBook.issn },
      { label: 'Notes Area', value: selectedBook.notes_area },
      { label: 'Subjects', value: selectedBook.subjects },
      { label: 'Copies', value: selectedBook.copies },
    ]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                Archived Book Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">{renderValue(selectedBook.title)}</p>
            </div>
            <button
              onClick={handleCloseDetails}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Archive Information */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 mb-2">Archive Information</p>
              {selectedBook.archived_at && (
                <p className="text-xs text-amber-800">
                  <span className="font-medium">Archived:</span>{' '}
                  {new Date(selectedBook.archived_at).toLocaleDateString()}
                </p>
              )}
              {selectedBook.archived_by && (
                <p className="text-xs text-amber-800 mt-1">
                  <span className="font-medium">By:</span> {selectedBook.archived_by}
                </p>
              )}
              {selectedBook.archive_reason && (
                <p className="text-xs text-amber-800 mt-1">
                  <span className="font-medium">Reason:</span> {selectedBook.archive_reason}
                </p>
              )}
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-700">{renderValue(item.value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => handleCloseDetails()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back to Archives
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleRestore(selectedBook.id, e)
                  handleCloseDetails()
                }}
                className="inline-flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                style={{ backgroundColor: 'var(--dark-blue-1)' }}
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
                Restore Book
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Archives List View
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
              Archived Books
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {archivedBooks.length} archived item{archivedBooks.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading archived books...</p>
            </div>
          ) : archivedBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No archived books yet</p>
              <p className="text-gray-400 text-sm">Archived items will show up here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleRowClick(book)}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {renderValue(book.title)}
                      </p>
                      <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {renderValue(book.author)} · {renderValue(book.isbn)}
                    </p>
                    {book.archive_reason && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        Reason: {book.archive_reason}
                      </p>
                    )}
                    {book.archived_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Archived: {new Date(book.archived_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRestore(book.id, e)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArchivesModal