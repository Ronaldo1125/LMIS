import { useState } from 'react'
import { KeyIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const MyProfile = ({ user, setCurrentView }) => {
  const fullName = user?.full_name || user?.username || 'User'
  const username = user?.username || ''
  const role = user?.role || ''
  const email = user?.email || `${username}@lmis-dro5.gov`
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRoleLabel = (r) => {
    switch (r) {
      case 'admin': return 'Administrator'
      case 'librarian': return 'Librarian'
      case 'staff': return 'Staff'
      case 'patron': return 'Patron'
      default: return r
    }
  }

  const getRoleBadgeClass = (r) => {
    switch (r) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'librarian': return 'bg-blue-100 text-blue-700'
      case 'staff': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPwError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`http://localhost:5000/api/adminpanel-users/${user.id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordForm.newPassword })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update password.')

      setPwSuccess(true)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--dark-blue-1)] mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-[var(--dark-blue-1)] to-[var(--dark-blue-2)]" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-[var(--dark-blue-1)] to-[var(--dark-blue-2)]">
                <span className="text-white font-bold text-3xl uppercase">
                  {fullName.charAt(0)}
                </span>
              </div>
              <div className="pb-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(role)}`}>
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">@{username}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-gray-800 font-medium truncate">{email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Role</p>
                <p className="text-sm text-gray-800 font-medium">{getRoleLabel(role)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Username</p>
                <p className="text-sm text-gray-800 font-medium">{username}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Member Since</p>
                <p className="text-sm text-gray-800 font-medium">{createdAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--dark-blue-1)]/10 flex items-center justify-center">
              <KeyIcon className="w-5 h-5 text-[var(--dark-blue-1)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-30"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-30"
                placeholder="Confirm new password"
                required
              />
            </div>

            {pwError && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{pwError}</p>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-lg">
                <CheckIcon className="w-4 h-4" />
                Password updated successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--dark-blue-1)] text-white font-medium text-sm hover:bg-[var(--dark-blue-2)] transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MyProfile