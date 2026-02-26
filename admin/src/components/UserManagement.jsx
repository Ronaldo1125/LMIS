import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import StatsCards from './UserManagementComponents/StatsCards'
import SearchBar from './UserManagementComponents/SearchBar'
import UsersTable from './UserManagementComponents/UsersTable'
import AddLibrarianModal from './UserManagementComponents/AddLibrarianModal'
import ResetPasswordModal from './UserManagementComponents/ResetPasswordModal'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/adminpanel-users'

function UserManagement({ dark }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ staff: 0, librarians: 0, patrons: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
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

    console.log('Current user role:', role)
    setCurrentUserRole(role)
    fetchUsers()
    fetchStats()
  }, [])

  const isAdmin = currentUserRole === 'admin'
  const canView = currentUserRole === 'admin' || currentUserRole === 'librarian'

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.')
        // Redirect to login or handle as needed
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter.toLowerCase()

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && user.is_active) ||
      (statusFilter === 'Inactive' && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Map backend data to frontend format with proper isActiveLibrarian flag
  const usersWithActiveFlag = filteredUsers.map(user => ({
    id: user.id,
    name: user.full_name,
    email: user.username,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    status: user.is_active ? 'Active' : 'Inactive',
    dateAdded: user.created_at || user.date_added || new Date().toISOString(),
    // Use the computed field from backend
    isActiveLibrarian: user.is_active_librarian === 1
  }))

  const handleAddStaff = async (staffData) => {
    if (!isAdmin) {
      alert('Only administrators can add staff members')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API_URL}/staff`, staffData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowAddStaffModal(false)
      alert('Staff member added successfully!')
      fetchUsers()
      fetchStats()
    } catch (error) {
      console.error('Error adding staff:', error)
      alert(error.response?.data?.message || 'Error adding staff')
    }
  }

  const handleAddLibrarian = async (librarianData) => {
    if (!isAdmin) {
      alert('Only administrators can add librarians')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API_URL}/librarians`, librarianData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowAddLibrarianModal(false)
      alert('Librarian added successfully! Remember to set them as active if needed.')
      fetchUsers()
      fetchStats()
    } catch (error) {
      console.error('Error adding librarian:', error)
      alert(error.response?.data?.message || 'Error adding librarian')
    }
  }

  const handleResetPassword = async (userId, newPassword) => {
    if (!isAdmin) {
      alert('Only administrators can reset passwords')
      return
    }

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
      console.error('Error resetting password:', error)
      alert(error.response?.data?.message || 'Error resetting password')
    }
  }

  const handleDeactivateAccount = async (userId) => {
    if (!isAdmin) {
      alert('Only administrators can deactivate accounts')
      return
    }

    if (!confirm('Are you sure you want to deactivate this account?')) return

    try {
      const token = localStorage.getItem('authToken')
      await axios.put(
        `${API_URL}/${userId}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Account deactivated successfully!')
      fetchUsers()
      fetchStats()
    } catch (error) {
      console.error('Error deactivating account:', error)
      alert(error.response?.data?.message || 'Error deactivating account')
    }
  }

  const handleSetActiveLibrarian = async (userId) => {
    if (!isAdmin) {
      alert('Only administrators can set the active librarian')
      return
    }

    const confirmMessage = 
      'Set this librarian as the active librarian?\n\n' +
      'This will automatically deactivate the current active librarian.\n' +
      'Only ONE librarian can be active at a time.'

    if (!confirm(confirmMessage)) return

    try {
      const token = localStorage.getItem('authToken')
      await axios.put(
        `${API_URL}/${userId}/set-active-librarian`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Active librarian set successfully!')
      fetchUsers()
    } catch (error) {
      console.error('Error setting active librarian:', error)
      alert(error.response?.data?.message || 'Error setting active librarian')
    }
  }

  const handleOpenResetPassword = (user) => {
    if (!isAdmin) {
      alert('Only administrators can reset passwords')
      return
    }
    setSelectedUser(user)
    setShowResetPasswordModal(true)
  }

  const pageBg       = dark ? '#0a1628' : '#f1f5f9'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg    = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor    = dark ? '#93c5fd' : '#2563eb'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.45s ease' }}>
        <div style={{ background: cardBg, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}` }}>
          <div style={{ display: 'inline-block', width: '2rem', height: '2rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
          <p style={{ color: textSecondary, margin: 0 }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.45s ease' }}>
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
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <Users style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>User Management</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              {isAdmin
                ? 'Manage library staff, librarians, and patrons'
                : 'View library staff, librarians, and patrons'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        {/* Stats Cards */}
        <StatsCards stats={stats} dark={dark} />

        {/* Search and Filters */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: pageBg, paddingBottom: '1rem', paddingTop: '0.5rem', transition: 'background 0.45s ease' }}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddStaff={() => setShowAddStaffModal(true)}
            onAddLibrarian={() => setShowAddLibrarianModal(true)}
            isAdmin={isAdmin}
            dark={dark}
          />
        </div>

        {/* Users Table */}
        <UsersTable
          users={usersWithActiveFlag}
          onResetPassword={handleOpenResetPassword}
          onDeactivateAccount={handleDeactivateAccount}
          onSetActiveLibrarian={handleSetActiveLibrarian}
          isAdmin={isAdmin}
          dark={dark}
        />
      </div>

      {/* Modals */}
      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onSubmit={handleAddStaff}
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
          onClose={() => {
            setShowResetPasswordModal(false)
            setSelectedUser(null)
          }}
          onSubmit={handleResetPassword}
          dark={dark}
        />
      )}
    </div>
  )
}

export default UserManagement