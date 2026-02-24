import { XMarkIcon, ArrowUturnLeftIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'

const ArchivesModal = ({ isOpen, onClose, archivedAccessions, onRestore }) => {
  if (!isOpen) return null

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
              Archived Accessions
            </h2>
            {archivedAccessions.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                {archivedAccessions.length} archived record{archivedAccessions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {archivedAccessions.length === 0 ? (
            <div className="text-center py-10">
              <ArchiveBoxIcon className="w-14 h-14 mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500">No archived accessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedAccessions.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--secondary-3-light)',
                          color: 'var(--dark-blue-1)'
                        }}
                      >
                        {item.accession_no || '-'}
                      </span>
                      {item.archived_at && (
                        <span className="text-xs text-gray-400">
                          Archived {formatDate(item.archived_at)}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 mt-1 truncate">{item.title || '-'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.author && <span>{item.author}</span>}
                      {item.author && item.publisher && <span className="mx-1">·</span>}
                      {item.publisher && <span>{item.publisher}</span>}
                    </p>
                    {item.archive_reason && (
                      <p className="text-xs text-amber-600 mt-1">
                        Reason: {item.archive_reason}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRestore(item.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
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