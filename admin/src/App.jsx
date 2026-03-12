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
  // Normalize on load so the shape is always consistent
  const [user, setUser] = useState(() => normalizeUser(initialAuth.user))

  // ── Dark mode ──────────────────────────────────────────────
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (dark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }, [dark])

  useEffect(() => {
    const pageTitles = {
      dashboard:        'Dashboard',
      cataloging:       'Cataloging',
      accessions:       'Accessions',
      acquisitions:     'Acquisitions',
      'user-management':'User Management',
      'news': 'News and Announcements',
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
    // Keep localStorage in sync with the normalized shape
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
        // ✅ Pass setCurrentView and user so DashboardHeader can navigate
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