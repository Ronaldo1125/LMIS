import { XMarkIcon } from '@heroicons/react/24/outline'

const ViewBookModal = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

  const details = [
    { label: 'Category', value: book.category },
    { label: 'Call Number', value: book.callNumber },
    { label: 'Title', value: book.title },
    { label: 'Author', value: book.author },
    { label: 'Editor', value: book.editor },
    { label: 'Edition', value: book.edition },
    { label: 'Publication', value: book.publication },
    { label: 'Publisher', value: book.publisher },
    { label: 'Date of Publication', value: book.dateOfPublication },
    { label: 'Year', value: book.year },
    { label: 'ISBN', value: book.isbn },
    { label: 'ISSN', value: book.issn },
    { label: 'Extent of Item', value: book.extent },
    { label: 'Dimensions', value: book.dimensions },
    { label: 'Other Physical Details', value: book.otherPhysicalDetails },
    { label: 'Accompanying Material', value: book.accompanyingMaterial },
    { label: 'Notes Area', value: book.notesArea },
    { label: 'Subjects', value: book.subjects },
    { label: 'Copies', value: book.copies },
    { label: 'Available', value: book.available },
    { label: 'Status', value: book.status },
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
              Book Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">{renderValue(book.title)}</p>
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

export default ViewBookModal
