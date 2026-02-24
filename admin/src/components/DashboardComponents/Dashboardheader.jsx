import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import NotificationPanel from './NotificationPanel'
import AccountMenu from './AccountMenu'

const DashboardHeader = ({ user, setCurrentView }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  // Notifications state — managed here and passed down (no unused setter lint warning)
  const [notifications, setNotifications] = useState([])  // eslint-disable-line no-unused-vars
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('main')
      if (scrollContainer) setIsSticky(scrollContainer.scrollTop > 20)
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll)
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const handleMyProfile = () => {
    setShowAccountMenu(false)
    setCurrentView('profile')
  }

  const handleHelpSupport = () => {
    setShowAccountMenu(false)
    setCurrentView('help')
  }

  return (
    <div
      className={`bg-white shadow-sm p-4 mb-6 transition-all duration-300 sticky top-0 z-50 ${
        isSticky ? 'rounded-none shadow-md' : 'rounded-lg'
      }`}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">

        {/* Left — Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/LOGO.svg"
            alt="LMIS Logo"
            className={`transition-all duration-300 ${isSticky ? 'w-10 h-10' : 'w-12 h-12'}`}
          />
          <div>
            <h1 className={`font-bold text-[var(--dark-blue-1)] transition-all duration-300 ${isSticky ? 'text-xl' : 'text-2xl'}`}>
              LMIS - DRO5
            </h1>
            <p className={`text-xs text-gray-600 transition-all duration-300 overflow-hidden ${
              isSticky ? 'opacity-0 max-h-0' : 'opacity-100 max-h-10'
            }`}>
              Library Management Information System
            </p>
          </div>
        </div>

        {/* Center — Clock (sticky only) */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 transition-all duration-500 ${
          isSticky
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-4 scale-95 absolute pointer-events-none'
        }`}>
          <CalendarIcon className="w-4 h-4 text-[var(--secondary-4-grey)]" />
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700">{formatDate(currentTime)}</span>
            <span className="w-px h-4 bg-gray-300" />
            <span className="font-semibold text-[var(--secondary-4-grey)] tabular-nums">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-50 transition-all duration-300 ${
                isSticky ? 'w-48' : 'w-64'
              }`}
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications((prev) => !prev); setShowAccountMenu(false) }}
              className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--secondary-3-medium)]" />
              )}
            </button>

            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              isSticky={isSticky}
            />
          </div>

          {/* Account button */}
          <div className="relative">
            <button
              onClick={() => { setShowAccountMenu((prev) => !prev); setShowNotifications(false) }}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
              aria-label="Account"
            >
              <UserCircleIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
            </button>

            <AccountMenu
              isOpen={showAccountMenu}
              onClose={() => setShowAccountMenu(false)}
              user={user}
              isSticky={isSticky}
              onMyProfile={handleMyProfile}
              onHelpSupport={handleHelpSupport}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardHeader