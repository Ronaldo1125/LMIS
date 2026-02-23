import { useState } from 'react'
import { X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

function AddStaffModal({ onClose, onSubmit, dark = false }) {
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
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  })

  const [errors, setErrors] = useState({})

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
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
              Add New Staff Member
            </h2>
            <button
              onClick={onClose}
              className="p-2 transition-all"
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
            {/* Name */}
            <div>
              <label style={labelStyle}>
                <User size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#f87171' : inputBorder,
                  background: errors.name ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                }}
                placeholder="Enter full name"
                autoComplete="off"
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>
                <Mail size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#f87171' : inputBorder,
                  background: errors.email ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                }}
                placeholder="email@library.com"
                autoComplete="off"
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>
                <Phone size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? '#f87171' : inputBorder,
                  background: errors.phone ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                }}
                placeholder="+1 (555) 000-0000"
                autoComplete="off"
              />
              {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>
                <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={{
                  ...inputStyle,
                  borderColor: errors.address ? '#f87171' : inputBorder,
                  background: errors.address ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                  resize: 'none',
                }}
                placeholder="Enter complete address"
                autoComplete="off"
              />
              {errors.address && <p style={errorStyle}>{errors.address}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label style={labelStyle}>
                <Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: textMuted }} />
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.dateOfBirth ? '#f87171' : inputBorder,
                  background: errors.dateOfBirth ? (dark ? '#2e1a1a' : '#fef2f2') : inputBg,
                }}
                autoComplete="off"
              />
              {errors.dateOfBirth && <p style={errorStyle}>{errors.dateOfBirth}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: cancelBg,
                color: dark ? textSecondary : '#374151',
                border: `1px solid ${border}`,
                borderRadius: '0.5rem',
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
                padding: '0.75rem 1rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                background: submitBg,
                color: submitText,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: 1,
                boxShadow: dark
                  ? '0 2px 8px rgba(37, 99, 235, 0.15)'
                  : '0 2px 8px rgba(37, 99, 235, 0.15)',
                transition: 'background 0.2s, transform 0.15s',
                transform: 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = submitHover}
              onMouseLeave={e => e.currentTarget.style.background = submitBg}
            >
              Add Staff Member
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

export default AddStaffModal