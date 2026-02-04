import { Key, UserX, CheckCircle, Circle, Crown } from 'lucide-react'

function UsersTable({ users, onResetPassword, onDeactivateAccount, onSetActiveLibrarian }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Staff':
        return {
          background: 'var(--secondary-3-light)',
          color: 'var(--dark-blue-1)'
        }
      case 'Librarian':
        return {
          background: 'var(--secondary-1-light)',
          color: 'var(--secondary-1-dark)'
        }
      case 'Patron':
        return {
          background: 'var(--secondary-2-light)',
          color: 'var(--secondary-2-darkest)'
        }
      default:
        return { background: 'var(--secondary-4-grey)', color: 'var(--dark-blue-4)' }
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle size={14} />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
        <Circle size={14} />
        Inactive
      </span>
    )
  }

  const renderActions = (user) => {
    if (user.role === 'Patron') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onResetPassword(user)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            <Key size={16} />
            Reset Password
          </button>
          {user.status === 'Active' && (
            <button
              onClick={() => onDeactivateAccount(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              <UserX size={16} />
              Deactivate
            </button>
          )}
        </div>
      )
    }

    if (user.role === 'Librarian') {
      return (
        <div className="flex gap-2">
          {!user.isActiveLibrarian && (
            <button
              onClick={() => onSetActiveLibrarian(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              <Crown size={16} />
              Set Active
            </button>
          )}
          {user.isActiveLibrarian && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md">
              <Crown size={16} />
              Active Librarian
            </span>
          )}
        </div>
      )
    }

    if (user.role === 'Staff') {
      return (
        <button
          onClick={() => onResetPassword(user)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          <Key size={16} />
          Reset Password
        </button>
      )
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
        <div className="text-gray-400 mb-4">
          <Circle size={64} className="mx-auto opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
          No users found
        </h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Date Added
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: '"Inter", sans-serif' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors"
                style={{ 
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${getGradientColors(user.name)})`
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-semibold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600" style={{ fontFamily: '"Inter", sans-serif' }}>
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                    style={{
                      ...getRoleBadgeStyle(user.role),
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 text-gray-600" style={{ fontFamily: '"Inter", sans-serif' }}>
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

// Helper function to generate gradient colors based on name
function getGradientColors(name) {
  // Use theme color for avatar backgrounds (match badge color logic)
  const colors = [
    'var(--secondary-3-light)',
    'var(--secondary-1-light)',
    'var(--secondary-2-light)',
    'var(--secondary-2-dark)',
    'var(--secondary-2-darker)',
    'var(--secondary-1-dark)',
    'var(--secondary-3-dark)',
    'var(--dark-blue-1)'
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default UsersTable