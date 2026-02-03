import { XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

const ArchivesModal = ({ isOpen, onClose, archivedBooks, onRestore }) => {
  if (!isOpen) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

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
          {archivedBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No archived books yet</p>
              <p className="text-gray-400 text-sm">Archived items will show up here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {renderValue(book.title)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {renderValue(book.author)} · {renderValue(book.isbn)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRestore(book.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
