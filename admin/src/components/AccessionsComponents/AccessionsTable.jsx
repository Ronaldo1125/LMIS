import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

const AccessionsTable = ({ accessions, onArchive, onEdit, onView }) => {
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--dark-blue-1)' }}>
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-white sticky left-0 z-20"
                style={{ backgroundColor: 'var(--dark-blue-1)' }}
              >
                Accession No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white min-w-[220px]">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date Received</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Qty</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accessions.map((item, index) => (
              <tr
                key={item.id}
                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onView && onView(item)}
              >
                <td className="px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-gray-50">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--secondary-3-light)',
                      color: 'var(--dark-blue-1)'
                    }}
                  >
                    {renderValue(item.accessionNumber)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium truncate" style={{ color: 'var(--dark-blue-1)' }}>
                    {renderValue(item.title)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view details
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {renderValue(item.sourceName)}
                </td>
                <td className="px-6 py-4 text-gray-700">{renderValue(item.dateReceived)}</td>
                <td className="px-6 py-4 text-gray-700">{renderValue(item.quantity)}</td>
                <td className="px-6 py-4 text-gray-700">{renderValue(item.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        onEdit && onEdit(item)
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors bg-transparent hover:bg-transparent"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        onArchive && onArchive(item.id)
                      }}
                      className="p-2 text-gray-500 hover:text-amber-600 rounded-lg transition-colors bg-transparent hover:bg-transparent"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accessions.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentCheckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No accessions found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccessionsTable
