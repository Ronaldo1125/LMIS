import { useEffect, useState } from 'react'

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'blue',
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

  const modalBg  = dark ? '#0f1f38' : '#ffffff'
  const modalBdr = dark ? '#1a3356' : '#e2e8f0'
  const txt1     = dark ? '#dde8f5' : '#111827'
  const txt2     = dark ? '#6b8cae' : '#6b7280'

  const colorStyles = {
    blue:  { iconBg: dark ? 'rgba(59,130,246,0.15)'  : '#eff6ff',  iconBorder: dark ? 'rgba(59,130,246,0.25)'  : '#bfdbfe',  iconColor: '#3b82f6' },
    red:   { iconBg: dark ? 'rgba(239,68,68,0.15)'   : '#fef2f2',  iconBorder: dark ? 'rgba(239,68,68,0.25)'   : '#fecaca',  iconColor: '#ef4444' },
    amber: { iconBg: dark ? 'rgba(245,158,11,0.15)'  : '#fffbeb',  iconBorder: dark ? 'rgba(245,158,11,0.25)'  : '#fde68a',  iconColor: '#f59e0b' },
  }
  const colors = colorStyles[confirmColor] || colorStyles.blue

  const iconPaths = {
    blue:  'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    red:   'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    amber: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8',
  }
  const iconPath = iconPaths[confirmColor] || iconPaths.blue

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      opacity: isAnimating ? 1 : 0,
      transition: 'opacity 0.35s ease',
    }}>
      <style>{`@keyframes modal-in { from { opacity:0; transform:scale(0.94) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 10,
          background: modalBg,
          border: `1px solid ${modalBdr}`,
          borderRadius: 16,
          maxWidth: '26rem', width: '100%',
          padding: '2rem 1.75rem 1.75rem',
          boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 20px 40px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'modal-in 0.32s cubic-bezier(0.16,1,0.3,1) both',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'background 0.35s ease',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: colors.iconBg,
          border: `1.5px solid ${colors.iconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <svg style={{ width: '1.6rem', height: '1.6rem', color: colors.iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 0.625rem', fontSize: '1.125rem', fontWeight: 700,
          color: txt1, textAlign: 'center',
          fontFamily: "'Sora', sans-serif",
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          margin: '0 0 1.75rem', fontSize: '0.875rem',
          color: txt2, textAlign: 'center', lineHeight: 1.6,
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '0.7rem',
              background: '#0f172a', color: '#ffffff',
              border: 'none', borderRadius: 10,
              fontSize: '0.9375rem', fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.18s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '0.7rem',
              background: '#0f172a', color: '#ffffff',
              border: 'none', borderRadius: 10,
              fontSize: '0.9375rem', fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.18s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal