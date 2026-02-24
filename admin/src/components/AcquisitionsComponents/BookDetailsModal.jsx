import React from 'react'
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  Square3Stack3DIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

const BookDetailsModal = ({ book, onClose, dark = false }) => {
  if (!book) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const field = (value) => value || 'N/A'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`rounded-xl w-full max-w-3xl overflow-hidden border ${dark ? 'bg-[#0a1628] border-[#1a3356] shadow-2xl' : 'bg-white border-gray-200 shadow-lg'}`}> 

        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-4 border-b-4 ${dark ? 'border-[#93c5fd] bg-[#1a3356]' : 'border-[#0F61F7] bg-blue-50'}`}>
          <h2 className={`text-lg font-semibold uppercase tracking-wide ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>Accession Details</h2>
          <button
            onClick={onClose}
            className={`transition-colors text-xl font-bold ${dark ? 'text-[#93c5fd] hover:text-white' : 'text-[#154A9A] hover:text-[#0F61F7]'}`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 space-y-8 max-h-[75vh] overflow-y-auto ${dark ? 'text-gray-200' : ''}`}> 

          {/* Accession Info */}
          <div>
            <h3 className={`text-md font-bold mb-3 flex items-center gap-2 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>
              <ClipboardDocumentListIcon className={`w-5 h-5 ${dark ? 'text-[#93c5fd]' : 'text-[#0F61F7]'}`} /> Accession Info
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}> 
              <p><strong>Accession No.:</strong> {field(book.accession_no)}</p>
              <p className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4 text-[#0F61F7]" />
                <span><strong>Date Accessioned:</strong> {formatDate(book.date_accessioned)}</span>
              </p>
            </div>
          </div>

          {/* Book Information */}
          <div>
            <h3 className={`text-md font-bold mb-3 flex items-center gap-2 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>
              <BookOpenIcon className={`w-5 h-5 ${dark ? 'text-[#93c5fd]' : 'text-[#0F61F7]'}`} /> Book Information
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}> 
              <p><strong>Title:</strong> {field(book.title)}</p>
              <p><strong>Author(s):</strong> {field(book.author)}</p>
              <p><strong>Editor:</strong> {field(book.editor)}</p>
              <p><strong>Edition:</strong> {field(book.edition)}</p>
              <p><strong>Publisher:</strong> {field(book.publisher)}</p>
              <p><strong>Date of Publication:</strong> {formatDate(book.date_of_publication)}</p>
              <p><strong>Publication:</strong> {field(book.publication)}</p>
              <p><strong>ISBN:</strong> {field(book.isbn)}</p>
              <p><strong>ISSN:</strong> {field(book.issn)}</p>
              <p><strong>Subjects:</strong> {field(book.subjects)}</p>
            </div>
          </div>

          {/* Physical Details */}
          <div>
            <h3 className={`text-md font-bold mb-3 flex items-center gap-2 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>
              <Square3Stack3DIcon className={`w-5 h-5 ${dark ? 'text-[#93c5fd]' : 'text-[#0F61F7]'}`} /> Physical Details
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}> 
              <p><strong>Extent:</strong> {field(book.extent)}</p>
              <p><strong>Dimensions:</strong> {field(book.dimensions)}</p>
              <p><strong>Other Physical Details:</strong> {field(book.other_physical_details)}</p>
              <p><strong>Accompanying Material:</strong> {field(book.accompanying_material)}</p>
            </div>
          </div>

          {/* Notes */}
          {book.notes_area && (
            <div className={`border-l-4 p-4 rounded-lg shadow-sm ${dark ? 'bg-[#1a3356] border-[#93c5fd]' : 'bg-blue-50 border-[#0F61F7]'}`}>
              <p className={`text-sm font-semibold mb-1 flex items-center gap-2 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>
                <DocumentTextIcon className={`w-4 h-4 ${dark ? 'text-[#93c5fd]' : 'text-[#0F61F7]'}`} /> Notes
              </p>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{book.notes_area}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal