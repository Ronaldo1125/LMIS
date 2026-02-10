import React from 'react'
import { BookOpenIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

const BookDetailsModal = ({ book, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-4 border-[#0F61F7] bg-blue-50">
          <h2 className="text-lg font-semibold text-[#154A9A] uppercase tracking-wide">
            Book Details
          </h2>
          <button
            onClick={onClose}
            className="text-[#154A9A] hover:text-[#0F61F7] transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Book Information */}
          <div>
            <h3 className="text-md font-bold text-[#154A9A] mb-3 flex items-center gap-2">
              📘 Book Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Author(s):</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
              <p><strong>Edition:</strong> {book.edition || 'N/A'}</p>
              <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
              <p><strong>Year of Publication:</strong> {book.year || 'N/A'}</p>
              <p><strong>Subject / Category:</strong> {book.category || 'N/A'}</p>
              <p><strong>Language:</strong> {book.language || 'N/A'}</p>
            </div>
          </div>

          {/* Acquisition Details */}
          <div>
            <h3 className="text-md font-bold text-[#154A9A] mb-3 flex items-center gap-2">
              📥 Acquisition Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><strong>Method:</strong> {book.acquisitionMethod || 'N/A'}</p>
              <p><strong>Supplier / Donor:</strong> {book.supplier || 'N/A'}</p>
              <p><strong>Request Source:</strong> {book.requestSource || 'N/A'}</p>
              <p><strong>Request Date:</strong> {formatDate(book.requestDate)}</p>
              <p><strong>Approval Status:</strong> {book.approvalStatus || 'Pending'}</p>
              <p className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4 text-[#0F61F7]" />
                <span><strong>Created:</strong> {formatDate(book.createdAt || book.dateAdded)}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border-l-4 border-[#0F61F7] p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm leading-relaxed">
              {book.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal