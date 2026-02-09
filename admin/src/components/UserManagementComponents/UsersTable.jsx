import { Key, UserX, CheckCircle, Circle, Crown } from 'lucide-react'

function UsersTable({ users, onResetPassword, onDeactivateAccount, onSetActiveLibrarian, isAdmin }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'staff':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'librarian':
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'patron':
        return 'bg-slate-50 text-slate-700 border border-slate-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={12} />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
        <Circle size={12} />
        Inactive
      </span>
    )
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (name) => {
    if (!name) return '#94a3b8'
    const colors = [
      '#0F61F7',
      '#7c3aed',
      '#db2777',
      '#dc2626',
      '#ea580c',
      '#0891b2',
      '#059669',
      '#4f46e5'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const renderActions = (user) => {
    if (user.role === 'patron') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onResetPassword(user)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Key size={13} />
            Reset Password
          </button>
          {user.is_active && (
            <button
              onClick={() => onDeactivateAccount(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <UserX size={13} />
              Deactivate
            </button>
          )}
        </div>
      )
    }

    if (user.role === 'librarian') {
      // Librarians can only view the active librarian status
      if (!isAdmin) {
        if (user.isActiveLibrarian) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Crown size={13} />
              Active Librarian
            </span>
          )
        }
        return (
          <span className="text-xs text-gray-500">
            —
          </span>
        )
      }

      // Admins can set active librarian
      return (
        <div className="flex gap-2">
          {!user.isActiveLibrarian && (
            <button
              onClick={() => onSetActiveLibrarian(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors"
            >
              <Crown size={13} />
              Set Active
            </button>
          )}
          {user.isActiveLibrarian && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Crown size={13} />
              Active Librarian
            </span>
          )}
        </div>
      )
    }

    if (user.role === 'staff') {
      return (
        <button
          onClick={() => onResetPassword(user)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Key size={13} />
          Reset Password
        </button>
      )
    }
  }

  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
        <div className="text-gray-300 mb-3">
          <Circle size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No users found
        </h3>
        <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Date Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-xs"
                      style={{
                        backgroundColor: getAvatarColor(user.full_name)
                      }}
                    >
                      {getInitials(user.full_name)}
                    </div>
                    <div className="font-medium text-gray-900">
                      {user.full_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getRoleBadgeStyle(user.role)}`}
                  >
                    {formatRole(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.is_active)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="px-6 py-4">
                  {renderActions(user)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersTable