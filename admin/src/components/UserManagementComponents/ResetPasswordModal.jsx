import { useState } from 'react'
import { X, Key, Eye, EyeOff } from 'lucide-react'

function ResetPasswordModal({ user, onClose, onSubmit, dark = false }) {
  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff';
  const border       = dark ? '#1a3356' : '#e2e8f0';
  const textPrimary  = dark ? '#dde8f5' : '#1e293b';
  const textSecondary = dark ? '#6b8cae' : '#64748b';
  const textMuted    = dark ? '#2e4d70' : '#94a3b8';
  const inputBg      = dark ? '#081422' : '#ffffff';
  const inputBorder  = dark ? '#1a3356' : '#e2e8f0';
  const headerBg     = dark ? '#12294a' : 'var(--secondary-3-light)';
  const headerText   = dark ? '#dde8f5' : '#ffffff';
  const cancelBg     = dark ? '#1a3356' : '#f3f4f6';
  const cancelHover  = dark ? '#2e4d70' : '#fef2f2';
  const cancelText   = dark ? '#dde8f5' : '#dc2626';
  const submitBg     = dark ? '#2563eb' : 'var(--secondary-3-light)';
  const submitHover  = dark ? '#1d4ed8' : '#7c3aed';
  const submitText   = '#ffffff';

  const inputStyle = {
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '3rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.75rem',
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
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(user.id, formData.newPassword)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ background: dark ? 'rgba(10,18,32,0.85)' : 'rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
    >
      <div
        className="shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: '0.5rem', animation: 'slideUp 0.3s ease-out', color: textPrimary }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 relative overflow-hidden"
          style={{ background: headerBg, color: headerText, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
        >
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'inherit', color: headerText }}>
                Reset Password
              </h2>
              <p className="text-sm opacity-90" style={{ fontFamily: 'inherit', color: headerText }}>
                For {user.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all"
              style={{ background: 'transparent', color: headerText, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label style={labelStyle}>
                <Key size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.newPassword ? '#f87171' : inputBorder,
                    background: errors.newPassword ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="no-password-reveal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: textMuted, background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && <p style={errorStyle}>{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>
                <Key size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.confirmPassword ? '#f87171' : inputBorder,
                    background: errors.confirmPassword ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="no-password-reveal"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: textMuted, background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: cancelBg,
                color: dark ? textSecondary : '#374151',
                border: `1px solid ${border}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                opacity: 1,
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
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: submitBg,
                color: submitText,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: 1,
                boxShadow: dark
                  ? '0 2px 8px rgba(37,99,235,0.15)'
                  : '0 2px 8px rgba(168,85,247,0.15)',
                transition: 'background 0.2s, transform 0.15s',
                transform: 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1d4ed8' : submitHover}
              onMouseLeave={e => e.currentTarget.style.background = submitBg}
            >
              Reset Password
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

        /* Remove Edge/IE native password reveal eye */
        .no-password-reveal::-ms-reveal,
        .no-password-reveal::-ms-clear {
          display: none;
        }

        /* Remove Chrome/Safari native password reveal eye */
        .no-password-reveal::-webkit-credentials-auto-fill-button,
        .no-password-reveal::-webkit-textfield-decoration-container {
          display: none !important;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default ResetPasswordModal