import { Key, UserX, CheckCircle, Circle, Crown } from 'lucide-react'

function UsersTable({ users, onResetPassword, onDeactivateAccount, onSetActiveLibrarian }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Staff':
        return 'bg-blue-100 text-blue-800'
      case 'Librarian':
        return 'bg-purple-100 text-purple-800'
      case 'Patron':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle size={14} />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F61F7] text-white hover:bg-[#0D52D1] transition-colors"
          >
            <Key size={14} />
            Reset Password
          </button>
          {user.status === 'Active' && (
            <button
              onClick={() => onDeactivateAccount(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <UserX size={14} />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
            >
              <Crown size={14} />
              Set Active
            </button>
          )}
          {user.isActiveLibrarian && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md">
              <Crown size={14} />
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F61F7] text-white hover:bg-[#0D52D1] transition-colors"
        >
          <Key size={14} />
          Reset Password
        </button>
      )
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
        <div className="text-gray-400 mb-4">
          <Circle size={64} className="mx-auto opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-[#154A9A] mb-2">
          No users found
        </h3>
        <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                        background: getAvatarGradient(user.name)
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-semibold text-[#154A9A]">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
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
function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #0F61F7, #0D52D1)',
    'linear-gradient(135deg, #3F1BD2, #2E1499)',
    'linear-gradient(135deg, #FFA602, #E69500)',
    'linear-gradient(135deg, #FF6B6B, #E85555)',
    'linear-gradient(135deg, #4ECDC4, #44B8B0)',
    'linear-gradient(135deg, #9B59B6, #8E44AD)',
    'linear-gradient(135deg, #3498DB, #2980B9)',
    'linear-gradient(135deg, #1ABC9C, #16A085)'
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export default UsersTable