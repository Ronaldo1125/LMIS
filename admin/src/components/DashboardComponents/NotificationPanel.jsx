import { useRef, useEffect, useState } from 'react'
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

const NotificationPanel = ({ isOpen, onClose, notifications, isSticky, dark }) => {
  const panelRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Handle local animation state for smooth entry/exit
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // ── Colors ────────────────────────────────────────────────
  const panelBg      = dark ? '#0f1f38' : '#ffffff'
  const panelBorder  = dark ? '#1a3356' : '#e2e8f0'
  const headerBg     = dark ? '#0d1d35' : '#f8fafc'
  const textPrimary  = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted     = dark ? '#2e4d70' : '#9ca3af'
  const itemHover    = dark ? '#1a3356' : '#f8fafc'
  const unreadBg     = dark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'
  const closeHover   = dark ? '#1a3356' : '#f1f5f9'

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success': return { bg: dark ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4', text: '#22c55e' }
      case 'warning': return { bg: dark ? 'rgba(234, 179, 8, 0.15)' : '#fefce8', text: '#eab308' }
      default: return { bg: dark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff', text: '#3b82f6' }
    }
  }

  if (!isOpen && !isAnimating) return null

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        right: '1rem',
        top: isSticky ? '4.5rem' : '5.5rem',
        width: '24rem',
        background: panelBg,
        border: `1px solid ${panelBorder}`,
        borderRadius: '0.75rem',
        boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(0,0,0,0.1)',
        zIndex: 100,
        overflow: 'hidden',
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.45s ease, border-color 0.45s ease',
        transformOrigin: 'top right'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: `1px solid ${panelBorder}`,
        background: headerBg,
        transition: 'background 0.45s ease'
      }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: textPrimary }}>Notifications</h3>
          {unreadCount > 0 && (
            <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            padding: '0.375rem', 
            background: 'transparent', 
            border: 'none', 
            borderRadius: '0.5rem', 
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = closeHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <XMarkIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary }} />
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <BellIcon style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 0.5rem', color: textMuted, opacity: 0.5 }} />
            <p style={{ fontSize: '0.875rem', color: textSecondary }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const colors = getNotificationStyles(notification.type)
            return (
              <div
                key={notification.id}
                style={{
                  padding: '1rem',
                  borderBottom: `1px solid ${panelBorder}`,
                  background: !notification.read ? unreadBg : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = itemHover}
                onMouseLeave={e => e.currentTarget.style.background = !notification.read ? unreadBg : 'transparent'}
              >
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: colors.bg,
                      color: colors.text
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: textPrimary }}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span style={{ flexShrink: 0, width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '9999px', marginTop: '0.375rem' }} />
                      )}
                    </div>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: textSecondary, lineHeight: '1.25rem' }}>
                      {notification.message}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: textMuted }}>
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.75rem',
        background: headerBg,
        borderTop: `1px solid ${panelBorder}`,
        textAlign: 'center'
      }}>
        <button style={{
          fontSize: '0.875rem',
          color: dark ? '#60a5fa' : 'var(--dark-blue-2)',
          fontWeight: 600,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}>
          View all notifications
        </button>
      </div>
    </div>
  )
}

export default NotificationPanel