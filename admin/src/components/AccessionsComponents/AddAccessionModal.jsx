import { XMarkIcon } from '@heroicons/react/24/outline'

const AddAccessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  newAccession,
  setNewAccession
}) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Add Accession
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accession Number *
              </label>
              <input
                type="text"
                required
                value={newAccession.accessionNumber}
                onChange={(e) => setNewAccession({ ...newAccession, accessionNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="ACC-2026-004"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Received *
              </label>
              <input
                type="date"
                required
                value={newAccession.dateReceived}
                onChange={(e) => setNewAccession({ ...newAccession, dateReceived: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={newAccession.title}
                onChange={(e) => setNewAccession({ ...newAccession, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter accession title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={newAccession.category}
                onChange={(e) => setNewAccession({ ...newAccession, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Reports, Reference, Research"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={newAccession.quantity}
                onChange={(e) => setNewAccession({ ...newAccession, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type *
              </label>
              <select
                required
                value={newAccession.sourceType}
                onChange={(e) => setNewAccession({ ...newAccession, sourceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="Donation">Donation</option>
                <option value="Purchase">Purchase</option>
                <option value="Exchange">Exchange</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Name *
              </label>
              <input
                type="text"
                required
                value={newAccession.sourceName}
                onChange={(e) => setNewAccession({ ...newAccession, sourceName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Organization or donor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <input
                type="text"
                value={newAccession.condition}
                onChange={(e) => setNewAccession({ ...newAccession, condition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="New, Good, Fair"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                value={newAccession.notes}
                onChange={(e) => setNewAccession({ ...newAccession, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Additional notes"
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
              Add Accession
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccessionModal
