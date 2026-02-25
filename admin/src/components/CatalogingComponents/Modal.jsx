import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'blue',
  showInput = false,
  inputPlaceholder = '',
  inputValue = '',
  onInputChange,
  dark
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      document.body.style.overflow = 'unset'
      setIsAnimating(false)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  // ── Theme Styling ──────────────────────────────────────────
  const modalBg      = dark ? '#0f1f38' : '#ffffff'
  const modalBorder  = dark ? '#1a3356' : '#e2e8f0'
  const footerBg     = dark ? '#0d1d35' : '#f8fafc'
  const textPrimary  = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const inputBg      = dark ? '#0d1d35' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#d1d5db'

  const colorStyles = {
    blue: {
      button: dark ? '#3b82f6' : '#2563eb',
      buttonHover: dark ? '#2563eb' : '#1d4ed8',
      iconBg: dark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
      iconColor: '#3b82f6'
    },
    red: {
      button: dark ? '#ef4444' : '#dc2626',
      buttonHover: dark ? '#dc2626' : '#b91c1c',
      iconBg: dark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
      iconColor: '#ef4444'
    },
    amber: {
      button: dark ? '#f59e0b' : '#d97706',
      buttonHover: dark ? '#d97706' : '#b45309',
      iconBg: dark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
      iconColor: '#f59e0b'
    }
  }

  const colors = colorStyles[confirmColor] || colorStyles.blue

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      opacity: isAnimating ? 1 : 0,
      transition: 'opacity 0.4s ease'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.45s ease'
        }}
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          background: modalBg,
          border: `1px solid ${modalBorder}`,
          borderRadius: '1rem',
          maxWidth: '28rem',
          width: '100%',
          boxShadow: dark ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.45s ease',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.375rem',
            color: textSecondary,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = dark ? '#1a3356' : '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              background: colors.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.45s ease'
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem', color: colors.iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div style={{ flex: 1, marginTop: '0.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: textPrimary }}>
                {title}
              </h3>
              <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: textSecondary, lineHeight: '1.5' }}>
                {message}
              </p>

              {showInput && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textSecondary, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Reason (optional)
                  </label>
                  <textarea
                    value={inputValue}
                    onChange={(e) => onInputChange && onInputChange(e.target.value)}
                    placeholder={inputPlaceholder}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '0.5rem',
                      color: textPrimary,
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          background: footerBg,
          padding: '1rem 1.5rem',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          borderTop: `1px solid ${modalBorder}`,
          transition: 'background 0.45s ease'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: textSecondary,
              background: dark ? 'transparent' : '#ffffff',
              border: `1px solid ${inputBorder}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = dark ? '#1a3356' : '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = dark ? 'transparent' : '#ffffff'}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              background: colors.button,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: dark ? `0 4px 14px ${colors.iconBg}` : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.button}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal