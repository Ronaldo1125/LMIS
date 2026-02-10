import { useState, useEffect } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Download, FileText, File, CheckCircle, Loader } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── BookFilesViewer (embedded) ───────────────────────────────────────────────

const BookFilesViewer = ({ bookId }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState({})

  useEffect(() => {
    if (bookId) fetchFiles()
  }, [bookId])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFiles(response.data)
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (uploadId, fileName) => {
    setDownloading((prev) => ({ ...prev, [uploadId]: true }))
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/${uploadId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      fetchFiles()
    } catch (err) {
      console.error('Error downloading file:', err)
      alert(err.response?.data?.message || 'Error downloading file')
    } finally {
      setDownloading((prev) => ({ ...prev, [uploadId]: false }))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    const iconClass = 'w-6 h-6'
    switch (fileType) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />
      case 'epub':
        return <FileText className={`${iconClass} text-green-500`} />
      case 'mobi':
      case 'azw3':
        return <FileText className={`${iconClass} text-orange-500`} />
      case 'djvu':
        return <File className={`${iconClass} text-purple-500`} />
      default:
        return <File className={`${iconClass} text-gray-500`} />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        No digital files available for this book
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Digital Files ({files.length})
      </h3>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3 min-w-0">
              {getFileIcon(file.file_type)}
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.original_name}
                  </p>
                  {file.is_primary && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5 flex-wrap gap-y-0.5">
                  <span>{formatFileSize(file.file_size)}</span>
                  <span>·</span>
                  <span>{file.file_type.toUpperCase()}</span>
                  {file.download_count > 0 && (
                    <>
                      <span>·</span>
                      <span>
                        {file.download_count} download{file.download_count !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span>Uploaded {formatDate(file.upload_date)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(file.id, file.original_name)}
              disabled={downloading[file.id]}
              className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-sm"
            >
              {downloading[file.id] ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ViewBookModal ────────────────────────────────────────────────────────────

const ViewBookModal = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

  const details = [
    { label: 'Category', value: book.category },
    { label: 'Call Number', value: book.call_number },
    { label: 'Title', value: book.title },
    { label: 'Author', value: book.author },
    { label: 'Editor', value: book.editor },
    { label: 'Edition', value: book.edition },
    { label: 'Publication', value: book.publication },
    { label: 'Publisher', value: book.publisher },
    { label: 'Date of Publication', value: book.date_of_publication },
    { label: 'Extent of Item', value: book.extent },
    { label: 'Dimensions', value: book.dimensions },
    { label: 'Other Physical Details', value: book.other_physical_details },
    { label: 'Accompanying Material', value: book.accompanying_material },
    { label: 'ISBN', value: book.isbn },
    { label: 'ISSN', value: book.issn },
    { label: 'Notes Area', value: book.notes_area },
    { label: 'Subjects', value: book.subjects },
    { label: 'Copies', value: book.copies },
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
              Book Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">{renderValue(book.title)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Book Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-gray-700">{renderValue(item.value)}</p>
              </div>
            ))}
          </div>

          {/* Digital Files Section */}
          <div className="border-t border-gray-200 pt-6">
            <BookFilesViewer bookId={book.id} />
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBookModal