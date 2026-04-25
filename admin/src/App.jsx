import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Cataloging from './components/Cataloging'
import Accessions from './components/Accessions'
import UserManagement from './components/UserManagement'
import Acquisitions from './components/Acquisitions'
import Security from './components/Security'
import AccountLogin from './components/AccountLogin'
import MyProfile from './pages/MyProfile'
import HelpSupport from './pages/HelpSupport'
import NewsAnnouncements from './components/NewsAnnouncements'
import Feedbacks from './components/Feedbacks'
import PrivacyTermsEditor from './components/PrivacyTermsEditor'

const getInitialAuthState = () => {
  const token = localStorage.getItem('authToken')
  const savedUser = localStorage.getItem('user')
  if (token && savedUser) {
    return { isAuthenticated: true, user: JSON.parse(savedUser) }
  }
  return { isAuthenticated: false, user: null }
}

const normalizeUser = (raw) => {
  if (!raw) return null
  return {
    id:        raw.id        || raw.userId  || raw.user_id  || null,
    username:  raw.username  || raw.name    || '',
    full_name: raw.full_name || raw.fullName || raw.name || raw.username || '',
    email:     raw.email     || `${raw.username || ''}@lmis-dro5.gov`,
    role:      raw.role      || '',
    avatar:    raw.avatar    || null,
  }
}

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const initialAuth = getInitialAuthState()
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated)
  const [user, setUser] = useState(() => normalizeUser(initialAuth.user))

  // Only show spinner if there's a token to verify, otherwise go straight to login
  const [isVerifying, setIsVerifying] = useState(!!localStorage.getItem('authToken'))

  // ── Dark mode ──────────────────────────────────────────────
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (dark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }, [dark])

  // ── Token verification on mount ────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      setIsVerifying(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          const normalized = normalizeUser(data.user)
          setIsAuthenticated(true)
          setUser(normalized)
          localStorage.setItem('user', JSON.stringify(normalized))
        } else {
          // Token expired, invalid, or account deactivated — force re-login
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          localStorage.removeItem('userRole')
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (err) {
        console.error('Token verification failed:', err)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, []) // runs once on mount

  // ── Page title ─────────────────────────────────────────────
  useEffect(() => {
    const pageTitles = {
      dashboard:        'Dashboard',
      cataloging:       'Cataloging',
      accessions:       'Accessions',
      acquisitions:     'Acquisitions',
      'user-management':'User Management',
      'news':           'News and Announcements',
      'feedbacks':      'Feedbacks',
      'privacy-terms':  'Privacy & Terms',
      security:         'Security',
      profile:          'My Profile',
      help:             'Help & Support',
    }
    document.title = `${pageTitles[currentView] || 'LMIS'} | LMIS`
  }, [currentView])

  const handleLoginSuccess = (userData) => {
    const normalized = normalizeUser(userData)
    setIsAuthenticated(true)
    setUser(normalized)
    localStorage.setItem('user', JSON.stringify(normalized))
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    sessionStorage.removeItem('loginNotification')
    setIsAuthenticated(false)
    setCurrentView('dashboard')
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} setCurrentView={setCurrentView} dark={dark} />
      case 'cataloging':
        return <Cataloging dark={dark} />
      case 'accessions':
        return <Accessions dark={dark} />
      case 'user-management':
        return <UserManagement dark={dark} />
      case 'acquisitions':
        return <Acquisitions dark={dark} />
      case 'news':
        return <NewsAnnouncements dark={dark} />
      case 'feedbacks':
        return <Feedbacks dark={dark} />
      case 'privacy-terms':
        return <PrivacyTermsEditor dark={dark} />
      case 'security':
        return <Security dark={dark} />
      case 'profile':
        return <MyProfile user={user} setCurrentView={setCurrentView} dark={dark} setDark={setDark} />
      case 'help':
        return <HelpSupport setCurrentView={setCurrentView} dark={dark} />
      case 'logout':
        handleLogout()
        return null
      default:
        return <Dashboard user={user} setCurrentView={setCurrentView} dark={dark} />
    }
  }

  // ── Guards ─────────────────────────────────────────────────

  // While verifying token, show a neutral loading screen (prevents login page flash)
  if (isVerifying) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: dark ? '#07111f' : '#f8fafc',
      }}>
        <p style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
          Loading...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return <AccountLogin onLoginSuccess={handleLoginSuccess} />

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', height: '100vh',
      background: dark ? '#07111f' : '#f8fafc',
      transition: 'background 0.45s ease',
    }}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        dark={dark}
      />
      <main style={{
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingLeft: '1.5rem',
        background: dark ? '#07111f' : '#f8fafc',
        transition: 'background 0.45s ease',
      }}>
        {renderView()}
      </main>
    </div>
  )
}

export default App