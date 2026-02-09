import ModalHeader from './AddBookModal/ModalHeader'
import ErrorAlert from './AddBookModal/ErrorAlert'
import BookFormFields from './AddBookModal/BookFormFields'
import FormActions from './AddBookModal/FormActions'
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader 
          title="Add New Book" 
          onClose={onClose} 
          disabled={loading} 
        />

        <form onSubmit={handleSubmit} className="p-6">
          <ErrorAlert message={error} />

          <BookFormFields
            formData={formData}
            onChange={setFormData}
            categories={categories}
            loading={loading}
          />

          <FormActions
            onCancel={onClose}
            loading={loading}
            submitText="Add Book"
            loadingText="Adding..."
          />
        </form>
      </div>
    </div>
  )
}

export default AddBookModal