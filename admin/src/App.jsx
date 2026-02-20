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

const getInitialAuthState = () => {
  const token = localStorage.getItem('authToken')
  const savedUser = localStorage.getItem('user')

  if (token && savedUser) {
    return {
      isAuthenticated: true,
      user: JSON.parse(savedUser)
    }
  }

  return {
    isAuthenticated: false,
    user: null
  }
}

const normalizeUser = (raw) => {
  if (!raw) return null
  return {
    id:        raw.id        || raw.userId  || raw.user_id  || null,
    username:  raw.username  || raw.name    || '',
    full_name: raw.full_name || raw.fullName || raw.name || raw.username || '',
    email:     raw.email     || `${raw.username || ''}@lmis-dro5.gov`,
    role:      raw.role      || '',
  }
}

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const initialAuth = getInitialAuthState()
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated)
  const [user, setUser] = useState(() => normalizeUser(initialAuth.user))

  // ── Dark mode ──────────────────────────────────────────────
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const pageTitles = {
      dashboard:        'Dashboard',
      cataloging:       'Cataloging',
      accessions:       'Accessions',
      acquisitions:     'Acquisitions',
      'user-management':'User Management',
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
    setUser(null)
    setCurrentView('dashboard')
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} setCurrentView={setCurrentView} />
      case 'cataloging':
        return <Cataloging />
      case 'accessions':
        return <Accessions />
      case 'user-management':
        return <UserManagement />
      case 'acquisitions':
        return <Acquisitions />
      case 'security':
        return <Security />
      case 'profile':
        return <MyProfile user={user} setCurrentView={setCurrentView} dark={dark} setDark={setDark} />
      case 'help':
        return <HelpSupport setCurrentView={setCurrentView} />
      case 'logout':
        handleLogout()
        return null
      default:
        return <Dashboard user={user} setCurrentView={setCurrentView} />
    }
  }

  if (!isAuthenticated) {
    return <AccountLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="flex flex-row h-screen dark:bg-gray-800" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto pl-6">
        {renderView()}
      </main>
    </div>
  )
}

export default App