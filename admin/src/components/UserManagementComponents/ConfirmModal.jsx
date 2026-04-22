import React from 'react'

function ConfirmModal({ title, message, onConfirm, onCancel, dark }) {
  const overlayBg = dark ? 'rgba(10,22,40,0.8)' : 'rgba(0,0,0,0.5)'
  const modalBg = dark ? '#0f1f38' : '#ffffff'
  const borderColor = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const cancelBtnBg = dark ? 'rgba(148,163,184,0.15)' : '#f1f5f9'
  const cancelBtnColor = dark ? '#94a3b8' : '#475569'
  const confirmBtnBg = '#ef4444'
  const confirmBtnColor = '#ffffff'

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: modalBg, border: `1px solid ${borderColor}`, borderRadius: '0.75rem',
        padding: '2rem', maxWidth: '28rem', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, margin: '0 0 1rem 0' }}>
          {title}
        </h3>
        <p style={{ color: textSecondary, margin: '0 0 2rem 0', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
              background: cancelBtnBg, color: cancelBtnColor, border: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(148,163,184,0.25)' : '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = cancelBtnBg}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
              background: confirmBtnBg, color: confirmBtnColor, border: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.background = confirmBtnBg}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal