import { useState } from 'react'
import api from '../../utils/api'
import ModalHeader from './AddBookModal/ModalHeader'
import ErrorAlert from './AddBookModal/ErrorAlert'
import BookFormFields from './AddBookModal/BookFormFields'
import FormActions from './AddBookModal/FormActions'
import FileUploadSection from './AddBookModal/FileUploadSection'
import { useBookForm } from './AddBookModal/UseBookForm'

const AddBookModal = ({ isOpen, onClose, onBookAdded, dark = false }) => {
  const {
    categories,
    loading,
    error,
    formData,
    setFormData,
    handleSubmit
  } = useBookForm(isOpen, onClose, onBookAdded)

  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = [
      'application/pdf', 'application/epub+zip',
      'application/x-mobipocket-ebook', 'application/vnd.amazon.ebook',
      'image/vnd.djvu', 'image/x-djvu'
    ]
    const allowedExtensions = ['.pdf', '.epub', '.mobi', '.azw3', '.djvu']
    const invalidFiles = files.filter(file =>
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    )
    if (invalidFiles.length > 0) { setUploadError('Invalid file type. Only PDF, EPUB, MOBI, AZW3, and DJVU files are allowed.'); return }
    const maxSize = 100 * 1024 * 1024
    if (files.some(f => f.size > maxSize)) { setUploadError('File size exceeds 100MB limit.'); return }
    if (files.length > 5) { setUploadError('Maximum 5 files allowed per upload.'); return }
    setUploadError('')
    setSelectedFiles(files)
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadError('')
  }

  const handleSubmitWithFiles = async (e) => {
    e.preventDefault()
    try {
      const bookId = await handleSubmit(e)
      if (!bookId) return
      if (selectedFiles.length > 0) {
        setIsUploading(true)
        setUploadError('')
        const fd = new FormData()
        selectedFiles.forEach(file => fd.append('files', file))
        fd.append('setPrimary', 'true')
        try {
          await api.post(`/uploads/${bookId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        } catch (uploadErr) {
          setUploadError(uploadErr.response?.data?.message || 'Book created but file upload failed. You can add files later.')
        } finally {
          setIsUploading(false)
        }
      }
      setSelectedFiles([])
      setUploadError('')
      onClose()
      if (onBookAdded) onBookAdded()
    } catch (err) {
      console.error('Error in form submission:', err)
    }
  }

  if (!isOpen) return null

  // ── Colors (matches AddAccessionModal exactly) ─────────────
  const modalBg      = dark ? '#0f1f38' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'

  const isLoading = loading || isUploading

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', zIndex: 50,
    }}>
      <div style={{
        background: modalBg,
        borderRadius: '1rem',
        boxShadow: dark
          ? '0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.03) inset'
          : '0 24px 64px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: '48rem',
        maxHeight: '90vh', overflowY: 'auto',
        border: dark ? `1px solid ${headerBorder}` : 'none',
        transition: 'background 0.45s ease',
      }}>

        <ModalHeader
          title="Add New Book"
          onClose={onClose}
          disabled={isLoading}
          dark={dark}
        />

        <form onSubmit={handleSubmitWithFiles} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <ErrorAlert message={error} dark={dark} />

          <BookFormFields
            formData={formData}
            onChange={setFormData}
            categories={categories}
            loading={isLoading}
            dark={dark}
          />

          <FileUploadSection
            selectedFiles={selectedFiles}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            error={uploadError}
            loading={isLoading}
            dark={dark}
          />

          <FormActions
            onCancel={onClose}
            loading={isLoading}
            submitText="Add Book"
            loadingText={isUploading ? 'Uploading Files...' : 'Adding...'}
            dark={dark}
          />

        </form>
      </div>
    </div>
  )
}

export default AddBookModal