import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const headerRef = useRef(null)
  const notificationRef = useRef(null)
  const accountRef = useRef(null)

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Book Available',
      message: 'Digital Transformation in Education 2024 is now available',
      time: '5 min ago',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Download Complete',
      message: 'Machine Learning Fundamentals has been downloaded',
      time: '1 hour ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Feb 10, 2026 at 2:00 AM',
      time: '3 hours ago',
      read: true,
      type: 'warning'
    },
    {
      id: 4,
      title: 'New Registration',
      message: '15 new users registered today',
      time: '5 hours ago',
      read: true,
      type: 'info'
    },
    {
      id: 5,
      title: 'Collection Updated',
      message: '23 new research papers added to the collection',
      time: '1 day ago',
      read: true,
      type: 'success'
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('main')
      if (scrollContainer) {
        setIsSticky(scrollContainer.scrollTop > 20)
      }
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      clearInterval(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-50 text-green-600'
      case 'warning':
        return 'bg-yellow-50 text-yellow-600'
      default:
        return 'bg-blue-50 text-blue-600'
    }
  }

  return (
    <div 
      ref={headerRef}
      className={`bg-white shadow-sm p-4 mb-6 transition-all duration-300 sticky top-0 z-50 ${
        isSticky ? 'rounded-none shadow-md' : 'rounded-lg'
      }`}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img 
            src="/LOGO.svg" 
            alt="LMIS Logo" 
            className={`transition-all duration-300 ${
              isSticky ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          />
          <div>
            <h1 className={`font-bold text-[var(--dark-blue-1)] transition-all duration-300 ${
              isSticky ? 'text-xl' : 'text-2xl'
            }`}>
              LMIS - DRO5
            </h1>
            <p className={`text-xs text-gray-600 transition-all duration-300 overflow-hidden ${
              isSticky ? 'opacity-0 max-h-0' : 'opacity-100 max-h-10'
            }`}>
              Library Management Information System
            </p>
          </div>
        </div>

        {/* Center - Date/Time (appears when sticky) */}
        <div 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 transition-all duration-500 ${
            isSticky 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-4 scale-95 absolute pointer-events-none'
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-[var(--secondary-4-grey)]" />
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700">
              {formatDate(currentTime)}
            </span>
            <span className="w-px h-4 bg-gray-300" />
            <span className="font-semibold text-[var(--secondary-4-grey)] tabular-nums">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right side - Search, Notifications, Account */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
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
            <MagnifyingGlassIcon 
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Notification Button with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowAccountMenu(false)
              }}
              className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--secondary-3-medium)]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <button className="text-sm text-[var(--dark-blue-2)] font-semibold hover:text-[var(--dark-blue-1)] transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Menu with Dropdown */}
          <div className="relative" ref={accountRef}>
            <button 
              onClick={() => {
                setShowAccountMenu(!showAccountMenu)
                setShowNotifications(false)
              }}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
              aria-label="Account"
            >
              <UserCircleIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
            </button>

            {/* Account Dropdown */}
            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-br from-[var(--dark-blue-1)] to-[var(--dark-blue-2)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate">
                        Admin User
                      </h4>
                      <p className="text-xs text-white/80 truncate">
                        admin@lmis-dro5.gov
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Preferences
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & Support
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 p-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
