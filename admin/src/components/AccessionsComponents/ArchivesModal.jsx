import { XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

const ArchivesModal = ({ isOpen, onClose, archivedAccessions, onRestore }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Archived Accessions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {archivedAccessions.length === 0 ? (
            <p className="text-gray-500">No archived accessions.</p>
          ) : (
            <div className="space-y-4">
              {archivedAccessions.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.accessionNumber} | {item.sourceName}
                    </p>
                  </div>
                  <button
                    onClick={() => onRestore(item.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArchivesModal
