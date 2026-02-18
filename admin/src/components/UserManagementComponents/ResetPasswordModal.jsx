import { useState } from 'react'
import { X, Key, Eye, EyeOff } from 'lucide-react'

function ResetPasswordModal({ user, onClose, onSubmit }) {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-white relative overflow-hidden"
          style={{ background: 'var(--secondary-3-light)' }}
        >
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'inherit' }}>
                Reset Password
              </h2>
              <p className="text-sm opacity-90" style={{ fontFamily: 'inherit' }}>
                For {user.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Key size={16} className="inline mr-2" />
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all pr-12 no-password-reveal ${
                    errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter new password"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Key size={16} className="inline mr-2" />
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all pr-12 no-password-reveal ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm new password"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              style={{
                background: 'var(--secondary-3-light)',
                fontFamily: 'inherit'
              }}
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