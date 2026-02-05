import { useState } from 'react'
import StatsCards from './UserManagementComponents/StatsCards'
import SearchBar from './UserManagementComponents/SearchBar'
import UsersTable from './UserManagementComponents/UsersTable'
import AddStaffModal from './UserManagementComponents/AddStaffModal'
import AddLibrarianModal from './UserManagementComponents/AddLibrarianModal'
import ResetPasswordModal from './UserManagementComponents/ResetPasswordModal'
import { Users, UserCog, BookUser } from 'lucide-react'

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@library.com', role: 'Staff', status: 'Active', dateAdded: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@library.com', role: 'Librarian', status: 'Active', dateAdded: '2024-01-10', isActiveLibrarian: true },
    { id: 3, name: 'Bob Wilson', email: 'bob.wilson@library.com', role: 'Librarian', status: 'Inactive', dateAdded: '2024-01-08', isActiveLibrarian: false },
    { id: 4, name: 'Alice Johnson', email: 'alice.johnson@email.com', role: 'Patron', status: 'Active', dateAdded: '2024-02-01' },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@email.com', role: 'Patron', status: 'Active', dateAdded: '2024-02-03' },
    { id: 6, name: 'Diana Prince', email: 'diana.prince@library.com', role: 'Staff', status: 'Active', dateAdded: '2024-01-20' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Calculate stats
  const stats = {
    staff: users.filter(u => u.role === 'Staff').length,
    librarians: users.filter(u => u.role === 'Librarian').length,
    patrons: users.filter(u => u.role === 'Patron').length,
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'All' || user.role === roleFilter
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddStaff = (staffData) => {
    const newStaff = {
      id: users.length + 1,
      ...staffData,
      role: 'Staff',
      status: 'Active',
      dateAdded: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, newStaff])
    setShowAddStaffModal(false)
  }

  const handleAddLibrarian = (librarianData) => {
    const newLibrarian = {
      id: users.length + 1,
      ...librarianData,
      role: 'Librarian',
      status: 'Inactive',
      dateAdded: new Date().toISOString().split('T')[0],
      isActiveLibrarian: false
    }
    setUsers([...users, newLibrarian])
    setShowAddLibrarianModal(false)
  }

  const handleResetPassword = (userId, newPassword) => {
    console.log(`Password reset for user ${userId}:`, newPassword)
    setShowResetPasswordModal(false)
    setSelectedUser(null)
  }

  const handleDeactivateAccount = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'Inactive' } : user
    ))
  }

  const handleSetActiveLibrarian = (userId) => {
    setUsers(users.map(user => {
      if (user.role === 'Librarian') {
        if (user.id === userId) {
          return { ...user, isActiveLibrarian: true, status: 'Active' }
        } else {
          return { ...user, isActiveLibrarian: false }
        }
      }
      return user
    }))
  }

  const handleOpenResetPassword = (user) => {
    setSelectedUser(user)
    setShowResetPasswordModal(true)
  }

  return (
    <div className="p-6 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-blue-1)' }}>
            User Management
          </h1>
          <p className="text-gray-600">Manage library staff, librarians, and patrons</p>
        </div>

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
        />

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          onResetPassword={handleOpenResetPassword}
          onDeactivateAccount={handleDeactivateAccount}
          onSetActiveLibrarian={handleSetActiveLibrarian}
        />

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