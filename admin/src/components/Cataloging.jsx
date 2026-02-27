import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { BookOpen } from 'lucide-react'
import StatsOverview from './CatalogingComponents/StatsOverview'
import SearchAndFilter from './CatalogingComponents/SearchAndFilter'
import BooksTable from './CatalogingComponents/BooksTable'
import AddBookModal from './CatalogingComponents/AddBookModal'
import ViewBookModal from './CatalogingComponents/ViewBookModal'
import EditBookModal from './CatalogingComponents/EditBookModal'
import ArchivesModal from './CatalogingComponents/ArchivesModal'
import ImportBooksModal from './CatalogingComponents/ImportBooksModal'

// ── Blank edit state (single source of truth) ─────────────────────────────────
const blankEditBook = {
  id: null,
  category: '',
  callNumber: '',
  title: '',
  author: '',
  editor: '',
  edition: '',
  publication: '',
  isbn: '',
  issn: '',
  publisher: '',
  dateOfPublication: '',
  extent: '',
  otherPhysicalDetails: '',
  dimensions: '',
  accompanyingMaterial: '',
  notesArea: '',
  subjects: '',
  copies: '',
  access_level: 'public', // ✅ NEW
}

const Cataloging = ({ dark }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isArchivesOpen, setIsArchivesOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [catalogStats, setCatalogStats] = useState(null)

  const [editBook, setEditBook] = useState(blankEditBook) // ✅ uses blankEditBook

  const categories = [
    'all',
    'Books',
    'Reports',
    'Annual Reports',
    'Special Reports',
    'Periodicals',
    'Magazines',
    'Newspapers',
    'Journals',
    'Sourcebook',
    'Thesis/Research papers',
    'Statute/Law/Legal Documents',
    'Guides/Manuals',
    'Reference Materials',
    'Encyclopedia',
    'Atlas'
  ]

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : ''
      }

      const response = await api.get('/books', { params })
      setBooks(response.data.books)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching books:', err)
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedCategory])

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/books/meta/stats')
      setCatalogStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])
  useEffect(() => { fetchStats() }, [fetchStats])

  const handleBookAdded = () => {
    setCurrentPage(1)
    fetchBooks()
    fetchStats()
  }

  const handleImported = () => {
    setCurrentPage(1)
    fetchBooks()
    fetchStats()
  }

  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/uploads/book/${id}`)
      await api.delete(`/books/${id}`)
      fetchBooks()
      fetchStats()
    } catch (err) {
      console.error('Error deleting book:', err)
      setError('Failed to delete book. Please try again.')
    }
  }

  const handleArchiveBook = async (id, reason) => {
    try {
      await api.patch(`/books/${id}/archive`, { reason })
      fetchBooks()
      fetchStats()
    } catch (err) {
      console.error('Error archiving book:', err)
      setError(err.response?.data?.message || 'Failed to archive book. Please try again.')
    }
  }

  const handleUnarchiveBook = async (id) => {
    try {
      await api.patch(`/books/${id}/unarchive`, {})
      fetchBooks()
      fetchStats()
    } catch (err) {
      console.error('Error unarchiving book:', err)
      setError('Failed to unarchive book. Please try again.')
    }
  }

  const handleEditBook = (book) => {
    setEditBook({
      id: book.id,
      category: book.category || '',
      callNumber: book.call_number || '',
      title: book.title || '',
      author: book.author || '',
      editor: book.editor || '',
      edition: book.edition || '',
      publication: book.publication || '',
      isbn: book.isbn || '',
      issn: book.issn || '',
      publisher: book.publisher || '',
      dateOfPublication: book.date_of_publication
        ? book.date_of_publication.split('T')[0]
        : '',
      extent: book.extent || '',
      otherPhysicalDetails: book.other_physical_details || '',
      dimensions: book.dimensions || '',
      accompanyingMaterial: book.accompanying_material || '',
      notesArea: book.notes_area || '',
      subjects: book.subjects || '',
      copies: book.copies ?? '',
      access_level: book.access_level || 'public', // ✅ NEW
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateBook = async () => {
    try {
      const bookData = {
        category: editBook.category,
        call_number: editBook.callNumber,
        title: editBook.title,
        author: editBook.author,
        editor: editBook.editor,
        edition: editBook.edition,
        publication: editBook.publication,
        publisher: editBook.publisher,
        date_of_publication: editBook.dateOfPublication || null,
        extent: editBook.extent,
        dimensions: editBook.dimensions,
        other_physical_details: editBook.otherPhysicalDetails,
        accompanying_material: editBook.accompanyingMaterial,
        isbn: editBook.isbn,
        issn: editBook.issn,
        notes_area: editBook.notesArea,
        subjects: editBook.subjects,
        copies: parseInt(editBook.copies),
        access_level: editBook.access_level || 'public', // ✅ NEW
      }

      await api.put(`/books/${editBook.id}`, bookData)

      setIsEditModalOpen(false)
      setEditBook(blankEditBook) // ✅ clean reset using shared constant

      fetchBooks()
      fetchStats()
    } catch (err) {
      console.error('Error updating book:', err)
      setError('Failed to update book. Please try again.')
    }
  }

  const handleViewBook = async (book) => {
    try {
      const response = await api.get(`/books/${book.id}`)
      setSelectedBook(response.data)
      setIsViewModalOpen(true)
    } catch (err) {
      console.error('Error fetching book details:', err)
      setError('Failed to load book details.')
    }
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedBook(null)
  }

  const pageBg        = dark ? '#0a1628' : '#f1f5f9'
  const headerBg      = dark ? '#0d1d35' : '#ffffff'
  const headerBorder  = dark ? '#1a3356' : '#e2e8f0'
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'
  const errorBg       = dark ? 'rgba(220,38,38,0.1)' : '#fef2f2'
  const errorBorder   = dark ? 'rgba(220,38,38,0.2)' : '#fecaca'
  const errorText     = dark ? '#fca5a5' : '#dc2626'
  const btnBg         = dark ? '#0f1f38' : '#ffffff'
  const btnHover      = dark ? '#1a3356' : '#f1f5f9'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Header */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <BookOpen style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>Cataloging</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>Manage and organize your library collection</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: errorBg, border: `1px solid ${errorBorder}`, borderRadius: '0.5rem' }}>
            <p style={{ color: errorText, fontSize: '0.875rem', margin: 0 }}>{error}</p>
          </div>
        )}

        <StatsOverview stats={catalogStats} dark={dark} />

        <div style={{ position: 'sticky', top: 0, zIndex: 40, background: pageBg, transition: 'background 0.45s ease' }}>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            onAddClick={() => setIsAddModalOpen(true)}
            onArchiveClick={() => setIsArchivesOpen(true)}
            onImportClick={() => setIsImportOpen(true)}
            dark={dark}
          />
        </div>

        {loading ? (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', transition: 'background 0.45s ease' }}>
            <div style={{ display: 'inline-block', width: '2rem', height: '2rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: textSecondary }}>Loading books...</p>
          </div>
        ) : (
          <>
            <BooksTable
              books={books}
              onEdit={handleEditBook}
              onView={handleViewBook}
              onDelete={handleDeleteBook}
              onArchive={handleArchiveBook}
              dark={dark}
            />

            {totalPages > 1 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem', background: btnBg, border: `1px solid ${border}`,
                    color: textPrimary, borderRadius: '0.5rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1, transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => { if (currentPage !== 1) e.currentTarget.style.background = btnHover }}
                  onMouseLeave={e => { e.currentTarget.style.background = btnBg }}
                >
                  Previous
                </button>
                <span style={{ padding: '0.5rem 1rem', color: textPrimary, background: btnBg, border: `1px solid ${border}`, borderRadius: '0.5rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem', background: btnBg, border: `1px solid ${border}`,
                    color: textPrimary, borderRadius: '0.5rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1, transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => { if (currentPage !== totalPages) e.currentTarget.style.background = btnHover }}
                  onMouseLeave={e => { e.currentTarget.style.background = btnBg }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
        dark={dark}
      />

      <ViewBookModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        book={selectedBook}
        dark={dark}
      />

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateBook}
        editBook={editBook}
        setEditBook={setEditBook}
        categories={categories}
        dark={dark}
      />

      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        onRestore={handleUnarchiveBook}
        dark={dark}
      />

      <ImportBooksModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImported={handleImported}
        dark={dark}
      />
    </div>
  )
}

export default Cataloging