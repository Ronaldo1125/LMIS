import { useState } from 'react'
import { X, User, Lock, UserCircle } from 'lucide-react'

function AddLibrarianModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validate()) {
    return
  }

  setIsSubmitting(true)

  try {
    const token = localStorage.getItem('authToken') // Changed from 'token' to 'authToken'
    
    if (!token) {
      setErrors({ submit: 'Not authenticated. Please log in again.' })
      setIsSubmitting(false)
      return
    }
    
    const response = await fetch('/api/adminpanel-users/librarians', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        setErrors({ submit: 'Session expired. Please log in again.' })
      } else if (response.status === 409) {
        setErrors({ username: 'Username already exists' })
      } else if (response.status === 403) {
        setErrors({ submit: 'Admin access required' })
      } else {
        setErrors({ submit: data.message || 'Failed to create librarian' })
      }
      setIsSubmitting(false)
      return
    }

    // Success - call the parent's onSubmit with the created librarian data
    onSubmit(data.librarian)
    
    // Close the modal
    onClose()
  } catch (error) {
    console.error('Error creating librarian:', error)
    setErrors({ submit: 'Network error. Please try again.' })
    setIsSubmitting(false)
  }
}

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="bg-white shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          animation: 'slideUp 0.3s ease-out',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
        }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 text-white relative overflow-hidden"
          style={{ background: 'var(--dark-blue-1)' }}
        >
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'inherit' }}>
              Add New Librarian
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 transition-all"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <UserCircle size={16} className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.full_name ? 'bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:ring-purple-500'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Enter full name"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.full_name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <User size={16} className="inline mr-2" />
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.username ? 'bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:ring-purple-500'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Enter username"
                style={{ fontFamily: '"Inter", sans-serif' }}
                autoComplete="off"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Lock size={16} className="inline mr-2" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.password ? 'bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:ring-purple-500'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Enter password (min. 6 characters)"
                style={{ fontFamily: '"Inter", sans-serif' }}
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Lock size={16} className="inline mr-2" />
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword ? 'bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:ring-purple-500'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Confirm password"
                style={{ fontFamily: '"Inter", sans-serif' }}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 shadow-sm">
                <p className="text-red-600 text-sm font-semibold">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 font-semibold text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cancel-button shadow-sm"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: 'var(--dark-blue-1)',
                fontFamily: 'inherit'
              }}
            >
              {isSubmitting ? 'Creating...' : 'Add Librarian'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cancel-button {
          background-color: #f3f4f6 !important;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #fef2f2 !important;
          color: #dc2626 !important;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2) !important;
        }
      `}</style>
    </div>
  )
}

export default AddLibrarianModal