import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const AccessionsTable = ({ accessions, onArchive, onDelete, onEdit, onView }) => {
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: 'var(--dark-blue-1)' }}>
            <tr className="border-b border-gray-300">
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-white sticky left-0 z-20 border-r border-gray-300"
                style={{ backgroundColor: 'var(--dark-blue-1)' }}
              >
                Accession No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-300 min-w-[220px]">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-300 min-w-[160px]">
                Author
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                Publisher
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                Date Accessioned
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                ISBN
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {accessions.map((item, index) => (
              <tr
                key={item.id}
                className="group hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onView && onView(item)}
              >
                <td className="px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-gray-100 border-r border-gray-200">
                  <span
                    className="px-3 py-1 rounded-sm text-xs font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'var(--secondary-3-light)',
                      color: 'var(--dark-blue-1)'
                    }}
                  >
                    {renderValue(item.accession_no)}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-gray-200 max-w-[220px]">
                  <div
                    className="font-medium truncate"
                    style={{ color: 'var(--dark-blue-1)' }}
                    title={item.title}
                  >
                    {renderValue(item.title)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view details
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 border-r border-gray-200 max-w-[160px] truncate" title={item.author}>
                  {renderValue(item.author)}
                </td>
                <td className="px-6 py-4 text-gray-700 border-r border-gray-200 max-w-[160px] truncate" title={item.publisher}>
                  {renderValue(item.publisher)}
                </td>
                <td className="px-6 py-4 text-gray-700 border-r border-gray-200 whitespace-nowrap">
                  {formatDate(item.date_accessioned)}
                </td>
                <td className="px-6 py-4 text-gray-700 border-r border-gray-200">
                  {renderValue(item.isbn)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item) }}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-sm transition-colors bg-transparent hover:bg-transparent"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onArchive && onArchive(item) }}
                      className="p-2 text-gray-500 hover:text-amber-600 rounded-sm transition-colors bg-transparent hover:bg-transparent"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item) }}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-sm transition-colors bg-transparent hover:bg-transparent"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
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