import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

function LoginNotification({ dark }) {
  const [notification, setNotification] = useState(() => {
    // Initialize state from sessionStorage
    const storedNotification = sessionStorage.getItem('loginNotification')
    return storedNotification ? JSON.parse(storedNotification) : null
  })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (notification) {
      // Trigger the enter animation
      setTimeout(() => setIsAnimating(true), 10)

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleClose = () => {
    setIsAnimating(false)
    // Wait for exit transition before removing from DOM
    setTimeout(() => {
      setNotification(null)
      sessionStorage.removeItem('loginNotification')
    }, 400)
  }

  // ── Colors ────────────────────────────────────────────────
  const cardBg      = dark ? '#0f1f38' : '#ffffff'
  const cardBorder  = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted   = dark ? '#2e4d70' : '#6b7280'
  const iconBg      = dark ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4'
  const closeHover  = dark ? '#1a3356' : '#f1f5f9'

  if (!notification) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'translateX(0)' : 'translateX(2rem)',
        transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div 
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: '0.75rem',
          padding: '1rem',
          minWidth: '320px',
          maxWidth: '400px',
          boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(0,0,0,0.1)',
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              background: iconBg, 
              borderRadius: '9999px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#22c55e' }} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              color: textPrimary 
            }}>
              Login Successful!
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              color: textSecondary 
            }}>
              Welcome back, <span style={{ fontWeight: 600, color: dark ? '#60a5fa' : 'var(--dark-blue-1)' }}>{notification.username}</span>
            </p>
            <p style={{ 
              margin: '0.25rem 0 0 0', 
              fontSize: '0.75rem', 
              color: textMuted 
            }}>
              Role: <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{notification.role}</span>
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{ 
              flexShrink: 0, 
              background: 'transparent', 
              border: 'none', 
              padding: '0.25rem', 
              borderRadius: '0.375rem', 
              cursor: 'pointer',
              transition: 'background 0.2s ease' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = closeHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: textMuted }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginNotification