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

import ConfirmationModal from '../components/AccessionsComponents/ConfirmationModal'
import { useState } from 'react'

// ── Font constants from NewsAnnouncements ─────────────────────────
export const FONT_DISPLAY = '"Sora", -apple-system, BlinkMacSystemFont, sans-serif'
export const FONT_BODY    = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const Sidebar = ({ isOpen, setIsSidebarOpen, currentView, setCurrentView, dark }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'cataloging', label: 'Cataloging', icon: BookOpenIcon },
    { id: 'accessions', label: 'Accessions', icon: DocumentPlusIcon },
    { id: 'acquisitions', label: 'Acquisitions', icon: ClipboardDocumentCheckIcon },
    { id: 'news', label: 'Announcements', icon: NewspaperIcon },
    { id: 'user-management', label: 'User Management', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ]

  const footerItems = [
    { id: 'logout', label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ]

  const sidebarBg   = dark ? '#0a1628' : '#154A9A'
  const activeBg    = dark ? '#1a3356' : '#0F61F7'
  const hoverBg     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'
  const borderColor = dark ? '#1a3356' : 'rgba(255,255,255,0.10)'

  return (
    <aside
      style={{
        flexShrink: 0,
        width: isOpen ? '16rem' : '5rem',
        background: sidebarBg,
        color: '#fff',
        transition: 'width 0.3s ease, background 0.45s ease',
        fontFamily: FONT_BODY
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Logo Section */}
        <div style={{
          padding: '1rem',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'flex-start' : 'center'
        }}>
          <img
            src="/LOGO.svg"
            alt="LMIS Logo"
            style={{ width: '3rem', height: '3rem', filter: 'brightness(0) invert(1)' }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '0.75rem',
            opacity: isOpen ? 1 : 0,
            width: isOpen ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 800,
              fontFamily: FONT_DISPLAY
            }}>
              Library Management
            </h1>
            <p style={{
              margin: 0,
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: FONT_BODY
            }}>
              Information System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          overflowY: 'auto'
        }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: isActive ? activeBg : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  cursor: 'pointer',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '0.75rem' : 0,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span style={{
                  fontSize: '0.875rem',
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
        <div style={{
          padding: '1rem',
          borderTop: `1px solid ${borderColor}`,
          fontFamily: FONT_BODY
        }}>
          {footerItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setShowLogoutModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  border: 'none',
                  cursor: 'pointer',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '0.75rem' : 0,
                  fontFamily: FONT_BODY,
                  fontWeight: 500
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span style={{
                  fontSize: '0.875rem',
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

          {/* Logout Modal */}
          <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={async () => {
              setLogoutLoading(true)
              localStorage.removeItem('token')
              sessionStorage.removeItem('token')
              setLogoutLoading(false)
              setShowLogoutModal(false)
              window.location.href = '/login'
            }}
            title="Log Out"
            message="Are you sure you want to log out?"
            type="logout"
            loading={logoutLoading}
          />

          {/* Version Info */}
          <div style={{
            fontSize: '0.625rem',
            color: 'rgba(255,255,255,0.6)',
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
            overflow: 'hidden',
            fontFamily: FONT_BODY
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