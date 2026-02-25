import { XMarkIcon, ExclamationTriangleIcon, ArchiveBoxIcon, TrashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'archive', // 'archive' or 'delete'
  itemName = '',
  loading = false 
}) => {
  if (!isOpen) return null

  const config = {
    archive: {
      icon: ArchiveBoxIcon,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-100',
      confirmButtonColor: 'bg-amber-600 hover:bg-amber-700',
      title: title || 'Archive Accession',
      message: message || `Are you sure you want to archive this accession${itemName ? ` "${itemName}"` : ''}? This action can be reversed later.`
    },
    delete: {
      icon: TrashIcon,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
      title: title || 'Delete Accession',
      message: message || `Are you sure you want to permanently delete this accession${itemName ? ` "${itemName}"` : ''}? This action cannot be undone.`
    },
    logout: {
      icon: ArrowRightOnRectangleIcon,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      confirmButtonColor: 'bg-blue-600 hover:bg-blue-700',
      title: title || 'Log Out',
      message: message || 'Are you sure you want to log out?'
    }
  }

  const currentConfig = config[type === 'logout' ? 'logout' : type]
  const Icon = currentConfig.icon

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Remove close (X) button */}

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${currentConfig.iconBgColor} mb-4`}>
              <Icon className={`w-6 h-6 ${currentConfig.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {currentConfig.title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-6">
              {currentConfig.message}
            </p>

            {/* Actions: Yes/No buttons */}
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentConfig.confirmButtonColor}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Yes'
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal