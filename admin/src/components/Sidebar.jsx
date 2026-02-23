import {
  HomeIcon,
  BookOpenIcon,
  DocumentPlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const Sidebar = ({ isOpen, setIsSidebarOpen, currentView, setCurrentView, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'cataloging', label: 'Cataloging', icon: BookOpenIcon },
    { id: 'accessions', label: 'Accessions', icon: DocumentPlusIcon },
    { id: 'acquisitions', label: 'Acquisitions', icon: ClipboardDocumentCheckIcon },
    { id: 'user-management', label: 'User Management', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ]

  const footerItems = [
    { id: 'logout', label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ]

  return (
    <>
      <aside
        className={`flex-shrink-0 bg-[#154A9A] dark:bg-gray-900 text-white transition-all duration-300 relative ${
          isOpen ? 'w-64' : 'w-20'
        }`}
        style={{ boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isOpen)}
          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 
                     bg-white dark:bg-gray-700 rounded-full p-1 transition-all z-10 
                     hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md active:scale-95 
                     flex items-center justify-center border border-gray-200 dark:border-gray-600
                     focus:outline-none focus:ring-0"
          style={{ boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', width: '32px', height: '32px' }}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          ) : (
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>

        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className={`p-4 border-b border-white border-opacity-10 dark:border-gray-700 flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
            <img
              src="/LOGO.svg"
              alt="LMIS Logo"
              className="w-12 h-12 flex-shrink-0"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className={`flex flex-col ml-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              <h1 className="text-sm font-bold whitespace-nowrap leading-tight">Library Management</h1>
              <p className="text-[10px] text-white text-opacity-70 whitespace-nowrap leading-tight">Information System</p>
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
                      ? 'bg-[#0F61F7] dark:bg-gray-600 text-white shadow-lg'
                      : 'text-white text-opacity-70 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700'
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
          <div className="p-4 border-t border-white border-opacity-10 dark:border-gray-700 space-y-2">
            {footerItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              const isLogout = item.id === 'logout'

              return (
                <button
                  key={item.id}
                  onClick={() => isLogout ? setShowLogoutConfirm(true) : setCurrentView(item.id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-[#0F61F7] dark:bg-gray-600 text-white shadow-lg'
                      : `text-white text-opacity-70 hover:text-opacity-100 ${isLogout ? 'hover:bg-red-500 hover:bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700'}`
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
              <p>© 2026 LMIS DEPDev</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-xl shadow-2xl w-80 p-6 flex flex-col items-center gap-4"
            style={{ animation: 'fadeInScale 0.18s ease-out' }}>
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-7 h-7 text-red-500" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900">Log out of LMIS?</h3>
              <p className="mt-1 text-sm text-gray-500">You'll need to sign in again to access your account.</p>
            </div>

            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  onLogout?.()
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}

export default Sidebar