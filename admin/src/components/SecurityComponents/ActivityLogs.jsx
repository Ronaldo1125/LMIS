import { useState, useEffect, useCallback, useRef } from 'react'
import { Activity, FileText, User, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/24/outline'

// ─── helpers ──────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
})

const normaliseLog = (row) => ({
  ...row,
  timestamp: row.created_at,
  user:      row.user_name   ?? row.user ?? '—',
  details:   row.description ?? row.details ?? '—',
  type:      row.entity_type ?? row.type ?? 'access',
  ipAddress: row.ip_address  ?? row.ipAddress ?? '—',
})

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ─── main component ───────────────────────────────────────────────────────────

const ActivityLogs = ({ dark }) => {
  const [logs, setLogs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const [searchTerm, setSearchTerm]     = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')
  const debouncedSearch                 = useDebounce(searchTerm, 450)

  const [actionOptions, setActionOptions] = useState([])
  const [isActionOpen, setIsActionOpen]   = useState(false)

  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, pages: 1 })

  const [showPurge, setShowPurge] = useState(false)
  const [purging, setPurging]     = useState(false)
  const [purgeDays, setPurgeDays] = useState(90)

  const dropdownRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsActionOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    fetch(`${API_BASE}/activity-logs/actions`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => setActionOptions(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ page, limit: pagination.limit })
    if (debouncedSearch)        params.set('search',    debouncedSearch)
    if (filterAction !== 'all') params.set('action',    filterAction)
    if (dateFrom)               params.set('date_from', dateFrom)
    if (dateTo)                 params.set('date_to',   dateTo)

    try {
      const res = await fetch(`${API_BASE}/activity-logs?${params}`, { headers: authHeaders() })
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const json = await res.json()
      setLogs((json.data ?? []).map(normaliseLog))
      setPagination(json.pagination ?? { total: 0, page: 1, limit: 50, pages: 1 })
    } catch (err) {
      setError(err.message)
      const mocks = getMockLogs()
      setLogs(mocks)
      setPagination({ total: mocks.length, page: 1, limit: 50, pages: 1 })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filterAction, dateFrom, dateTo, pagination.limit])

  useEffect(() => { fetchLogs(1) }, [debouncedSearch, filterAction, dateFrom, dateTo, fetchLogs])

  const clearFilters = () => {
    setSearchTerm('')
    setFilterAction('all')
    setDateFrom('')
    setDateTo('')
  }

  const exportLogs = async () => {
    const params = new URLSearchParams({ page: 1, limit: 200 })
    if (debouncedSearch)        params.set('search',    debouncedSearch)
    if (filterAction !== 'all') params.set('action',    filterAction)
    if (dateFrom)               params.set('date_from', dateFrom)
    if (dateTo)                 params.set('date_to',   dateTo)

    let exportRows = logs
    try {
      const res = await fetch(`${API_BASE}/activity-logs?${params}`, { headers: authHeaders() })
      if (res.ok) {
        const json = await res.json()
        exportRows = (json.data ?? []).map(normaliseLog)
      }
    } catch { /* empty */ }

    const csv = [
      ['Timestamp', 'User', 'Action', 'Type', 'IP Address', 'Details'].join(','),
      ...exportRows.map(l =>
        [l.timestamp, l.user, l.action, l.type, l.ipAddress, `"${l.details}"`].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const purgeLogs = async () => {
    setPurging(true)
    try {
      const res = await fetch(`${API_BASE}/activity-logs?older_than_days=${purgeDays}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error('Purge failed')
      setShowPurge(false)
      fetchLogs(1)
    } catch (err) {
      alert(err.message)
    } finally {
      setPurging(false)
    }
  }

  // ── theme tokens ───────────────────────────────────────────────────────────
  const pageBg        = dark ? '#0a1628' : '#f8fafc'
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const inputBg       = dark ? '#0d1d35' : '#ffffff'
  const inputBorder   = dark ? '#1a3356' : '#e2e8f0'
  const theadBg       = dark ? '#081422' : '#f8fafc'
  const rowHover      = dark ? '#0d1d35' : '#f8fafc'
  const divider       = dark ? '#1a3356' : '#e2e8f0'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'
  const dropdownBg    = dark ? '#162a4a' : '#ffffff'
  const dangerColor   = dark ? '#fca5a5' : '#dc2626'

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 2.5rem 0.625rem 2.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg,
    color: textPrimary,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box',
  }

  const ALL_ACTIONS = ['all', ...actionOptions]

  return (
    <div style={{ padding: '1.5rem' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Activity style={{ width: '1.75rem', height: '1.75rem', color: iconColor }} />
            Activity Logs
          </h1>
          <p style={{ color: textSecondary, marginTop: '0.25rem', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            Monitor and track all system activities
          </p>
        </div>
        <button
          onClick={() => setShowPurge(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: 'transparent', border: `1px solid ${dangerColor}`,
            color: dangerColor, fontSize: '0.8rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.12)' : '#fee2e2' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <Trash2 style={{ width: '0.95rem', height: '0.95rem' }} />
          Purge Logs
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '0.5rem',
          background: dark ? 'rgba(239,68,68,0.12)' : '#fee2e2',
          border: `1px solid ${dangerColor}`, color: dangerColor,
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <ExclamationTriangleIcon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
          API error — showing cached/mock data. ({error})
        </div>
      )}

      {/* Sticky Filter Card */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: pageBg,
        paddingBottom: '0.75rem',
        transition: 'background 0.45s ease',
      }}>
        <div style={{
          background: cardBg, padding: '1.25rem', borderRadius: '0.75rem',
          border: `1px solid ${border}`,
          boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.45s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
              <input
                type="text"
                placeholder="Search by user, action, or details..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
              {searchTerm && (
                <XMarkIcon onClick={() => setSearchTerm('')} style={{ width: '1.125rem', height: '1.125rem', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: textSecondary }} />
              )}
            </div>

            {/* Action Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 180px', position: 'relative' }} ref={dropdownRef}>
              <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary, flexShrink: 0 }} />
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  onClick={() => setIsActionOpen(o => !o)}
                  style={{
                    width: '100%', padding: '0.625rem 1rem',
                    background: inputBg, border: `1px solid ${inputBorder}`,
                    borderRadius: '0.5rem', textAlign: 'left', color: textPrimary,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  <span>{filterAction === 'all' ? 'All Actions' : filterAction}</span>
                  <span style={{ color: textSecondary }}>▾</span>
                </button>
                {isActionOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', left: 0, width: '100%',
                    background: dropdownBg, border: `1px solid ${border}`,
                    borderRadius: '0.5rem', zIndex: 50, overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}>
                    <div style={{ maxHeight: '14rem', overflowY: 'auto', padding: '0.5rem 0' }}>
                      {ALL_ACTIONS.map(opt => (
                        <TypeOption
                          key={opt}
                          label={opt === 'all' ? 'All Actions' : opt}
                          active={filterAction === opt}
                          onClick={() => { setFilterAction(opt); setIsActionOpen(false) }}
                          dark={dark}
                          textPrimary={textPrimary}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date From */}
            <div style={{ position: 'relative', flex: '1 1 155px' }}>
              <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{ ...inputStyle, colorScheme: dark ? 'dark' : 'light' }}
              />
            </div>

            {/* Date To */}
            <div style={{ position: 'relative', flex: '1 1 155px' }}>
              <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{ ...inputStyle, colorScheme: dark ? 'dark' : 'light' }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <ActionButton onClick={clearFilters} icon={XCircleIcon} label="Clear" dark={dark} inputBg={inputBg} border={border} textSecondary={textSecondary} />
              <ActionButton onClick={exportLogs} icon={ArrowDownTrayIcon} label="Export CSV" variant="primary" dark={dark} inputBg={inputBg} border={border} textSecondary={textSecondary} />
            </div>
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
            <div style={{ display: 'inline-block', width: '3rem', height: '3rem', borderRadius: '50%', border: '2px solid transparent', borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: textSecondary }}>Loading activity logs...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: theadBg, borderBottom: `1px solid ${divider}` }}>
                  {['Timestamp', 'User', 'Action', 'Type', 'IP Address', 'Details'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map(log => (
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
                        {log.user_avatar
                          ? <img src={log.user_avatar} alt="" style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                          : <User style={{ width: '1rem', height: '1rem', color: textMuted }} />
                        }
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary }}>{log.user}</span>
                        {log.user_is_active === 0 && (
                          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2', color: dangerColor }}>inactive</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: textPrimary }}>{log.action}</td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <span style={{ ...getTypeStyle(log.type, dark), padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: textSecondary }}>{log.ipAddress}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: textSecondary, maxWidth: '24rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</td>
                  </tr>
                )) : (
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <PaginationBtn
            onClick={() => fetchLogs(pagination.page - 1)}
            disabled={pagination.page <= 1}
            dark={dark} inputBg={inputBg} border={border} textPrimary={textPrimary} textMuted={textMuted}
          >
            <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
          </PaginationBtn>
          <span style={{ fontSize: '0.875rem', color: textSecondary }}>
            Page <strong style={{ color: textPrimary }}>{pagination.page}</strong> of <strong style={{ color: textPrimary }}>{pagination.pages}</strong>
            <span style={{ marginLeft: '0.5rem', color: textMuted }}>({pagination.total} total)</span>
          </span>
          <PaginationBtn
            onClick={() => fetchLogs(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            dark={dark} inputBg={inputBg} border={border} textPrimary={textPrimary} textMuted={textMuted}
          >
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </PaginationBtn>
        </div>
      )}

      {pagination.pages <= 1 && logs.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: textSecondary, textAlign: 'center' }}>
          Showing {logs.length} of {pagination.total} logs
        </div>
      )}

      {/* Purge Confirm Dialog */}
      {showPurge && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowPurge(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '26rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ExclamationTriangleIcon style={{ width: '1.25rem', height: '1.25rem', color: dangerColor }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: textPrimary }}>Purge Activity Logs</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: textSecondary }}>This action cannot be undone.</p>
              </div>
            </div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: textSecondary }}>
              Delete logs older than:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input
                type="number" min={1} max={365} value={purgeDays}
                onChange={e => setPurgeDays(Number(e.target.value))}
                style={{ ...inputStyle, padding: '0.5rem 0.75rem', width: '5rem' }}
              />
              <span style={{ color: textSecondary, fontSize: '0.875rem' }}>days</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPurge(false)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', background: 'transparent', border: `1px solid ${border}`, color: textSecondary, fontWeight: 600, fontSize: '0.875rem' }}
              >
                Cancel
              </button>
              <button
                onClick={purgeLogs}
                disabled={purging}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: purging ? 'wait' : 'pointer', background: dangerColor, border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.875rem', opacity: purging ? 0.7 : 1 }}
              >
                {purging ? 'Purging…' : `Delete older than ${purgeDays}d`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── sub-components ───────────────────────────────────────────────────────────

const TypeOption = ({ label, active, onClick, dark, textPrimary }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: '100%', padding: '0.5rem 1rem', textAlign: 'left',
        fontSize: '0.875rem', cursor: 'pointer', border: 'none',
        background: hover ? (dark ? '#1a3356' : '#f1f5f9') : active ? (dark ? 'rgba(21,74,154,0.2)' : '#eff6ff') : 'transparent',
        color: textPrimary, fontWeight: active ? 600 : 400, transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

// eslint-disable-next-line no-unused-vars
const ActionButton = ({ onClick, icon: Icon, label, variant, dark, inputBg, border, textSecondary }) => {
  const [hover, setHover] = useState(false)
  const c = variant === 'primary'
    ? { bg: dark ? '#154A9A' : '#1e293b', text: '#fff', hoverBg: '#1a3a6d' }
    : { bg: dark ? 'rgba(255,255,255,0.05)' : '#fff', text: dark ? '#6b8cae' : '#4b5563', hoverBg: dark ? '#1a3356' : '#f1f5f9' }
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
        background: hover ? c.hoverBg : c.bg,
        border: variant === 'primary' ? 'none' : `1px solid ${border}`,
        color: c.text, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <Icon style={{ width: '1.125rem', height: '1.125rem' }} />
      <span>{label}</span>
    </button>
  )
}

const PaginationBtn = ({ onClick, disabled, children, dark, inputBg, border, textPrimary, textMuted }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '2rem', height: '2rem', borderRadius: '0.5rem',
        background: hover && !disabled ? (dark ? '#1a3356' : '#f1f5f9') : inputBg,
        border: `1px solid ${border}`,
        color: disabled ? textMuted : textPrimary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )
}

// ─── type badge colours ───────────────────────────────────────────────────────

const getTypeStyle = (type, dark) => {
  if (dark) {
    const s = {
      login:    { background: 'rgba(34,197,94,0.15)',   color: '#86efac' },
      logout:   { background: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
      create:   { background: 'rgba(59,130,246,0.15)',  color: '#93c5fd' },
      update:   { background: 'rgba(234,179,8,0.15)',   color: '#fde047' },
      delete:   { background: 'rgba(239,68,68,0.15)',   color: '#fca5a5' },
      access:   { background: 'rgba(168,85,247,0.15)',  color: '#d8b4fe' },
      security: { background: 'rgba(249,115,22,0.15)',  color: '#fdba74' },
    }
    return s[type] || { background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }
  }
  const s = {
    login:    { background: '#dcfce7', color: '#166534' },
    logout:   { background: '#f1f5f9', color: '#475569' },
    create:   { background: '#dbeafe', color: '#1e40af' },
    update:   { background: '#fef9c3', color: '#854d0e' },
    delete:   { background: '#fee2e2', color: '#991b1b' },
    access:   { background: '#f3e8ff', color: '#6b21a8' },
    security: { background: '#ffedd5', color: '#9a3412' },
  }
  return s[type] || { background: '#f1f5f9', color: '#475569' }
}

// ─── mock data (dev fallback only) ────────────────────────────────────────────

const getMockLogs = () => [
  { id: 1, created_at: new Date().toISOString(),                   user_name: 'admin@library.com',     action: 'LOGIN',         entity_type: 'login',    ip_address: '192.168.1.100', description: 'Successful login from web interface' },
  { id: 2, created_at: new Date(Date.now() - 300000).toISOString(),  user_name: 'librarian@library.com', action: 'CREATE_BOOK',   entity_type: 'create',   ip_address: '192.168.1.101', description: 'Added "The Great Gatsby" to catalog' },
  { id: 3, created_at: new Date(Date.now() - 600000).toISOString(),  user_name: 'admin@library.com',     action: 'UPDATE_USER',   entity_type: 'update',   ip_address: '192.168.1.100', description: 'Modified permissions for user ID 45' },
  { id: 4, created_at: new Date(Date.now() - 900000).toISOString(),  user_name: 'staff@library.com',     action: 'LOGIN_FAILURE', entity_type: 'security', ip_address: '192.168.1.102', description: 'Failed login attempt — invalid password' },
  { id: 5, created_at: new Date(Date.now() - 1200000).toISOString(), user_name: 'librarian@library.com', action: 'DELETE_RECORD', entity_type: 'delete',   ip_address: '192.168.1.101', description: 'Removed duplicate catalog entry ID 234' },
]

export default ActivityLogs