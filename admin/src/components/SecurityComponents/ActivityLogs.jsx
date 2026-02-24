import { useState, useEffect } from 'react'
import { Activity, Search, Filter, Download, Calendar, User, FileText } from 'lucide-react'

const ActivityLogs = ({ dark }) => {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [searchTerm, filterType, dateRange, logs])

  const fetchActivityLogs = async () => {
    setLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/security/activity-logs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
        setFilteredLogs(data)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      // Mock data for development
      setLogs(getMockLogs())
      setFilteredLogs(getMockLogs())
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = [...logs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType)
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(dateRange.start))
    }
    if (dateRange.end) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(dateRange.end))
    }

    setFilteredLogs(filtered)
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Type', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log =>
        [
          log.timestamp,
          log.user,
          log.action,
          log.type,
          log.ipAddress,
          `"${log.details}"`
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getTypeStyle = (type) => {
    if (dark) {
      const styles = {
        login:    { background: 'rgba(34,197,94,0.15)',  color: '#86efac' },
        logout:   { background: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
        create:   { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
        update:   { background: 'rgba(234,179,8,0.15)',  color: '#fde047' },
        delete:   { background: 'rgba(239,68,68,0.15)',  color: '#fca5a5' },
        access:   { background: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
        security: { background: 'rgba(249,115,22,0.15)', color: '#fdba74' },
      }
      return styles[type] || { background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }
    }
    const styles = {
      login:    { background: '#dcfce7', color: '#166534' },
      logout:   { background: '#f1f5f9', color: '#475569' },
      create:   { background: '#dbeafe', color: '#1e40af' },
      update:   { background: '#fef9c3', color: '#854d0e' },
      delete:   { background: '#fee2e2', color: '#991b1b' },
      access:   { background: '#f3e8ff', color: '#6b21a8' },
      security: { background: '#ffedd5', color: '#9a3412' },
    }
    return styles[type] || { background: '#f1f5f9', color: '#475569' }
  }

  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const inputBg      = dark ? '#081422' : '#ffffff'
  const inputBorder  = dark ? '#1a3356' : '#e2e8f0'
  const theadBg      = dark ? '#081422' : '#f8fafc'
  const rowHover     = dark ? '#0d1d35' : '#f8fafc'
  const divider      = dark ? '#1a3356' : '#e2e8f0'
  const iconColor    = dark ? '#93c5fd' : '#2563eb'

  const inputStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg,
    color: textPrimary,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Activity style={{ width: '1.75rem', height: '1.75rem', color: iconColor }} />
          Activity Logs
        </h1>
        <p style={{ color: textSecondary, marginTop: '0.25rem', fontSize: '0.875rem' }}>Monitor and track all system activities</p>
      </div>

      {/* Filters */}
      <div style={{
        background: cardBg, border: `1px solid ${border}`,
        borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted, width: '1.25rem', height: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Type Filter */}
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted, width: '1.25rem', height: '1.25rem' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="access">Access</option>
              <option value="security">Security</option>
            </select>
          </div>

          {/* Date Range */}
          <div style={{ position: 'relative' }}>
            <Calendar style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted, width: '1.25rem', height: '1.25rem' }} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={exportLogs}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.5rem 1rem',
                background: '#2563eb', color: '#ffffff',
                border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500,
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
            >
              <Download style={{ width: '1rem', height: '1rem' }} />
              Export
            </button>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
                setDateRange({ start: '', end: '' })
              }}
              style={{
                padding: '0.5rem 1rem',
                background: inputBg, color: textSecondary,
                border: `1px solid ${border}`, borderRadius: '0.5rem', cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = inputBg}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        background: cardBg, border: `1px solid ${border}`,
        borderRadius: '0.75rem', overflow: 'hidden',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '3rem', height: '3rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: textSecondary }}>Loading activity logs...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: theadBg, borderBottom: `1px solid ${divider}` }}>
                  {['Timestamp', 'User', 'Action', 'Type', 'IP Address', 'Details'].map(h => (
                    <th key={h} style={{
                      padding: '0.75rem 1.5rem', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 600,
                      color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      style={{ borderBottom: `1px solid ${divider}`, transition: 'background 0.15s ease', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.background = rowHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: textPrimary }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User style={{ width: '1rem', height: '1rem', color: textMuted }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary }}>{log.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: textPrimary }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          ...getTypeStyle(log.type),
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem', fontWeight: 600,
                        }}>
                          {log.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: textSecondary }}>
                        {log.ipAddress}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: textSecondary, maxWidth: '24rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: textSecondary }}>
                      <FileText style={{ width: '3rem', height: '3rem', margin: '0 auto 0.75rem', color: textMuted }} />
                      <p style={{ margin: 0 }}>No activity logs found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {filteredLogs.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: textSecondary, textAlign: 'center' }}>
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </div>
  )
}

// Mock data for development
const getMockLogs = () => [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    user: 'admin@library.com',
    action: 'Login',
    type: 'login',
    ipAddress: '192.168.1.100',
    details: 'Successful login from web interface'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    user: 'librarian@library.com',
    action: 'Added Book',
    type: 'create',
    ipAddress: '192.168.1.101',
    details: 'Added "The Great Gatsby" to catalog'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    user: 'admin@library.com',
    action: 'Updated User',
    type: 'update',
    ipAddress: '192.168.1.100',
    details: 'Modified permissions for user ID 45'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    user: 'staff@library.com',
    action: 'Failed Login',
    type: 'security',
    ipAddress: '192.168.1.102',
    details: 'Failed login attempt - invalid password'
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    user: 'librarian@library.com',
    action: 'Deleted Record',
    type: 'delete',
    ipAddress: '192.168.1.101',
    details: 'Removed duplicate catalog entry ID 234'
  }
]

export default ActivityLogs