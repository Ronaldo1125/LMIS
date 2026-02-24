import { useRef, useEffect } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

const getNotificationColor = (type) => {
  switch (type) {
    case 'success': return 'bg-green-50 text-green-600'
    case 'warning': return 'bg-yellow-50 text-yellow-600'
    default: return 'bg-blue-50 text-blue-600'
  }
}

const NotificationPanel = ({ isOpen, onClose, notifications, isSticky }) => {
  const panelRef = useRef(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] overflow-hidden"
      style={{ right: '1rem', top: isSticky ? '4.5rem' : '5.5rem' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors">
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <BellIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                    {!notification.read && (
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button className="text-sm text-[var(--dark-blue-2)] font-semibold hover:text-[var(--dark-blue-1)] transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  )
}

export default NotificationPanel