import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AddBookModal = ({ 
  isOpen, 
  onClose, 
  onBookAdded
}) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newBook, setNewBook] = useState({
    category: '',
    callNumber: '',
    title: '',
    author: '',
    editor: '',
    edition: '',
    publication: '',
    publisher: '',
    dateOfPublication: '',
    extent: '',
    dimensions: '',
    otherPhysicalDetails: '',
    accompanyingMaterial: '',
    isbn: '',
    issn: '',
    notesArea: '',
    subjects: '',
    copies: 1
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/books/meta/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    }
  }

  // Organize categories into hierarchical structure
  const renderCategoryOptions = () => {
    const options = []
    
    // Get all parent categories (those without parent_id)
    const parents = categories.filter(cat => !cat.parent_id)
    
    parents.forEach(parent => {
      // Add parent category
      options.push(
        <option key={parent.id} value={parent.name}>
          {parent.name}
        </option>
      )
      
      // Find and add children of this parent
      const children = categories.filter(cat => cat.parent_id === parent.id)
      
      if (children.length > 0) {
        children.forEach(child => {
          options.push(
            <option key={child.id} value={child.name}>
              &nbsp;&nbsp;&nbsp;&nbsp;└─ {child.name}
            </option>
          )
        })
      }
    })
    
    return options
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      
      const bookData = {
        category: newBook.category,
        call_number: newBook.callNumber,
        title: newBook.title,
        author: newBook.author,
        editor: newBook.editor,
        edition: newBook.edition,
        publication: newBook.publication,
        publisher: newBook.publisher,
        date_of_publication: newBook.dateOfPublication,
        extent: newBook.extent,
        dimensions: newBook.dimensions,
        other_physical_details: newBook.otherPhysicalDetails,
        accompanying_material: newBook.accompanyingMaterial,
        isbn: newBook.isbn,
        issn: newBook.issn,
        notes_area: newBook.notesArea,
        subjects: newBook.subjects,
        copies: parseInt(newBook.copies)
      }

      await axios.post(`${API_URL}/books`, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Reset form
      setNewBook({
        category: '',
        callNumber: '',
        title: '',
        author: '',
        editor: '',
        edition: '',
        publication: '',
        publisher: '',
        dateOfPublication: '',
        extent: '',
        dimensions: '',
        otherPhysicalDetails: '',
        accompanyingMaterial: '',
        isbn: '',
        issn: '',
        notesArea: '',
        subjects: '',
        copies: 1
      })

      if (onBookAdded) {
        onBookAdded()
      }

      onClose()
    } catch (err) {
      console.error('Error adding book:', err)
      setError(
        err.response?.data?.message || 
        'Failed to add book. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Add New Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={newBook.category}
                onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select category</option>
                {renderCategoryOptions()}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Number
              </label>
              <input
                type="text"
                value={newBook.callNumber}
                onChange={(e) => setNewBook({...newBook, callNumber: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter call number"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter book title"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Author name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editor
              </label>
              <input
                type="text"
                value={newBook.editor}
                onChange={(e) => setNewBook({...newBook, editor: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Editor name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edition
              </label>
              <input
                type="text"
                value={newBook.edition}
                onChange={(e) => setNewBook({...newBook, edition: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 2nd ed."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication
              </label>
              <input
                type="text"
                value={newBook.publication}
                onChange={(e) => setNewBook({...newBook, publication: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Place of publication"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                type="text"
                required
                value={newBook.publisher}
                onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Publisher name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Publication
              </label>
              <input
                type="date"
                value={newBook.dateOfPublication}
                onChange={(e) => setNewBook({...newBook, dateOfPublication: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extent of Item
              </label>
              <input
                type="text"
                value={newBook.extent}
                onChange={(e) => setNewBook({...newBook, extent: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 120 pages"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={newBook.dimensions}
                onChange={(e) => setNewBook({...newBook, dimensions: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 21 cm"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Physical Details
              </label>
              <textarea
                rows="2"
                value={newBook.otherPhysicalDetails}
                onChange={(e) => setNewBook({...newBook, otherPhysicalDetails: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., illustrations, maps"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accompanying Material
              </label>
              <textarea
                rows="2"
                value={newBook.accompanyingMaterial}
                onChange={(e) => setNewBook({...newBook, accompanyingMaterial: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 1 CD-ROM, 1 map"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                required
                value={newBook.isbn}
                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="978-X-XXX-XXXXX-X"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISSN
              </label>
              <input
                type="text"
                value={newBook.issn}
                onChange={(e) => setNewBook({...newBook, issn: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="XXXX-XXXX"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes Area
              </label>
              <textarea
                rows="3"
                value={newBook.notesArea}
                onChange={(e) => setNewBook({...newBook, notesArea: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Additional notes"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <textarea
                rows="2"
                value={newBook.subjects}
                onChange={(e) => setNewBook({...newBook, subjects: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Comma-separated subjects"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Copies *
              </label>
              <input
                type="number"
                required
                value={newBook.copies}
                onChange={(e) => setNewBook({...newBook, copies: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="1"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--secondary-3-medium)' }}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal