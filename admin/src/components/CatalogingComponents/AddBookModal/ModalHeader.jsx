import { XMarkIcon } from '@heroicons/react/24/outline'

const ModalHeader = ({ title, onClose, disabled = false }) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
        {title}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={disabled}
      >
        <XMarkIcon className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  )
}

export default ModalHeader