const FormActions = ({ 
  onCancel, 
  loading = false, 
  submitText = 'Submit',
  loadingText = 'Submitting...',
  cancelText = 'Cancel'
}) => {
  return (
    <div className="mt-8 flex gap-4 justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        disabled={loading}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--secondary-3-medium)' }}
        disabled={loading}
      >
        {loading ? loadingText : submitText}
      </button>
    </div>
  )
}

export default FormActions