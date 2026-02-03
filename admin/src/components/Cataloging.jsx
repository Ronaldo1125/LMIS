import { useState } from 'react'
import StatsOverview from './CatalogingComponents/StatsOverview'
import SearchAndFilter from './CatalogingComponents/SearchAndFilter'
import BooksTable from './CatalogingComponents/BooksTable'
import AddBookModal from './CatalogingComponents/AddBookModal'

const Cataloging = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'National Budget Overview 2025',
      author: 'Department of Finance',
      isbn: '978-0-0001-2025-1',
      category: 'Annual Reports',
      publisher: 'Govt Printing Office',
      year: 2025,
      copies: 12,
      available: 9,
      status: 'Available'
    },
    {
      id: 2,
      title: 'Public Health Special Bulletin: Influenza Trends',
      author: 'Ministry of Health',
      isbn: '978-0-0002-2024-8',
      category: 'Special Reports',
      publisher: 'Govt Health Publications',
      year: 2024,
      copies: 7,
      available: 4,
      status: 'Available'
    },
    {
      id: 3,
      title: 'Official Gazette — January Issue',
      author: 'Government Communications Office',
      isbn: '978-0-0003-2026-3',
      category: 'Newspapers',
      publisher: 'Govt Gazette Press',
      year: 2026,
      copies: 15,
      available: 0,
      status: 'Not Available'
    },
    {
      id: 4,
      title: 'Statistical Yearbook 2024',
      author: 'National Statistics Bureau',
      isbn: '978-0-0004-2024-2',
      category: 'Sourcebook',
      publisher: 'Govt Statistical Office',
      year: 2024,
      copies: 10,
      available: 6,
      status: 'Available'
    },
    {
      id: 5,
      title: 'Coastal Erosion Assessment',
      author: 'Department of Environment',
      isbn: '978-0-0005-2023-9',
      category: 'Thesis/Research papers',
      publisher: 'Govt Research Series',
      year: 2023,
      copies: 5,
      available: 3,
      status: 'Available'
    },
    {
      id: 6,
      title: 'Administrative Procedure Act (Revised)',
      author: 'Office of the Attorney General',
      isbn: '978-0-0006-2022-6',
      category: 'Statute/Law/Legal Documents',
      publisher: 'Govt Legal Press',
      year: 2022,
      copies: 8,
      available: 8,
      status: 'Available'
    },
    {
      id: 7,
      title: 'Public Procurement Manual',
      author: 'Department of Procurement',
      isbn: '978-0-0007-2021-4',
      category: 'Guides/Manuals',
      publisher: 'Govt Service Press',
      year: 2021,
      copies: 6,
      available: 1,
      status: 'Available'
    },
    {
      id: 8,
      title: 'National Atlas of Infrastructure',
      author: 'Ministry of Works',
      isbn: '978-0-0008-2020-0',
      category: 'Atlas',
      publisher: 'Govt Mapping Agency',
      year: 2020,
      copies: 4,
      available: 2,
      status: 'Available'
    },
  ])

  const [newBook, setNewBook] = useState({
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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm)
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddBook = (e) => {
    e.preventDefault()
    const publicationYear = newBook.dateOfPublication
      ? new Date(newBook.dateOfPublication).getFullYear()
      : null
    const bookToAdd = {
      id: books.length + 1,
      ...newBook,
      year: publicationYear,
      copies: parseInt(newBook.copies),
      available: parseInt(newBook.copies),
      status: 'Available'
    }
    setBooks([...books, bookToAdd])
    setNewBook({
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
    setIsAddModalOpen(false)
  }

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id))
  }

  const handleEditBook = (book) => {
    // Edit functionality can be implemented here
    console.log('Edit book:', book)
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

      {/* Stats Cards - Now Horizontal */}
      <StatsOverview books={books} />

      {/* Search and Filter Controls */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Books Table */}
      <BooksTable
        books={filteredBooks}
        onDelete={handleDeleteBook}
        onEdit={handleEditBook}
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        newBook={newBook}
        setNewBook={setNewBook}
        categories={categories}
      />
    </div>
  )
}

export default Cataloging
