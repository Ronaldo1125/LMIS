import { useState } from 'react'
import api from '../../utils/api' // ✅ Import configured axios
import ModalHeader from './AddBookModal/ModalHeader'
import ErrorAlert from './AddBookModal/ErrorAlert'
import BookFormFields from './AddBookModal/BookFormFields'
import FormActions from './AddBookModal/FormActions'
import FileUploadSection from './AddBookModal/FileUploadSection'
import { useBookForm } from './AddBookModal/UseBookForm'

const AddBookModal = ({ isOpen, onClose, onBookAdded }) => {
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

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file types
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
      const hasValidExt = allowedExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
      return !hasValidMime && !hasValidExt
    })
    
    if (invalidFiles.length > 0) {
      setUploadError('Invalid file type. Only PDF, EPUB, MOBI, AZW3, and DJVU files are allowed.')
      return
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setUploadError(`File size exceeds 100MB limit: ${oversizedFiles[0].name}`)
      return
    }

    // Validate max 5 files
    if (files.length > 5) {
      setUploadError('Maximum 5 files allowed per upload.')
      return
    }

    setUploadError('')
    setSelectedFiles(files)
  }

  // Remove selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadError('')
  }

  // Enhanced submit handler with file upload
  const handleSubmitWithFiles = async (e) => {
    e.preventDefault()
    
    try {
      // First, submit the book form and get the bookId
      const bookId = await handleSubmit(e)
      
      if (!bookId) {
        // Book creation failed, error is already set in useBookForm
        return
      }

      // If files are selected, upload them
      if (selectedFiles.length > 0) {
        setIsUploading(true)
        setUploadError('')

        const formData = new FormData()
        selectedFiles.forEach(file => {
          formData.append('files', file)
        })
        formData.append('setPrimary', 'true') // Set first file as primary

        try {
          const response = await api.post(
            `/uploads/${bookId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )

          console.log('Files uploaded successfully:', response.data)
        } catch (uploadErr) {
          console.error('Error uploading files:', uploadErr)
          setUploadError(
            uploadErr.response?.data?.message || 
            'Book created but file upload failed. You can add files later.'
          )
          // Don't return here - still want to close modal and refresh
        } finally {
          setIsUploading(false)
        }
      }

      // Reset files
      setSelectedFiles([])
      setUploadError('')
      
      // Close modal
      onClose()
      
      // Trigger refresh
      if (onBookAdded) {
        onBookAdded()
      }
      
    } catch (err) {
      console.error('Error in form submission:', err)
      // Error is already handled in useBookForm
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader 
          title="Add New Book" 
          onClose={onClose} 
          disabled={loading || isUploading} 
        />

        <form onSubmit={handleSubmitWithFiles} className="p-6">
          <ErrorAlert message={error} />

          <BookFormFields
            formData={formData}
            onChange={setFormData}
            categories={categories}
            loading={loading || isUploading}
          />

          {/* File Upload Section */}
          <FileUploadSection
            selectedFiles={selectedFiles}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            error={uploadError}
            loading={loading || isUploading}
          />

          <FormActions
            onCancel={onClose}
            loading={loading || isUploading}
            submitText={isUploading ? 'Uploading Files...' : 'Add Book'}
            loadingText={isUploading ? 'Uploading Files...' : 'Adding...'}
          />
        </form>
      </div>
    </div>
  )
}

export default AddBookModal