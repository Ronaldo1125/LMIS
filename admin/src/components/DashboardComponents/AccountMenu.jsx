import { useRef, useEffect, useState } from 'react'

const getRoleLabel = (r) => {
  switch (r) {
    case 'admin': return 'Administrator'
    case 'librarian': return 'Librarian'
    case 'staff': return 'Staff'
    case 'patron': return 'Patron'
    default: return r
  }
}

const AccountMenu = ({ isOpen, onClose, user, isSticky, onMyProfile, onHelpSupport, dark }) => {
  const menuRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const fullName = user?.full_name || user?.username || 'Unknown'
  const username = user?.username || ''
  const role = user?.role || ''
  const email = user?.email || `${username}@lmis-dro5.gov`
  const avatarLetter = fullName.charAt(0).toUpperCase()

  // Sync animation state with isOpen
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // ── Colors (Matching previous components) ──────────────────
  const menuBg       = dark ? '#0f1f38' : '#ffffff'
  const menuBorder   = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#374151'
  const textSecondary = dark ? '#6b8cae' : '#6b7280'
  const itemHover    = dark ? '#1a3356' : '#f9fafb'
  const bannerBg     = dark 
    ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)' 
    : 'linear-gradient(135deg, var(--dark-blue-1) 0%, var(--dark-blue-2) 100%)'

  if (!isOpen && !isAnimating) return null

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        right: '1rem',
        top: isSticky ? '4.5rem' : '5.5rem',
        width: '16rem',
        background: menuBg,
        border: `1px solid ${menuBorder}`,
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
      {/* Profile banner */}
      <div style={{ padding: '1.25rem', background: bannerBg, transition: 'background 0.45s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '3rem', height: '3rem', borderRadius: '9999px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.125rem' }}>{avatarLetter}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fullName}
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email}
            </p>
            <span style={{ 
              display: 'inline-block', marginTop: '0.375rem', padding: '0.125rem 0.5rem', 
              borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.15)', 
              color: '#ffffff', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em'
            }}>
              {getRoleLabel(role)}
            </span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '0.5rem 0' }}>
        <button
          onClick={onMyProfile}
          style={{
            width: '100%', padding: '0.625rem 1rem', background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
            textAlign: 'left', transition: 'background 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = itemHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', color: textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary }}>My Profile</span>
        </button>

        <button
          onClick={onHelpSupport}
          style={{
            width: '100%', padding: '0.625rem 1rem', background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
            textAlign: 'left', transition: 'background 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = itemHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', color: textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary }}>Help & Support</span>
        </button>
      </div>

      {/* Divider and Logout option - Optional, but keeps it consistent with most Account Menus */}
      <div style={{ borderTop: `1px solid ${menuBorder}`, margin: '0.25rem 0', transition: 'border-color 0.45s ease' }} />
      <button
        style={{
          width: '100%', padding: '0.625rem 1rem', background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
          textAlign: 'left', transition: 'background 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = itemHover}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#ef4444' }}>Sign Out</span>
      </button>
    </div>
  )
}

export default AccountMenu