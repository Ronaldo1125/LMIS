import { XMarkIcon } from '@heroicons/react/24/outline'

const AcquisitionDetailsModal = ({ isOpen, onClose, acquisition }) => {
  if (!isOpen || !acquisition) return null

  const renderValue = (value) => {
    if (!value || value === '') return '—'
    return value
  }

  const details = [
    { label: 'Category', value: acquisition.category },
    { label: 'Call Number', value: acquisition.callNumber },
    { label: 'Title', value: acquisition.title },
    { label: 'Author', value: acquisition.author },
    { label: 'Publisher', value: acquisition.publisher },
    { label: 'Year', value: acquisition.year },
    { label: 'ISBN', value: acquisition.isbn },
    { label: 'Copies', value: acquisition.copies },
    { label: 'Available', value: acquisition.available },
    { label: 'Status', value: acquisition.status },
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-bold text-[#154A9A]">Book Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {details.map((item) => (
            <div key={item.label}>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">
                {item.label}
              </p>
              <p className="text-sm text-gray-700">{renderValue(item.value)}</p>
            </div>
          ))}

          {/* Description */}
          {acquisition.description && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {acquisition.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex justify-end border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AcquisitionDetailsModal