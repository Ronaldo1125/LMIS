import { XMarkIcon } from '@heroicons/react/24/outline'

const ModalHeader = ({ title, onClose, disabled = false, dark = false }) => {
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const textSecondary = dark ? '#6b8cae' : '#64748b'

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: headerBg,
      borderBottom: `1px solid ${headerBorder}`,
      padding: '1rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderRadius: '1rem 1rem 0 0',
      transition: 'background 0.45s ease, border-color 0.45s ease',
    }}>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>
        {title}
      </h2>
      <button
        onClick={onClose}
        disabled={disabled}
        style={{
          padding: '0.5rem', background: 'transparent', border: 'none',
          borderRadius: '0.5rem', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease', opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: textSecondary }} />
      </button>
    </div>
  )
}

export default ModalHeader