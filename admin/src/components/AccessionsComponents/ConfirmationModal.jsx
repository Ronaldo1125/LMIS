import { ArchiveBoxIcon, TrashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'archive',
  itemName = '',
  loading = false,
  dark = false,
}) => {
  if (!isOpen) return null

  const config = {
    archive: {
      icon: ArchiveBoxIcon,
      iconColor: '#d97706',
      iconBg: dark ? 'rgba(245,158,11,0.15)' : '#fef3c7',
      iconBorder: dark ? 'rgba(245,158,11,0.25)' : '#fde68a',
      confirmBg: '#0f172a',
      confirmHover: '#1e293b',
      title: title || 'Archive Accession',
      message: message || `Are you sure you want to archive this accession${itemName ? ` "${itemName}"` : ''}? This action can be reversed later.`,
    },
    delete: {
      icon: TrashIcon,
      iconColor: '#ef4444',
      iconBg: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
      iconBorder: dark ? 'rgba(239,68,68,0.25)' : '#fecaca',
      confirmBg: '#ef4444',
      confirmHover: '#dc2626',
      title: title || 'Delete Accession',
      message: message || `Are you sure you want to permanently delete this accession${itemName ? ` "${itemName}"` : ''}? This action cannot be undone.`,
    },
    logout: {
      icon: ArrowRightOnRectangleIcon,
      iconColor: '#2563eb',
      iconBg: dark ? 'rgba(37,99,235,0.15)' : '#dbeafe',
      iconBorder: dark ? 'rgba(37,99,235,0.25)' : '#bfdbfe',
      confirmBg: '#2563eb',
      confirmHover: '#1d4ed8',
      title: title || 'Log Out',
      message: message || 'Are you sure you want to log out?',
    },
  }

  const cfg = config[type] || config.archive
  const Icon = cfg.icon

  const modalBg   = dark ? '#0f1f38' : '#ffffff'
  const modalBdr  = dark ? '#1a3356' : '#e2e8f0'
  const txt1      = dark ? '#dde8f5' : '#111827'
  const txt2      = dark ? '#6b8cae' : '#6b7280'
  const noBg      = dark ? '#0f172a' : '#0f172a'
  const noText    = '#ffffff'
  const noHover   = dark ? '#1e293b' : '#1e293b'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      background: 'rgba(0,0,0,0.5)',
    }}
      onClick={onClose}
    >
      <style>{`@keyframes cm-in { from { opacity:0; transform:scale(0.94) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: modalBg,
          border: `1px solid ${modalBdr}`,
          borderRadius: 16,
          boxShadow: dark
            ? '0 24px 64px rgba(0,0,0,0.7)'
            : '0 24px 64px rgba(0,0,0,0.15)',
          width: '100%', maxWidth: '26rem',
          padding: '2rem 1.75rem 1.75rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'cm-in 0.28s cubic-bezier(0.16,1,0.3,1) both',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'background 0.35s ease',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: cfg.iconBg,
          border: `1.5px solid ${cfg.iconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <Icon style={{ width: '1.6rem', height: '1.6rem', color: cfg.iconColor }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.125rem', fontWeight: 700,
          color: txt1, margin: '0 0 0.625rem',
          textAlign: 'center', fontFamily: "'Sora', sans-serif",
        }}>
          {cfg.title}
        </h3>

        {/* Message */}
        <p style={{
          fontSize: '0.875rem', color: txt2,
          textAlign: 'center', lineHeight: 1.6,
          margin: '0 0 1.75rem',
        }}>
          {cfg.message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '0.7rem',
              background: noBg, color: noText,
              border: 'none', borderRadius: 10,
              fontSize: '0.9375rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.18s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1e293b' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = noBg }}
          >
            {loading ? (
              <>
                <svg style={{ width: 16, height: 16, animation: 'cm-spin 0.8s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <style>{`@keyframes cm-spin { to { transform: rotate(360deg) } }`}</style>
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : 'Yes'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1, padding: '0.7rem',
              background: noBg, color: noText,
              border: 'none', borderRadius: 10,
              fontSize: '0.9375rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.18s ease',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1e293b' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = noBg }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal