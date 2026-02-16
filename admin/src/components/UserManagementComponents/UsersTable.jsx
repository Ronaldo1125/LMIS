import { Key, UserX, CheckCircle, Circle, Crown, AlertCircle } from 'lucide-react'

function UsersTable({ users, onResetPassword, onDeactivateAccount, onSetActiveLibrarian, isAdmin }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Staff':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'Librarian':
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'Patron':
        return 'bg-orange-50 text-orange-700 border border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={14} />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
        <Circle size={14} />
        Inactive
      </span>
    )
  }

  const renderActions = (user) => {
    // Patron actions
    if (user.role === 'Patron') {
      return (
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => onResetPassword(user)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Key size={14} />
                Reset Password
              </button>
              {user.status === 'Active' && (
                <button
                  onClick={() => onDeactivateAccount(user.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                >
                  <UserX size={14} />
                  Deactivate
                </button>
              )}
            </>
          )}
          {!isAdmin && <span className="text-xs text-gray-500">No actions available</span>}
        </div>
      )
    }

    // Librarian actions
    if (user.role === 'Librarian') {
      return (
        <div className="flex gap-2 items-center">
          {user.isActiveLibrarian ? (
            // Active Librarian Badge - Professional Style
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-amber-600 text-white shadow-sm">
              <Crown size={16} className="fill-white" />
              <span>Active Librarian</span>
            </div>
          ) : (
            <>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  {/* Set Active Button - Professional Style */}
                  <button
                    onClick={() => onSetActiveLibrarian(user.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    title="Set as active librarian (will deactivate current active librarian)"
                  >
                    <Crown size={16} />
                    <span>Set as Active</span>
                  </button>
                  {/* Inactive Badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                    <AlertCircle size={12} />
                    Inactive
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <AlertCircle size={14} />
                  Inactive Librarian
                </span>
              )}
            </>
          )}
        </div>
      )
    }

    // Staff actions
    if (user.role === 'Staff') {
      return (
        <div className="flex gap-2">
          {isAdmin ? (
            <button
              onClick={() => onResetPassword(user)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Key size={14} />
              Reset Password
            </button>
          ) : (
            <span className="text-xs text-gray-500">No actions available</span>
          )}
        </div>
      )
    }

    return null
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
        <div className="text-gray-400 mb-4">
          <Circle size={64} className="mx-auto opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
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
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email/Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className={`hover:bg-slate-50 transition-colors ${
                  user.role === 'Librarian' && user.isActiveLibrarian ? 'bg-amber-50/40' : ''
                }`}
                style={{ 
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm relative"
                      style={{
                        backgroundColor: getAvatarColor(user.name)
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      {user.isActiveLibrarian && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Crown size={10} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-slate-800">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getRoleBadgeStyle(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(user.dateAdded).toLocaleDateString('en-US', { 
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// Helper function to generate solid colors based on name
function getAvatarColor(name) {
  const colors = [
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#64748b'  // Slate
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default UsersTable