import { 
  BookOpenIcon,
  PencilSquareIcon,
  TrashIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

const BooksTable = ({ books, onEdit, onView, onDelete, onArchive }) => {
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
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
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Call Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white min-w-[240px]">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Author</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">ISBN</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map((book, index) => (
              <tr 
                key={book.id}
                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => onView && onView(book)}
              >
                <td className="px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-gray-50">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--secondary-3-light)',
                      color: 'var(--dark-blue-1)'
                    }}
                  >
                    {renderValue(book.category)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{renderValue(book.call_number)}</td>
                <td className="px-6 py-4 max-w-[360px]">
                  <div className="font-medium truncate" style={{ color: 'var(--dark-blue-1)' }}>
                    {renderValue(book.title)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view details
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{renderValue(book.author)}</td>
                <td className="px-6 py-4 text-gray-600 text-sm font-mono">{renderValue(book.isbn)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(event) => {
                        event.stopPropagation()
                        onEdit && onEdit(book)
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors bg-transparent hover:bg-transparent"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(event) => {
                        event.stopPropagation()
                        const reason = window.prompt(`Why are you archiving "${book.title}"?\n(Optional - press OK to skip)`)
                        if (reason !== null) { // User didn't cancel
                          onArchive && onArchive(book.id, reason || undefined)
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-amber-600 rounded-lg transition-colors bg-transparent hover:bg-transparent"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(event) => {
                        event.stopPropagation()
                        if (window.confirm(`Are you sure you want to permanently delete "${book.title}"? This action cannot be undone.`)) {
                          onDelete && onDelete(book.id)
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg transition-colors bg-transparent hover:bg-transparent"
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

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No books found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksTable