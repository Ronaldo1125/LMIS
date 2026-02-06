import {
  HomeIcon,
  BookOpenIcon,
  DocumentPlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ isOpen, setIsSidebarOpen, currentView, setCurrentView }) => {
  // Main navigation items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'cataloging', label: 'Cataloging', icon: BookOpenIcon },
    { id: 'accessions', label: 'Accessions', icon: DocumentPlusIcon },
    { id: 'acquisitions', label: 'Acquisitions', icon: ClipboardDocumentCheckIcon },
    { id: 'user-management', label: 'User Management', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ]

  // Footer items (Settings + Logout)
  const footerItems = [
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
    { id: 'logout', label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ]

  return (
    <aside 
      className={`flex-shrink-0 bg-[#154A9A] text-white transition-all duration-300 relative ${isOpen ? 'w-64' : 'w-20'}`}
      style={{ boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isOpen)}
        className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-[#FFD002] rounded-xl transition-all z-10 hover:scale-110 hover:shadow-lg active:scale-95 flex items-center justify-center"
        style={{ 
          boxShadow: '0 4px 12px rgba(255, 208, 2, 0.4)',
          width: '28px',
          height: '70px',
        }}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <div className="text-[22px] leading-none font-bold text-[#154A9A]">
          {isOpen ? '⟩' : '⟨'}
        </div>
      </button>

      <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-center">
          <img 
            src="/LOGO.svg" 
            alt="LMIS Logo" 
            className="w-12 h-12 flex-shrink-0" 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
          <h1 className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden'}`}>
            LMIS
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-[#0F61F7] text-white shadow-lg'
                    : 'text-white text-opacity-70 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10'
                } ${isOpen ? 'space-x-3' : 'justify-center'}`}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white border-opacity-10 space-y-2">
          {footerItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            const isLogout = item.id === 'logout'
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-[#0F61F7] text-white shadow-lg'
                    : `text-white text-opacity-70 hover:text-opacity-100 ${isLogout ? 'hover:bg-red-500 hover:bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`
                } ${isOpen ? 'space-x-3' : 'justify-center'}`}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Version Info */}
          <div className={`text-[10px] text-white text-opacity-60 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p>© 2026 LMIS DepDEV</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar