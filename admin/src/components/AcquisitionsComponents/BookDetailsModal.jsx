import React from 'react'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const BookDetailsModal = ({ book, onClose }) => {
  if (!book) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4" style={{ backgroundColor: 'var(--dark-blue-1)' }}>
          <h2 className="text-lg font-semibold text-white">Book Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-6">
            <div className="w-32 h-48 rounded-lg overflow-hidden bg-gray-100 shadow">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300 mt-12" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold text-[#154A9A]">{book.title}</h3>
              <p className="text-gray-700">Author: {book.author}</p>
              <p className="text-gray-700">Category: {book.category}</p>
              <p className="text-gray-700">Call Number: {book.callNumber}</p>
              <p className="text-gray-700">ISBN: {book.isbn}</p>
              <p className="text-gray-700">Acquisition Date: {book.acquisitionDate}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {book.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal