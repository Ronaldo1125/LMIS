import { XMarkIcon } from '@heroicons/react/24/outline'

const EditBookModal = ({ isOpen, onClose, onSubmit, editBook, setEditBook, categories }) => {
  if (!isOpen) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Edit Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={editBook.category}
                onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.filter(cat => cat !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Number
              </label>
              <input
                type="text"
                value={editBook.callNumber}
                onChange={(e) => setEditBook({ ...editBook, callNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter call number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={editBook.title}
                onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={editBook.author}
                onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editor
              </label>
              <input
                type="text"
                value={editBook.editor}
                onChange={(e) => setEditBook({ ...editBook, editor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Editor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edition
              </label>
              <input
                type="text"
                value={editBook.edition}
                onChange={(e) => setEditBook({ ...editBook, edition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 2nd ed."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication
              </label>
              <input
                type="text"
                value={editBook.publication}
                onChange={(e) => setEditBook({ ...editBook, publication: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Place of publication"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                type="text"
                required
                value={editBook.publisher}
                onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Publisher name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Publication
              </label>
              <input
                type="date"
                value={editBook.dateOfPublication}
                onChange={(e) => setEditBook({ ...editBook, dateOfPublication: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extent of Item
              </label>
              <input
                type="text"
                value={editBook.extent}
                onChange={(e) => setEditBook({ ...editBook, extent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 120 pages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={editBook.dimensions}
                onChange={(e) => setEditBook({ ...editBook, dimensions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 21 cm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Physical Details
              </label>
              <textarea
                rows="2"
                value={editBook.otherPhysicalDetails}
                onChange={(e) => setEditBook({ ...editBook, otherPhysicalDetails: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., illustrations, maps"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accompanying Material
              </label>
              <textarea
                rows="2"
                value={editBook.accompanyingMaterial}
                onChange={(e) => setEditBook({ ...editBook, accompanyingMaterial: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 1 CD-ROM, 1 map"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                required
                value={editBook.isbn}
                onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="978-X-XXX-XXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISSN
              </label>
              <input
                type="text"
                value={editBook.issn}
                onChange={(e) => setEditBook({ ...editBook, issn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="XXXX-XXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes Area
              </label>
              <textarea
                rows="3"
                value={editBook.notesArea}
                onChange={(e) => setEditBook({ ...editBook, notesArea: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Additional notes"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <textarea
                rows="2"
                value={editBook.subjects}
                onChange={(e) => setEditBook({ ...editBook, subjects: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Comma-separated subjects"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Copies *
              </label>
              <input
                type="number"
                required
                value={editBook.copies}
                onChange={(e) => setEditBook({ ...editBook, copies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="0"
                min="1"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
              style={{ backgroundColor: 'var(--secondary-3-medium)' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal
