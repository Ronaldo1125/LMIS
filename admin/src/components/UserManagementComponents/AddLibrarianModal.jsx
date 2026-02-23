import { useState } from 'react'
import { X, User, Lock, UserCircle } from 'lucide-react'

function AddLibrarianModal({ onClose, onSubmit, dark = false }) {
  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const inputBg      = dark ? '#081422' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#e2e8f0'
  const headerBg     = dark ? '#12294a' : '#2563eb'
  const headerText   = dark ? '#dde8f5' : '#ffffff'
  const cancelBg     = dark ? '#1a3356' : '#f3f4f6'
  const cancelHover  = dark ? '#2e4d70' : '#fef2f2'
  const cancelText   = dark ? '#dde8f5' : '#dc2626'
  const submitBg     = dark ? '#2563eb' : '#2563eb'
  const submitHover  = dark ? '#1d4ed8' : '#1d4ed8'
  const submitText   = '#ffffff'

  const inputStyle = {
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg,
    color: textPrimary,
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontFamily: 'inherit',
    color: textSecondary,
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    display: 'block',
  }

  const errorStyle = {
    color: '#f87171',
    fontWeight: 600,
    fontSize: '0.95rem',
    marginTop: '0.25rem',
  }

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
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{
        background: dark ? 'rgba(10,18,32,0.85)' : 'rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          background: cardBg,
          border: `1.5px solid ${border}`,
          borderRadius: '1rem',
          animation: 'slideUp 0.3s ease-out',
          boxShadow: dark
            ? '0 25px 50px -12px rgba(16, 37, 70, 0.65)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          color: textPrimary,
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 relative overflow-hidden"
          style={{ background: headerBg, color: headerText }}
        >
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'inherit', color: headerText }}>
              Add New Librarian
            </h2>
            <button
              onClick={onClose}
              className="p-2 transition-all"
              disabled={isSubmitting}
              style={{ background: 'transparent', color: headerText, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
              <label style={labelStyle}>
                <UserCircle size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  ...inputStyle,
                  borderColor: errors.full_name ? '#f87171' : inputBorder,
                  background: errors.full_name ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'auto',
                }}
                placeholder="Enter full name"
                autoComplete="off"
              />
              {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
            </div>

            {/* Username */}
            <div>
              <label style={labelStyle}>
                <User size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  ...inputStyle,
                  borderColor: errors.username ? '#f87171' : inputBorder,
                  background: errors.username ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'auto',
                }}
                placeholder="Enter username"
                autoComplete="off"
              />
              {errors.username && <p style={errorStyle}>{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>
                <Lock size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  ...inputStyle,
                  borderColor: errors.password ? '#f87171' : inputBorder,
                  background: errors.password ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'auto',
                }}
                placeholder="Enter password (min. 6 characters)"
                autoComplete="new-password"
              />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>
                <Lock size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  ...inputStyle,
                  borderColor: errors.confirmPassword ? '#f87171' : inputBorder,
                  background: errors.confirmPassword ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'auto',
                }}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div style={{ padding: '1rem', background: dark ? '#2e1a1a' : '#fef2f2', borderRadius: '0.5rem', marginTop: 8 }}>
                <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '1rem' }}>{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: cancelBg,
                color: dark ? textSecondary : '#374151',
                border: `1px solid ${border}`,
                borderRadius: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = cancelHover;
                e.currentTarget.style.color = cancelText;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = cancelBg;
                e.currentTarget.style.color = dark ? textSecondary : '#374151';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: submitBg,
                color: submitText,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                boxShadow: dark
                  ? '0 2px 8px rgba(37, 99, 235, 0.15)'
                  : '0 2px 8px rgba(37, 99, 235, 0.15)',
                transition: 'background 0.2s, transform 0.15s',
                transform: isSubmitting ? 'none' : 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = submitHover}
              onMouseLeave={e => e.currentTarget.style.background = submitBg}
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
      `}</style>
    </div>
  )
}

export default AddLibrarianModal