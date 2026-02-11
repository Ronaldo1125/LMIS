import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import StatsCards from './UserManagementComponents/StatsCards'
import SearchBar from './UserManagementComponents/SearchBar'
import UsersTable from './UserManagementComponents/UsersTable'
import AddStaffModal from './UserManagementComponents/AddStaffModal'
import AddLibrarianModal from './UserManagementComponents/AddLibrarianModal'
import ResetPasswordModal from './UserManagementComponents/ResetPasswordModal'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/adminpanel-users'

function UserManagement() {
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

  // Fetch current user role on mount
  useEffect(() => {
    // Try multiple sources for the role
    let role = localStorage.getItem('userRole')
    
    // If not found, try getting from user object
    if (!role) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          role = user.role
          // Store it for next time
          localStorage.setItem('userRole', role)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    }
    
    console.log('Current user role:', role) // DEBUG: Check what role is being set
    setCurrentUserRole(role)
    fetchUsers()
    fetchStats()
  }, [])

  // Check if current user is admin
  const isAdmin = currentUserRole === 'admin'
  
  // Check if user can view this page
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

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && user.is_active) ||
      (statusFilter === 'Inactive' && !user.is_active)
    return matchesSearch && matchesRole && matchesStatus
  })

  // Transform API data to match UsersTable component expectations
  const usersWithActiveFlag = filteredUsers.map(user => ({
    id: user.id,
    name: user.full_name,
    email: user.username, // or user.email if your API has an email field
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize role
    status: user.is_active ? 'Active' : 'Inactive',
    dateAdded: user.created_at || user.date_added || new Date().toISOString(),
    isActiveLibrarian: user.role === 'librarian' && user.is_active
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
      alert('Password reset successfully')
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

    try {
      const token = localStorage.getItem('authToken')
      await axios.put(
        `${API_URL}/${userId}/set-active-librarian`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user has permission to view this page
  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-2">Access Denied</div>
          <div className="text-gray-600">You don't have permission to view this page.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-600">
              {isAdmin 
                ? 'Manage library staff, librarians, and patrons' 
                : 'View library staff, librarians, and patrons'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Search and Actions */}
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
        />

        {/* Users Table */}
        <UsersTable
          users={usersWithActiveFlag}
          onResetPassword={handleOpenResetPassword}
          onDeactivateAccount={handleDeactivateAccount}
          onSetActiveLibrarian={handleSetActiveLibrarian}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modals */}
      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onSubmit={handleAddStaff}
        />
      )}

      {showAddLibrarianModal && (
        <AddLibrarianModal
          onClose={() => setShowAddLibrarianModal(false)}
          onSubmit={handleAddLibrarian}
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
        />
      )}
    </div>
  )
}

export default UserManagement