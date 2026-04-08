import { useState } from 'react'
import LoginForm from './AccountLogin/LoginForm'
import LoginHeader from './AccountLogin/LoginHeader'
import ErrorMessage from './AccountLogin/ErrorMessage'

function AccountLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: formData.username,
    password: formData.password
  })
})

      const data = await response.json()

      if (!response.ok) {
        // Handle different error statuses with appropriate messages
        if (response.status === 403) {
          // Account inactive - show the specific message from backend
          throw new Error(data.message || 'Your account is inactive. Please contact an administrator.')
        } else if (response.status === 401) {
          // Invalid credentials
          throw new Error(data.message || 'Invalid username or password')
        } else {
          // Other errors
          throw new Error(data.message || 'Login failed. Please try again.')
        }
      }

      // Store authentication token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userRole', data.user.role)

      // Store notification data for dashboard
      const notificationData = {
        username: data.user.full_name || data.user.username,
        role: data.user.role,
        timestamp: Date.now()
      }
      sessionStorage.setItem('loginNotification', JSON.stringify(notificationData))

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(data.user)
      }

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <LoginHeader />
          
          <ErrorMessage error={error} />
          
          <LoginForm
            formData={formData}
            showPassword={showPassword}
            isLoading={isLoading}
            onShowPasswordToggle={() => setShowPassword(!showPassword)}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Library Management Information System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLogin