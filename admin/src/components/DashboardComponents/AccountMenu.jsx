import { useRef, useEffect, useState } from 'react'
import { UserCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const getRoleLabel = (r) => {
  switch (r) {
    case 'admin':     return 'Administrator'
    case 'librarian': return 'Librarian'
    case 'staff':     return 'Staff'
    case 'patron':    return 'Patron'
    default:          return r
  }
}

const AccountMenu = ({ isOpen, onClose, user, isSticky, onMyProfile, onHelpSupport, dark }) => {
  const menuRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const fullName     = user?.full_name || user?.username || 'Unknown'
  const role         = user?.role || ''
  const avatarUrl    = user?.avatar || null
  const avatarLetter = fullName.charAt(0).toUpperCase()

  useEffect(() => {
    if (isOpen) { setTimeout(() => setIsAnimating(true), 10) }
    else { setIsAnimating(false) }
  }, [isOpen])

  // Reset avatar error when user changes
  useEffect(() => { setAvatarError(false) }, [user?.avatar])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // ── Colors ────────────────────────────────────────────────────────────────
  const menuBg        = dark ? '#0f1f38' : '#ffffff'
  const menuBorder    = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const itemHover     = dark ? '#1a3356' : '#f1f5f9'
  const divider       = dark ? '#1a3356' : '#e2e8f0'

  if (!isOpen && !isAnimating) return null

  const MenuItem = ({ onClick, icon: Icon, label }) => {
    const [hover, setHover] = useState(false)
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', padding: '0.625rem 1rem',
          background: hover ? itemHover : 'transparent',
          border: 'none', display: 'flex', alignItems: 'center',
          gap: '0.75rem', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
      >
        <Icon style={{ width: '1.125rem', height: '1.125rem', color: textSecondary, flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary }}>{label}</span>
      </button>
    )
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        right: '1rem',
        top: isSticky ? '4.5rem' : '5.5rem',
        width: '17rem',
        background: menuBg,
        border: `1px solid ${menuBorder}`,
        borderRadius: '0.75rem',
        boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(0,0,0,0.12)',
        zIndex: 100,
        overflow: 'hidden',
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        transition: 'opacity 0.2s ease, transform 0.2s ease, background 0.45s ease, border-color 0.45s ease',
        transformOrigin: 'top right',
      }}
    >
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: '1.25rem',
        background: dark
          ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)'
          : 'linear-gradient(135deg, #154A9A 0%, #1d6abf 100%)',
        transition: 'background 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar */}
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '9999px',
            background: 'rgba(255,255,255,0.18)',
            border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
          }}>
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={fullName}
                onError={() => setAvatarError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.125rem' }}>
                {avatarLetter}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#ffffff', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fullName}
            </h4>
            <span style={{
              display: 'inline-block', marginTop: '0.35rem',
              padding: '0.1rem 0.5rem', borderRadius: '999px',
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff', fontSize: '0.6rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {getRoleLabel(role)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div style={{ height: '1px', background: divider, transition: 'background 0.45s ease' }} />

      {/* ── Menu Items ──────────────────────────────────────────────────── */}
      <div style={{ padding: '0.375rem 0' }}>
        <MenuItem onClick={onMyProfile}    icon={UserCircleIcon}          label="My Profile"     />
        <MenuItem onClick={onHelpSupport}  icon={QuestionMarkCircleIcon}  label="Help & Support" />
      </div>
    </div>
  )
}

export default AccountMenu