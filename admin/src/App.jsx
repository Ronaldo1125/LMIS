import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Cataloging from './components/Cataloging'
import Accessions from './components/Accessions'
import UserManagement from './components/UserManagement'
import Acquisitions from './components/Acquisitions'
import AccountLogin from './components/AccountLogin'

// Check for existing authentication
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

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const initialAuth = getInitialAuthState()
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated)
  const [user, setUser] = useState(initialAuth.user)

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    setCurrentView('dashboard')
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'cataloging':
        return <Cataloging />
      case 'accessions':
        return <Accessions />
      case 'user-management':
        return <UserManagement />
      case 'acquisitions':
        return <Acquisitions />
      default:
        return <Dashboard />
    }
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AccountLogin onLoginSuccess={handleLoginSuccess} />
  }

  // Show main app if authenticated
  return (
    <div className="flex flex-row h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto pl-6">
        {renderView()}
      </main>
    </div>
  )
}

export default App