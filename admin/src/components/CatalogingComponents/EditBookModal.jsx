import { useState, useEffect } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Trash2, CheckCircle, FileText, File, Loader } from 'lucide-react'
import FileUploadSection from './AddBookModal/FileUploadSection'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const EditBookModal = ({ isOpen, onClose, onSubmit, editBook, setEditBook, categories }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [existingFiles, setExistingFiles] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [deletingFile, setDeletingFile] = useState({})

  // Fetch existing uploads when modal opens
  useEffect(() => {
    if (isOpen && editBook?.id) {
      fetchExistingFiles(editBook.id)
    }
    // Reset state when modal closes
    if (!isOpen) {
      setSelectedFiles([])
      setUploadError('')
      setExistingFiles([])
    }
  }, [isOpen, editBook?.id])

  const fetchExistingFiles = async (bookId) => {
    setLoadingFiles(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExistingFiles(response.data)
    } catch (err) {
      console.error('Error fetching existing files:', err)
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)

    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'application/x-mobipocket-ebook',
      'application/vnd.amazon.ebook',
      'image/vnd.djvu',
      'image/x-djvu'
    ]
    const allowedExtensions = ['.pdf', '.epub', '.mobi', '.azw3', '.djvu']

    const invalidFiles = files.filter(file => {
      const hasValidMime = allowedTypes.includes(file.type)
      const hasValidExt = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      return !hasValidMime && !hasValidExt
    })

    if (invalidFiles.length > 0) {
      setUploadError('Invalid file type. Only PDF, EPUB, MOBI, AZW3, and DJVU files are allowed.')
      return
    }

    const maxSize = 100 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setUploadError(`File size exceeds 100MB limit: ${oversizedFiles[0].name}`)
      return
    }

    const totalFiles = existingFiles.length + files.length
    if (totalFiles > 5) {
      setUploadError(`Cannot add ${files.length} file(s). Max 5 files total (${existingFiles.length} already uploaded).`)
      return
    }

    setUploadError('')
    setSelectedFiles(files)
  }

  const handleRemoveNewFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadError('')
  }

  const handleDeleteExistingFile = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    setDeletingFile(prev => ({ ...prev, [uploadId]: true }))
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_URL}/uploads/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExistingFiles(prev => prev.filter(f => f.id !== uploadId))
    } catch (err) {
      console.error('Error deleting file:', err)
      setUploadError(err.response?.data?.message || 'Failed to delete file.')
    } finally {
      setDeletingFile(prev => ({ ...prev, [uploadId]: false }))
    }
  }

  const handleSetPrimary = async (uploadId) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(`${API_URL}/uploads/${uploadId}/set-primary`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Refresh files to reflect new primary
      fetchExistingFiles(editBook.id)
    } catch (err) {
      console.error('Error setting primary file:', err)
      setUploadError(err.response?.data?.message || 'Failed to set primary file.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Save book details first
    await onSubmit()

    // Upload new files if any
    if (selectedFiles.length > 0 && editBook?.id) {
      setIsUploading(true)
      setUploadError('')

      try {
        const formData = new FormData()
        selectedFiles.forEach(file => formData.append('files', file))
        // Only set primary if there are no existing files
        if (existingFiles.length === 0) {
          formData.append('setPrimary', 'true')
        }

        const token = localStorage.getItem('authToken')
        await axios.post(`${API_URL}/uploads/${editBook.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        setSelectedFiles([])
        fetchExistingFiles(editBook.id)
      } catch (err) {
        console.error('Error uploading files:', err)
        setUploadError(
          err.response?.data?.message ||
          'Book saved but file upload failed. You can retry uploading.'
        )
      } finally {
        setIsUploading(false)
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    const cls = 'w-5 h-5'
    switch (fileType) {
      case 'pdf':   return <FileText className={`${cls} text-red-500`} />
      case 'epub':  return <File className={`${cls} text-blue-500`} />
      case 'mobi':
      case 'azw3':  return <File className={`${cls} text-orange-500`} />
      case 'djvu':  return <File className={`${cls} text-green-500`} />
      default:      return <File className={cls} />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Edit Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={editBook.category}
                onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.filter(cat => cat !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Number
              </label>
              <input
                type="text"
                value={editBook.callNumber}
                onChange={(e) => setEditBook({ ...editBook, callNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter call number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={editBook.title}
                onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={editBook.author}
                onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editor
              </label>
              <input
                type="text"
                value={editBook.editor}
                onChange={(e) => setEditBook({ ...editBook, editor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Editor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edition
              </label>
              <input
                type="text"
                value={editBook.edition}
                onChange={(e) => setEditBook({ ...editBook, edition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 2nd ed."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication
              </label>
              <input
                type="text"
                value={editBook.publication}
                onChange={(e) => setEditBook({ ...editBook, publication: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Place of publication"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                type="text"
                required
                value={editBook.publisher}
                onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Publisher name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Publication
              </label>
              <input
                type="date"
                value={editBook.dateOfPublication}
                onChange={(e) => setEditBook({ ...editBook, dateOfPublication: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extent of Item
              </label>
              <input
                type="text"
                value={editBook.extent}
                onChange={(e) => setEditBook({ ...editBook, extent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 120 pages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={editBook.dimensions}
                onChange={(e) => setEditBook({ ...editBook, dimensions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 21 cm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Physical Details
              </label>
              <textarea
                rows="2"
                value={editBook.otherPhysicalDetails}
                onChange={(e) => setEditBook({ ...editBook, otherPhysicalDetails: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., illustrations, maps"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accompanying Material
              </label>
              <textarea
                rows="2"
                value={editBook.accompanyingMaterial}
                onChange={(e) => setEditBook({ ...editBook, accompanyingMaterial: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="e.g., 1 CD-ROM, 1 map"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                required
                value={editBook.isbn}
                onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="978-X-XXX-XXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISSN
              </label>
              <input
                type="text"
                value={editBook.issn}
                onChange={(e) => setEditBook({ ...editBook, issn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="XXXX-XXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes Area
              </label>
              <textarea
                rows="3"
                value={editBook.notesArea}
                onChange={(e) => setEditBook({ ...editBook, notesArea: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Additional notes"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <textarea
                rows="2"
                value={editBook.subjects}
                onChange={(e) => setEditBook({ ...editBook, subjects: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Comma-separated subjects"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Copies *
              </label>
              <input
                type="number"
                required
                value={editBook.copies}
                onChange={(e) => setEditBook({ ...editBook, copies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="0"
                min="1"
              />
            </div>
          </div>

          {/* ── Digital Files Section ── */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Digital Files</h3>

            {/* Existing uploaded files */}
            {loadingFiles ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span className="text-sm text-gray-500">Loading files...</span>
              </div>
            ) : existingFiles.length > 0 ? (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Uploaded Files ({existingFiles.length}/5)
                </p>
                {existingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getFileIcon(file.file_type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.original_name}
                          </p>
                          {file.is_primary && (
                            <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              <CheckCircle className="w-3 h-3" />
                              <span>Primary</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatFileSize(file.file_size)} · {file.file_type.toUpperCase()}
                          {file.download_count > 0 && ` · ${file.download_count} download${file.download_count !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      {/* Set as primary button (only for non-primary files) */}
                      {!file.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(file.id)}
                          title="Set as primary"
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingFile(file.id)}
                        disabled={deletingFile[file.id]}
                        title="Delete file"
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 rounded"
                      >
                        {deletingFile[file.id]
                          ? <Loader className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No digital files uploaded yet.</p>
            )}

            {/* Add new files (only if under 5 total) */}
            {existingFiles.length < 5 && (
              <FileUploadSection
                selectedFiles={selectedFiles}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveNewFile}
                error={uploadError}
                loading={isUploading}
              />
            )}

            {existingFiles.length >= 5 && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                Maximum of 5 files reached. Delete a file to upload a new one.
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50"
              style={{ backgroundColor: 'var(--secondary-3-medium)' }}
            >
              {isUploading ? (
                <span className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal