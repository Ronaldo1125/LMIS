import { useRef, useEffect } from 'react'

const getRoleLabel = (r) => {
  switch (r) {
    case 'admin': return 'Administrator'
    case 'librarian': return 'Librarian'
    case 'staff': return 'Staff'
    case 'patron': return 'Patron'
    default: return r
  }
}

const AccountMenu = ({ isOpen, onClose, user, isSticky, onMyProfile, onHelpSupport }) => {
  const menuRef = useRef(null)

  const fullName = user?.full_name || user?.username || 'Unknown'
  const username = user?.username || ''
  const role = user?.role || ''
  const email = user?.email || `${username}@lmis-dro5.gov`
  const avatarLetter = fullName.charAt(0).toUpperCase()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="fixed mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] overflow-hidden"
      style={{ right: '1rem', top: isSticky ? '4.5rem' : '5.5rem' }}
    >
      {/* Profile banner */}
      <div className="p-4 bg-gradient-to-br from-[var(--dark-blue-1)] to-[var(--dark-blue-2)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{avatarLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">{fullName}</h4>
            <p className="text-xs text-white/70 truncate">{email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-xs font-medium">
              {getRoleLabel(role)}
            </span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-2">
        <button
          onClick={onMyProfile}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </button>
        <button
          onClick={onHelpSupport}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help & Support
        </button>
      </div>
    </div>
  )
}

export default AccountMenu