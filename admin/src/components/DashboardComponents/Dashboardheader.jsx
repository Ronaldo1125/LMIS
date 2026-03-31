import { MagnifyingGlassIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import AccountMenu from './AccountMenu'

const DashboardHeader = ({ user, setCurrentView, dark }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('main')
      if (scrollContainer) setIsSticky(scrollContainer.scrollTop > 20)
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll)
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const handleMyProfile = () => {
    setShowAccountMenu(false)
    setCurrentView('profile')
  }

  const handleHelpSupport = () => {
    setShowAccountMenu(false)
    setCurrentView('help')
  }

  // ── Colors ────────────────────────────────────────────────
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const titleColor   = dark ? '#dde8f5' : 'var(--dark-blue-1)'
  const subtitleColor = dark ? '#6b8cae' : '#4b5563'
  const clockBg      = dark ? '#081422' : '#f8fafc'
  const clockBorder  = dark ? '#1a3356' : '#e2e8f0'
  const clockText    = dark ? '#6b8cae' : '#374151'
  const clockTime    = dark ? '#93c5fd' : 'var(--secondary-4-grey)'
  const clockDivider = dark ? '#1a3356' : '#d1d5db'
  const inputBg      = dark ? '#081422' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#d1d5db'
  const inputText    = dark ? '#dde8f5' : '#1f2937'
  const inputPlaceholder = dark ? '#2e4d70' : '#9ca3af'
  const iconBtnBg    = dark ? '#0f1f38' : '#f8fafc'
  const iconBtnBorder = dark ? '#1a3356' : '#e2e8f0'
  const iconColor    = dark ? '#93c5fd' : 'var(--dark-blue-2)'

  const iconBtnStyle = {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    background: iconBtnBg,
    border: `1px solid ${iconBtnBorder}`,
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.2s ease, border-color 0.2s ease',
    outline: 'none',
  }

  return (
    <div style={{
      background: headerBg,
      border: `1px solid ${isSticky ? headerBorder : 'transparent'}`,
      borderRadius: isSticky ? '0' : '0.5rem',
      boxShadow: isSticky
        ? (dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)')
        : (dark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'),
      padding: '1rem',
      marginBottom: '1.5rem',
      position: 'sticky', top: 0, zIndex: 50,
      transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.3s ease, border-radius 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <img
            src="/LOGO.svg"
            alt="LMIS Logo"
            style={{
              width: isSticky ? '2.5rem' : '3rem',
              height: isSticky ? '2.5rem' : '3rem',
              transition: 'all 0.3s ease',
              filter: dark ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <div>
            <h1 style={{
              fontWeight: 700,
              color: titleColor,
              fontSize: isSticky ? '1.25rem' : '1.5rem',
              margin: 0,
              transition: 'all 0.3s ease',
            }}>
              LMIS - DRO5
            </h1>
            <p style={{
              fontSize: '0.75rem',
              color: subtitleColor,
              margin: 0,
              maxHeight: isSticky ? 0 : '2.5rem',
              opacity: isSticky ? 0 : 1,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}>
              Library Management Information System
            </p>
          </div>
        </div>

        {/* Center — Clock (only when sticky) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          background: clockBg,
          border: `1px solid ${clockBorder}`,
          opacity: isSticky ? 1 : 0,
          transform: isSticky ? 'translateY(0) scale(1)' : 'translateY(-1rem) scale(0.95)',
          pointerEvents: isSticky ? 'auto' : 'none',
          position: isSticky ? 'relative' : 'absolute',
          transition: 'all 0.3s ease',
        }}>
          <CalendarIcon style={{ width: '1rem', height: '1rem', color: clockTime }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 500, color: clockText }}>{formatDate(currentTime)}</span>
            <span style={{ width: '1px', height: '1rem', background: clockDivider }} />
            <span style={{ fontWeight: 600, color: clockTime, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '2.25rem', paddingRight: '0.75rem',
                paddingTop: '0.5rem', paddingBottom: '0.5rem',
                fontSize: '0.875rem', borderRadius: '0.5rem',
                border: `1px solid ${inputBorder}`,
                background: inputBg, color: inputText,
                width: isSticky ? '12rem' : '16rem',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--dark-blue-2)'; e.target.style.boxShadow = '0 0 0 2px rgba(15,97,247,0.2)' }}
              onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none' }}
            />
            <MagnifyingGlassIcon style={{ width: '1rem', height: '1rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: inputPlaceholder }} />
          </div>

          {/* Account */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountMenu((prev) => !prev)}
              style={iconBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--dark-blue-1)'; e.currentTarget.style.borderColor = 'var(--dark-blue-1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = iconBtnBg; e.currentTarget.style.borderColor = iconBtnBorder }}
            >
              <UserCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
            </button>

            <AccountMenu
              isOpen={showAccountMenu}
              onClose={() => setShowAccountMenu(false)}
              user={user}
              isSticky={isSticky}
              onMyProfile={handleMyProfile}
              onHelpSupport={handleHelpSupport}
              dark={dark}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardHeader