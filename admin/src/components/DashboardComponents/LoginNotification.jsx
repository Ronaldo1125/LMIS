import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

function LoginNotification() {
  const [notification, setNotification] = useState(() => {
    // Initialize state from sessionStorage
    const storedNotification = sessionStorage.getItem('loginNotification')
    return storedNotification ? JSON.parse(storedNotification) : null
  })

  useEffect(() => {
    if (notification) {
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null)
        sessionStorage.removeItem('loginNotification')
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleClose = () => {
    setNotification(null)
    sessionStorage.removeItem('loginNotification')
  }

  if (!notification) return null

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in">
      <div className="bg-white rounded-lg shadow-xl border border-green-200 p-4 min-w-[320px] max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Login Successful!
            </p>
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-medium">{notification.username}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Role: <span className="font-medium capitalize">{notification.role}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

        <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default LoginNotification