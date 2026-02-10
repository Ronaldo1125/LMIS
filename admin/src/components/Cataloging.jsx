import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StatsOverview from './CatalogingComponents/StatsOverview'
import SearchAndFilter from './CatalogingComponents/SearchAndFilter'
import BooksTable from './CatalogingComponents/BooksTable'
import AddBookModal from './CatalogingComponents/AddBookModal'
import ViewBookModal from './CatalogingComponents/ViewBookModal'
import EditBookModal from './CatalogingComponents/EditBookModal'
import ArchivesModal from './CatalogingComponents/ArchivesModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Cataloging = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isArchivesOpen, setIsArchivesOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [editBook, setEditBook] = useState({
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
  })

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

  // Fetch books from API - wrapped in useCallback to prevent infinite loops
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('authToken')
      
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : ''
      }

      const response = await axios.get(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })

      setBooks(response.data.books)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching books:', err)
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedCategory])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleBookAdded = () => {
    // Reset to first page and refresh
    setCurrentPage(1)
    fetchBooks()
  }

  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBooks()
    } catch (err) {
      console.error('Error deleting book:', err)
      setError('Failed to delete book. Please try again.')
    }
  }

  const handleArchiveBook = async (id, reason) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${API_URL}/books/${id}/archive`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchBooks() // Refresh the list
    } catch (err) {
      console.error('Error archiving book:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to archive book. Please try again.')
      }
    }
  }

  const handleUnarchiveBook = async (id) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${API_URL}/books/${id}/unarchive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchBooks() // Refresh main list
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
    // Format the date to yyyy-MM-dd for the date input
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
  })
  setIsEditModalOpen(true)
}

const handleUpdateBook = async () => {
  try {
    const token = localStorage.getItem('authToken')
    
    const bookData = {
      category: editBook.category,
      call_number: editBook.callNumber,
      title: editBook.title,
      author: editBook.author,
      editor: editBook.editor,
      edition: editBook.edition,
      publication: editBook.publication,
      publisher: editBook.publisher,
      date_of_publication: editBook.dateOfPublication || null, // Just send the date string
      extent: editBook.extent,
      dimensions: editBook.dimensions,
      other_physical_details: editBook.otherPhysicalDetails,
      accompanying_material: editBook.accompanyingMaterial,
      isbn: editBook.isbn,
      issn: editBook.issn,
      notes_area: editBook.notesArea,
      subjects: editBook.subjects,
      copies: parseInt(editBook.copies)
    }

    await axios.put(`${API_URL}/books/${editBook.id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setIsEditModalOpen(false)
    setEditBook({
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
    })
    
    fetchBooks()
  } catch (err) {
    console.error('Error updating book:', err)
    setError('Failed to update book. Please try again.')
  }
}

  const handleViewBook = async (book) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/books/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
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

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-blue-1)' }}>
          Cataloging
        </h1>
        <p className="text-gray-600">Manage and organize your library collection</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <StatsOverview books={books} />

      {/* Search and Filter Controls */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onAddClick={() => setIsAddModalOpen(true)}
        onArchiveClick={() => setIsArchivesOpen(true)}
      />

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          {/* Books Table */}
          <BooksTable
            books={books}
            onEdit={handleEditBook}
            onView={handleViewBook}
            onDelete={handleDeleteBook}
            onArchive={handleArchiveBook}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
      />

      {/* View Book Modal */}
      <ViewBookModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        book={selectedBook}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateBook}
        editBook={editBook}
        setEditBook={setEditBook}
        categories={categories}
      />

      {/* Archives Modal */}
      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        onRestore={handleUnarchiveBook}
      />
    </div>
  )
}

export default Cataloging