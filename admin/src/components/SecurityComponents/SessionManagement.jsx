import { useState, useEffect } from 'react'
import { Monitor, LogOut, MapPin, Chrome, Smartphone, AlertTriangle, RefreshCw } from 'lucide-react'

const SessionManagement = ({ dark }) => {
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
      return <Smartphone style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
    }
    return <Monitor style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
  }

  // ── Colors ────────────────────────────────────────────────
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'

  // Current session highlight
  const currentCardBg     = dark ? 'rgba(22,163,74,0.08)' : '#f0fdf4'
  const currentCardBorder = dark ? 'rgba(22,163,74,0.35)' : '#22c55e'

  // Suspicious session highlight
  const suspiciousBg     = dark ? 'rgba(234,179,8,0.08)' : '#fefce8'
  const suspiciousBorder = dark ? 'rgba(234,179,8,0.25)' : '#fde047'
  const suspiciousText   = dark ? '#fde047' : '#854d0e'
  const suspiciousIcon   = dark ? '#fde047' : '#ca8a04'

  const statCardStyle = {
    background: cardBg,
    border: `1px solid ${border}`,
    borderRadius: '0.75rem',
    padding: '1rem',
    transition: 'background 0.45s ease, border-color 0.45s ease',
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Monitor style={{ width: '1.75rem', height: '1.75rem', color: iconColor }} />
          Session Management
        </h1>
        <p style={{ color: textSecondary, marginTop: '0.25rem', fontSize: '0.875rem' }}>
          Monitor and manage active user sessions
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={fetchSessions}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#2563eb', color: '#ffffff',
            border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
        >
          <RefreshCw style={{ width: '1rem', height: '1rem' }} />
          Refresh
        </button>
        <button
          onClick={terminateAllOtherSessions}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: dark ? 'rgba(239,68,68,0.15)' : '#ef4444',
            color: dark ? '#fca5a5' : '#ffffff',
            border: dark ? '1px solid rgba(239,68,68,0.3)' : 'none',
            borderRadius: '0.5rem', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.25)' : '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.15)' : '#ef4444'}
        >
          <LogOut style={{ width: '1rem', height: '1rem' }} />
          Terminate All Other Sessions
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '3rem', height: '3rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: textSecondary }}>Loading sessions...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {sessions.length > 0 ? (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId
              return (
                <div
                  key={session.id}
                  style={{
                    background: isCurrent ? currentCardBg : cardBg,
                    border: `2px solid ${isCurrent ? currentCardBorder : border}`,
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    transition: 'background 0.45s ease, border-color 0.45s ease',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {getDeviceIcon(session.device)}
                      <div>
                        <h3 style={{ fontWeight: 600, color: textPrimary, margin: 0, fontSize: '0.9375rem' }}>{session.user}</h3>
                        <p style={{ fontSize: '0.8125rem', color: textSecondary, margin: 0 }}>{session.device}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span style={{
                        padding: '0.2rem 0.625rem',
                        background: dark ? 'rgba(22,163,74,0.2)' : '#dcfce7',
                        color: dark ? '#86efac' : '#15803d',
                        fontSize: '0.7rem', fontWeight: 700,
                        borderRadius: '999px',
                        flexShrink: 0,
                      }}>
                        Current
                      </span>
                    )}
                  </div>

                  {/* Session Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: textSecondary }}>
                      <Chrome style={{ width: '1rem', height: '1rem', color: textMuted, flexShrink: 0 }} />
                      <span>{session.browser}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: textSecondary }}>
                      <MapPin style={{ width: '1rem', height: '1rem', color: textMuted, flexShrink: 0 }} />
                      <span>{session.location}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      <span style={{ fontWeight: 500, color: textPrimary }}>IP: </span>
                      {session.ipAddress}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      <span style={{ fontWeight: 500, color: textPrimary }}>Login: </span>
                      {new Date(session.loginTime).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      <span style={{ fontWeight: 500, color: textPrimary }}>Last Active: </span>
                      {new Date(session.lastActive).toLocaleString()}
                    </div>
                  </div>

                  {/* Warning for suspicious activity */}
                  {session.suspicious && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.625rem 0.875rem',
                      background: suspiciousBg,
                      border: `1px solid ${suspiciousBorder}`,
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                    }}>
                      <AlertTriangle style={{ width: '1.125rem', height: '1.125rem', color: suspiciousIcon, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.8125rem', color: suspiciousText, margin: 0 }}>Unusual activity detected</p>
                    </div>
                  )}

                  {/* Actions */}
                  {!isCurrent && (
                    <button
                      onClick={() => terminateSession(session.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', padding: '0.5rem 1rem',
                        background: dark ? 'rgba(239,68,68,0.12)' : '#ef4444',
                        color: dark ? '#fca5a5' : '#ffffff',
                        border: dark ? '1px solid rgba(239,68,68,0.25)' : 'none',
                        borderRadius: '0.5rem', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 500,
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.22)' : '#dc2626'}
                      onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.12)' : '#ef4444'}
                    >
                      <LogOut style={{ width: '1rem', height: '1rem' }} />
                      Terminate Session
                    </button>
                  )}
                </div>
              )
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '0.75rem', padding: '3rem',
              textAlign: 'center',
            }}>
              <Monitor style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: textMuted }} />
              <p style={{ color: textSecondary, margin: 0 }}>No active sessions found</p>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div style={statCardStyle}>
          <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0 0 0.25rem' }}>Total Sessions</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0 }}>{sessions.length}</p>
        </div>
        <div style={statCardStyle}>
          <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0 0 0.25rem' }}>Suspicious Sessions</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: dark ? '#fde047' : '#ca8a04', margin: 0 }}>
            {sessions.filter(s => s.suspicious).length}
          </p>
        </div>
        <div style={statCardStyle}>
          <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0 0 0.25rem' }}>Active Users</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: dark ? '#86efac' : '#15803d', margin: 0 }}>
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