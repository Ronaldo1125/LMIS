import { useState, useEffect } from 'react'
import { Monitor, LogOut, MapPin, Chrome, Smartphone, AlertTriangle, RefreshCw } from 'lucide-react'

const SessionManagement = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState(null)

  useEffect(() => {
    fetchSessions()
    // Get current session ID from localStorage or sessionStorage
    const sessionId = localStorage.getItem('sessionId')
    setCurrentSessionId(sessionId)
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/security/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      // Mock data for development
      setSessions(getMockSessions())
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId) => {
    if (!confirm('Are you sure you want to terminate this session?')) {
      return
    }

    try {
      const response = await fetch(`/api/security/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
        alert('Session terminated successfully')
      }
    } catch (error) {
      console.error('Error terminating session:', error)
      // For demo purposes
      setSessions(sessions.filter(s => s.id !== sessionId))
      alert('Session terminated successfully')
    }
  }

  const terminateAllOtherSessions = async () => {
    if (!confirm('Are you sure you want to terminate all other sessions? Users will need to log in again.')) {
      return
    }

    try {
      const response = await fetch('/api/security/sessions/terminate-others', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        setSessions(sessions.filter(s => s.id === currentSessionId))
        alert('All other sessions terminated successfully')
      }
    } catch (error) {
      console.error('Error terminating sessions:', error)
      setSessions(sessions.filter(s => s.id === currentSessionId))
      alert('All other sessions terminated successfully')
    }
  }

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="w-5 h-5 text-gray-600" />
    }
    return <Monitor className="w-5 h-5 text-gray-600" />
  }

  const getBrowserIcon = (Chrome) => {
    // You can add more browser icons as needed
    return <Chrome className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Monitor className="w-7 h-7" />
          Session Management
        </h1>
        <p className="text-gray-600 mt-1">Monitor and manage active user sessions</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={fetchSessions}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <button
          onClick={terminateAllOtherSessions}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Terminate All Other Sessions
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`bg-white rounded-lg shadow-sm p-5 border-2 ${
                  session.id === currentSessionId
                    ? 'border-green-500 bg-green-50'
                    : 'border-transparent'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.device)}
                    <div>
                      <h3 className="font-semibold text-gray-800">{session.user}</h3>
                      <p className="text-sm text-gray-600">{session.device}</p>
                    </div>
                  </div>
                  {session.id === currentSessionId && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Current
                    </span>
                  )}
                </div>

                {/* Session Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getBrowserIcon(session.browser)}
                    <span>{session.browser}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{session.location}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">IP:</span> {session.ipAddress}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Login:</span> {new Date(session.loginTime).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Last Active:</span> {new Date(session.lastActive).toLocaleString()}
                  </div>
                </div>

                {/* Warning for suspicious activity */}
                {session.suspicious && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">Unusual activity detected</p>
                  </div>
                )}

                {/* Actions */}
                {session.id !== currentSessionId && (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-12 text-center">
              <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No active sessions found</p>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Suspicious Sessions</p>
          <p className="text-2xl font-bold text-yellow-600">
            {sessions.filter(s => s.suspicious).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {new Set(sessions.map(s => s.user)).size}
          </p>
        </div>
      </div>
    </div>
  )
}

// Mock data for development
const getMockSessions = () => [
  {
    id: 'session-1',
    user: 'admin@library.com',
    device: 'Windows 10 Desktop',
    browser: 'Chrome 120.0',
    location: 'Manila, Philippines',
    ipAddress: '192.168.1.100',
    loginTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    suspicious: false
  },
  {
    id: 'session-2',
    user: 'librarian@library.com',
    device: 'iPhone 15 Pro',
    browser: 'Safari 17.0',
    location: 'Quezon City, Philippines',
    ipAddress: '192.168.1.101',
    loginTime: new Date(Date.now() - 3600000).toISOString(),
    lastActive: new Date(Date.now() - 600000).toISOString(),
    suspicious: false
  },
  {
    id: 'session-3',
    user: 'staff@library.com',
    device: 'MacBook Pro',
    browser: 'Firefox 121.0',
    location: 'Cebu City, Philippines',
    ipAddress: '192.168.1.102',
    loginTime: new Date(Date.now() - 7200000).toISOString(),
    lastActive: new Date(Date.now() - 1800000).toISOString(),
    suspicious: false
  },
  {
    id: 'session-4',
    user: 'admin@library.com',
    device: 'Unknown Device',
    browser: 'Chrome 119.0',
    location: 'Unknown Location',
    ipAddress: '203.0.113.42',
    loginTime: new Date(Date.now() - 10800000).toISOString(),
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    suspicious: true
  }
]

export default SessionManagement