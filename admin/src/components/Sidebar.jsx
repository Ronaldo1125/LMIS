import { 
  HomeIcon, 
  BookOpenIcon, 
  ShoppingCartIcon,
  UsersIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ isOpen, setIsSidebarOpen, currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'cataloging', label: 'Cataloging', icon: BookOpenIcon },
    { id: 'acquisitions', label: 'Acquisitions', icon: ShoppingCartIcon },
    { id: 'user-management', label: 'User Management', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
    { id: 'logout', label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`flex-shrink-0 text-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
        style={{ 
          background: 'var(--dark-blue-1)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
<div className="p-4 border-b border-white border-opacity-10">
  <div className="flex items-center justify-center gap-3">
    {/* Expanded view */}
    <div className={`flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
      <img 
        src="/LOGO.svg" 
        alt="LMIS Logo" 
        className="w-16 h-16 flex-shrink-0"   
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      <h1 className="text-xl font-bold whitespace-nowrap">LMIS</h1>
    </div>
              {/* Toggle Button - replaces logo when minimized */}
              <button
                onClick={() => setIsSidebarOpen(!isOpen)}
                className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${!isOpen ? 'mx-auto' : ''}`}
                style={{
                  backgroundColor: 'var(--white)',
                  color: 'var(--dark-blue-1)'
                }}
                title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isOpen ? (
                  <XMarkIcon className="w-4 h-4" />
                ) : (
                  <Bars3Icon className="w-4 h-4" />
                )}
              </button>
            </div>
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
      ? 'text-white shadow-lg'
      : 'text-white text-opacity-70 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10'
  } ${isOpen ? 'space-x-3' : 'justify-center'}`}
  style={isActive ? { 
    backgroundColor: '#158EF3', // darker blue
  } : {}}
  title={item.label}
>
  <Icon className="w-5 h-5 flex-shrink-0" />
  <span 
    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
    }`}
  >
    {item.label}
  </span>
</button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white border-opacity-10">
            <div className={`text-[10px] text-white text-opacity-60 transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
            }`}>
              <p>© 2026 LMIS DepDEV</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar