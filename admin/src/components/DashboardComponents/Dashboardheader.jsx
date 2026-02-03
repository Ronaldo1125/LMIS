import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img 
            src="/LOGO.svg" 
            alt="LMIS Logo" 
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-2xl font-bold text-[var(--dark-blue-1)]">
              LMIS - DRO5
            </h1>
            <p className="text-xs text-gray-600">
              Library Management Information System
            </p>
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
              className="w-64 pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-50 transition-all"
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
