import { useState } from 'react'
import { X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

function AddStaffModal({ onClose, onSubmit }) {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 text-white relative overflow-hidden"
          style={{ background: 'var(--dark-blue-1)' }}
        >
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'inherit' }}>
              Add New Staff Member
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <User size={16} className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter full name"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Mail size={16} className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="email@library.com"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Phone size={16} className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="+1 (555) 000-0000"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <MapPin size={16} className="inline mr-2" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter complete address"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                <Calendar size={16} className="inline mr-2" />
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
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
                background: 'var(--dark-blue-1)',
                fontFamily: 'inherit'
              }}
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