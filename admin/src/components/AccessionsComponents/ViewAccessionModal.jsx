import { XMarkIcon } from '@heroicons/react/24/outline'

const ViewAccessionModal = ({ isOpen, onClose, accession }) => {
  if (!isOpen || !accession) return null

  const fields = [
    { label: 'Accession Number', value: accession.accessionNumber },
    { label: 'Title', value: accession.title },
    { label: 'Category', value: accession.category },
    { label: 'Source Type', value: accession.sourceType },
    { label: 'Source Name', value: accession.sourceName },
    { label: 'Date Received', value: accession.dateReceived },
    { label: 'Quantity', value: accession.quantity },
    { label: 'Condition', value: accession.condition },
    { label: 'Status', value: accession.status },
    { label: 'Notes', value: accession.notes }
  ]

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Accession Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(field => (
              <div key={field.label} className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs uppercase text-gray-500 mb-2">{field.label}</p>
                <p className="text-gray-800 font-medium">{renderValue(field.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAccessionModal
