import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Cataloging from './components/Cataloging'
import Accessions from './components/Accessions'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'cataloging':
        return <Cataloging />
      case 'accessions':
        return <Accessions />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex flex-row h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto pl-6">
        {renderView()}
      </main>
    </div>
  )
}

export default App
