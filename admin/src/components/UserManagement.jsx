import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import StatsCards from './UserManagementComponents/StatsCards'
import SearchBar from './UserManagementComponents/SearchBar'
import UsersTable from './UserManagementComponents/UsersTable'
import AddLibrarianModal from './UserManagementComponents/AddLibrarianModal'
import ResetPasswordModal from './UserManagementComponents/ResetPasswordModal'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/adminpanel-users`
const USERTYPE_API_URL = `${import.meta.env.VITE_API_URL}/usertype`

function UserManagement({ dark }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ Admin: 0, Librarian: 0, Staff: 0, Patron: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)

  useEffect(() => {
    let role = localStorage.getItem('userRole')
    if (!role) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          role = user.role
          localStorage.setItem('userRole', role)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    }
    setCurrentUserRole(role)
    fetchUsers()
    fetchStats()
  }, [])

  const isAdmin = currentUserRole === 'admin'
  const isStaff = currentUserRole === 'staff'
  const canView = isAdmin || isStaff || currentUserRole === 'librarian'

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await axios.get(USERTYPE_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response?.status === 401) alert('Session expired. Please login again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${USERTYPE_API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const normalizeRole = (role) => {
    if (!role) return 'Unknown'
    const map = {
      admin: 'Admin', Admin: 'Admin',
      librarian: 'Librarian', Librarian: 'Librarian',
      staff: 'Staff', Staff: 'Staff',
      patron: 'Patron', Patron: 'Patron',
    }
    return map[role] ?? (role.charAt(0).toUpperCase() + role.slice(1))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.name     || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      roleFilter === 'All' || normalizeRole(user.role) === roleFilter

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active'   &&  user.status === 'Active') ||
      (statusFilter === 'Inactive' && user.status === 'Inactive')

    return matchesSearch && matchesRole && matchesStatus
  })

  const mappedUsers = filteredUsers.map(user => ({
    id:                user.id,
    name:              user.name,
    email:             user.email,
    role:              normalizeRole(user.role),
    status:            user.status,
    dateAdded:         user.dateAdded,
    isActiveLibrarian: user.isActiveLibrarian,
    source:            user.source,
    avatar:            user.avatar,
  }))

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAddLibrarian = async (librarianData) => {
    if (!isAdmin) { alert('Only administrators can add librarians'); return }
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API_URL}/librarians`, librarianData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowAddLibrarianModal(false)
      alert('Librarian added successfully!')
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding librarian')
    }
  }

  const handleResetPassword = async (userId, newPassword) => {
    if (!isAdmin) { alert('Only administrators can reset passwords'); return }
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(
        `${API_URL}/${userId}/reset-password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowResetPasswordModal(false)
      setSelectedUser(null)
      alert('Password reset successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error resetting password')
    }
  }

  const handleDeactivateAccount = async (userId) => {
    if (!isAdmin) { alert('Only administrators can deactivate accounts'); return }
    if (!confirm('Are you sure you want to deactivate this account?')) return
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(`${API_URL}/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Account deactivated successfully!')
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error deactivating account')
    }
  }

  const handleSetActiveLibrarian = async (userId) => {
    if (!isAdmin) { alert('Only administrators can set the active librarian'); return }
    if (!confirm(
      'Set this librarian as the active librarian?\n\n' +
      'This will automatically deactivate the current active librarian.\n' +
      'Only ONE librarian can be active at a time.'
    )) return
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(`${API_URL}/${userId}/set-active-librarian`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Active librarian set successfully!')
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error setting active librarian')
    }
  }

  const handleMakeStaff = async (user) => {
    if (user.source !== 'users') {
      alert('This account type cannot be promoted to Staff.')
      return
    }
    if (!confirm(`Promote "${user.name}" from Patron to Staff?`)) return
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${USERTYPE_API_URL}/${user.id}/user-type`,
        { user_type: 'Staff' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(`${user.name} has been promoted to Staff!`)
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user type')
    }
  }

  const handleMakePatron = async (user) => {
    if (user.source !== 'users') {
      alert('This account type cannot be demoted to Patron.')
      return
    }
    if (!confirm(`Demote "${user.name}" from Staff to Patron?`)) return
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${USERTYPE_API_URL}/${user.id}/user-type`,
        { user_type: 'Patron' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(`${user.name} has been demoted to Patron!`)
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user type')
    }
  }

  const handleOpenResetPassword = (user) => {
    if (!isAdmin) { alert('Only administrators can reset passwords'); return }
    setSelectedUser(user)
    setShowResetPasswordModal(true)
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const pageBg        = dark ? '#0a1628' : '#f1f5f9'
  const headerBg      = dark ? '#0d1d35' : '#ffffff'
  const headerBorder  = dark ? '#1a3356' : '#e2e8f0'
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: cardBg, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}` }}>
          <div style={{ display: 'inline-block', width: '2rem', height: '2rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
          <p style={{ color: textSecondary, margin: 0 }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: cardBg, borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', maxWidth: '28rem', border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}` }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>Access Denied</div>
          <div style={{ color: textSecondary }}>You don't have permission to view this page.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Header */}
      <div style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}`, padding: '1rem 1.5rem', marginBottom: '1.5rem', transition: 'background 0.45s ease, border-color 0.45s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem' }}>
            <Users style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0 }}>User Management</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0 }}>
              {isAdmin ? 'Manage all library users across all roles' : 'View library users'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        <StatsCards stats={stats} dark={dark} />

        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: pageBg, paddingBottom: '1rem', paddingTop: '0.5rem', transition: 'background 0.45s ease' }}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddLibrarian={() => setShowAddLibrarianModal(true)}
            isAdmin={isAdmin}
            dark={dark}
          />
        </div>

        <UsersTable
          users={mappedUsers}
          onResetPassword={handleOpenResetPassword}
          onDeactivateAccount={handleDeactivateAccount}
          onSetActiveLibrarian={handleSetActiveLibrarian}
          onMakeStaff={handleMakeStaff}
          onMakePatron={handleMakePatron}
          isAdmin={isAdmin}
          isStaff={isStaff}
          dark={dark}
        />
      </div>

      {/* Modals */}
      {showAddLibrarianModal && (
        <AddLibrarianModal
          onClose={() => setShowAddLibrarianModal(false)}
          onSubmit={handleAddLibrarian}
          dark={dark}
        />
      )}
      {showResetPasswordModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => { setShowResetPasswordModal(false); setSelectedUser(null) }}
          onSubmit={handleResetPassword}
          dark={dark}
        />
      )}
    </div>
  )
}

export default UserManagement