import {
  HomeIcon,
  BookOpenIcon,
  DocumentPlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ isOpen, setIsSidebarOpen, currentView, setCurrentView, dark }) => {
  // Main navigation items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'cataloging', label: 'Cataloging', icon: BookOpenIcon },
    { id: 'accessions', label: 'Accessions', icon: DocumentPlusIcon },
    { id: 'acquisitions', label: 'Acquisitions', icon: ClipboardDocumentCheckIcon },
    { id: 'news', label: 'Announcements', icon: NewspaperIcon },
    { id: 'user-management', label: 'User Management', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ]

  // Footer items (only Logout now)
  const footerItems = [
    { id: 'logout', label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ]

  // Dark mode sidebar colors — deep navy matching MyProfile
  const sidebarBg     = dark ? '#0a1628' : '#154A9A'
  const activeBg      = dark ? '#1a3356' : '#0F61F7'
  const hoverBg       = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'
  const borderColor   = dark ? '#1a3356' : 'rgba(255,255,255,0.10)'
  const toggleBtnBg   = dark ? '#0f1f38' : '#ffffff'
  const toggleBtnBorder = dark ? '#1a3356' : '#e2e8f0'
  const toggleIconColor = dark ? '#93c5fd' : '#374151'

  return (
    <aside
      style={{
        flexShrink: 0,
        background: sidebarBg,
        color: '#ffffff',
        width: isOpen ? '16rem' : '5rem',
        transition: 'width 0.3s ease, background 0.45s ease',
        position: 'relative',
        boxShadow: dark ? '2px 0 20px rgba(0,0,0,0.4)' : '2px 0 10px rgba(0,0,0,0.1)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isOpen)}
        style={{
          position: 'absolute', right: 0, top: '50%',
          transform: 'translate(50%, -50%)',
          background: toggleBtnBg,
          border: `1px solid ${toggleBtnBorder}`,
          borderRadius: '50%',
          width: '2rem', height: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
          boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.15)',
          transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
          padding: 0,
        }}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <ChevronDoubleLeftIcon style={{ width: '1.25rem', height: '1.25rem', color: toggleIconColor }} />
        ) : (
          <ChevronDoubleRightIcon style={{ width: '1.25rem', height: '1.25rem', color: toggleIconColor }} />
        )}
      </button>

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Logo Section */}
        <div style={{
          padding: '1rem',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex', alignItems: 'center',
          justifyContent: isOpen ? 'flex-start' : 'center',
          transition: 'border-color 0.45s ease',
        }}>
          <img
            src="/LOGO.svg"
            alt="LMIS Logo"
            style={{ width: '3rem', height: '3rem', flexShrink: 0, filter: 'brightness(0) invert(1)' }}
          />
          <div style={{
            display: 'flex', flexDirection: 'column', marginLeft: '0.75rem',
            opacity: isOpen ? 1 : 0,
            width: isOpen ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease',
          }}>
            <h1 style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.2, margin: 0 }}>
              Library Management
            </h1>
            <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', lineHeight: 1.2, margin: 0 }}>
              Information System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: isActive ? activeBg : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  border: 'none', cursor: 'pointer',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '0.75rem' : 0,
                  boxShadow: isActive && dark ? '0 2px 12px rgba(0,0,0,0.3)' : isActive ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                  transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                title={item.label}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                <span style={{
                  fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap',
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'opacity 0.3s ease, width 0.3s ease',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'border-color 0.45s ease' }}>
          {footerItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            const isLogout = item.id === 'logout'

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: isActive ? activeBg : 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  border: 'none', cursor: 'pointer',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '0.75rem' : 0,
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isLogout ? 'rgba(239,68,68,0.2)' : hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                title={item.label}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                <span style={{
                  fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap',
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'opacity 0.3s ease, width 0.3s ease',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Version Info */}
          <div style={{
            fontSize: '0.625rem', color: 'rgba(255,255,255,0.6)',
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, height 0.3s ease',
          }}>
            <p style={{ margin: 0 }}>© 2026 LMIS DEPDev</p>
            <p style={{ margin: 0 }}>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar