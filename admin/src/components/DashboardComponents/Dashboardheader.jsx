import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const headerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      // Find the scrolling container (main element)
      const scrollContainer = document.querySelector('main')
      if (scrollContainer) {
        setIsSticky(scrollContainer.scrollTop > 20)
      }
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Listen to scroll on the main element, not window
    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      clearInterval(timer)
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

          {/* Notification Button */}
          <button 
            className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--secondary-3-medium)]"
            />
          </button>

          {/* Account Icon */}
          <button 
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 transition-all group hover:bg-[var(--dark-blue-1)] hover:border-[var(--dark-blue-1)] focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-40"
            aria-label="Account"
          >
            <UserCircleIcon className="w-5 h-5 text-[var(--dark-blue-2)] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader