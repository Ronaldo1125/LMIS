import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import StatsCards from './UserManagementComponents/StatsCards'
import SearchBar from './UserManagementComponents/SearchBar'
import UsersTable from './UserManagementComponents/UsersTable'
import AddLibrarianModal from './UserManagementComponents/AddLibrarianModal'
import ResetPasswordModal from './UserManagementComponents/ResetPasswordModal'
import ConfirmModal from './UserManagementComponents/ConfirmModal'
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

  // Confirmation modal states
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false)
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState(null)
  const [showConfirmSetActive, setShowConfirmSetActive] = useState(false)
  const [selectedUserForSetActive, setSelectedUserForSetActive] = useState(null)
  const [showConfirmMakeStaff, setShowConfirmMakeStaff] = useState(false)
  const [selectedUserForMakeStaff, setSelectedUserForMakeStaff] = useState(null)
  const [showConfirmMakePatron, setShowConfirmMakePatron] = useState(false)
  const [selectedUserForMakePatron, setSelectedUserForMakePatron] = useState(null)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [selectedUserForReset, setSelectedUserForReset] = useState(null)

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

  const handleDeactivateAccount = (user) => {
    setSelectedUserForDeactivate(user)
    setShowConfirmDeactivate(true)
  }

  const handleConfirmDeactivate = async () => {
    if (!isAdmin) { alert('Only administrators can deactivate accounts'); return }
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(`${API_URL}/${selectedUserForDeactivate.id}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Account deactivated successfully!')
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error deactivating account')
    }
    setShowConfirmDeactivate(false)
    setSelectedUserForDeactivate(null)
  }

  const handleSetActiveLibrarian = (user) => {
    setSelectedUserForSetActive(user)
    setShowConfirmSetActive(true)
  }

  const handleConfirmSetActive = async () => {
    if (!isAdmin) { alert('Only administrators can set the active librarian'); return }
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(`${API_URL}/${selectedUserForSetActive.id}/set-active-librarian`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Active librarian set successfully!')
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error setting active librarian')
    }
    setShowConfirmSetActive(false)
    setSelectedUserForSetActive(null)
  }

  const handleMakeStaff = (user) => {
    setSelectedUserForMakeStaff(user)
    setShowConfirmMakeStaff(true)
  }

  const handleConfirmMakeStaff = async () => {
    if (selectedUserForMakeStaff.source !== 'users') {
      alert('This account type cannot be promoted to Staff.')
      setShowConfirmMakeStaff(false)
      setSelectedUserForMakeStaff(null)
      return
    }
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${USERTYPE_API_URL}/${selectedUserForMakeStaff.id}/user-type`,
        { user_type: 'Staff' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(`${selectedUserForMakeStaff.name} has been promoted to Staff!`)
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user type')
    }
    setShowConfirmMakeStaff(false)
    setSelectedUserForMakeStaff(null)
  }

  const handleMakePatron = (user) => {
    setSelectedUserForMakePatron(user)
    setShowConfirmMakePatron(true)
  }

  const handleConfirmMakePatron = async () => {
    if (selectedUserForMakePatron.source !== 'users') {
      alert('This account type cannot be demoted to Patron.')
      setShowConfirmMakePatron(false)
      setSelectedUserForMakePatron(null)
      return
    }
    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${USERTYPE_API_URL}/${selectedUserForMakePatron.id}/user-type`,
        { user_type: 'Patron' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(`${selectedUserForMakePatron.name} has been demoted to Patron!`)
      fetchUsers(); fetchStats()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user type')
    }
    setShowConfirmMakePatron(false)
    setSelectedUserForMakePatron(null)
  }

  const handleOpenResetPassword = (user) => {
    setSelectedUserForReset(user)
    setShowConfirmReset(true)
  }

  const handleConfirmReset = () => {
    setSelectedUser(selectedUserForReset)
    setShowResetPasswordModal(true)
    setShowConfirmReset(false)
    setSelectedUserForReset(null)
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
      {showConfirmDeactivate && selectedUserForDeactivate && (
        <ConfirmModal
          title="Deactivate Account"
          message={`Are you sure you want to deactivate the account for "${selectedUserForDeactivate.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => { setShowConfirmDeactivate(false); setSelectedUserForDeactivate(null) }}
          dark={dark}
        />
      )}
      {showConfirmSetActive && selectedUserForSetActive && (
        <ConfirmModal
          title="Set Active Librarian"
          message={`Set "${selectedUserForSetActive.name}" as the active librarian? This will automatically deactivate the current active librarian. Only ONE librarian can be active at a time.`}
          onConfirm={handleConfirmSetActive}
          onCancel={() => { setShowConfirmSetActive(false); setSelectedUserForSetActive(null) }}
          dark={dark}
        />
      )}
      {showConfirmMakeStaff && selectedUserForMakeStaff && (
        <ConfirmModal
          title="Promote to Staff"
          message={`Promote "${selectedUserForMakeStaff.name}" from Patron to Staff?`}
          onConfirm={handleConfirmMakeStaff}
          onCancel={() => { setShowConfirmMakeStaff(false); setSelectedUserForMakeStaff(null) }}
          dark={dark}
        />
      )}
      {showConfirmMakePatron && selectedUserForMakePatron && (
        <ConfirmModal
          title="Demote to Patron"
          message={`Demote "${selectedUserForMakePatron.name}" from Staff to Patron?`}
          onConfirm={handleConfirmMakePatron}
          onCancel={() => { setShowConfirmMakePatron(false); setSelectedUserForMakePatron(null) }}
          dark={dark}
        />
      )}
      {showConfirmReset && selectedUserForReset && (
        <ConfirmModal
          title="Reset Password"
          message={`Are you sure you want to reset the password for "${selectedUserForReset.name}"?`}
          onConfirm={handleConfirmReset}
          onCancel={() => { setShowConfirmReset(false); setSelectedUserForReset(null) }}
          dark={dark}
        />
      )}
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