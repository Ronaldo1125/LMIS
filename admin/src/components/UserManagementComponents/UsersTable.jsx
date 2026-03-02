import { Key, UserX, CheckCircle, Circle, Crown, AlertCircle, UserCheck, ShieldCheck } from 'lucide-react'

// source === 'adminpanel' → Admin or Librarian row (read-only type, different table)
// source === 'users'      → Staff or Patron row (type is mutable via /api/usertype)

function UsersTable({
  users,
  onResetPassword,
  onDeactivateAccount,
  onSetActiveLibrarian,
  onMakePatron,
  onMakeStaff,
  isAdmin,
  isStaff,
  dark = false,
}) {
  // ── Colors ────────────────────────────────────────────────
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const theadBg       = dark ? '#081422' : '#f8fafc'
  const rowHover      = dark ? '#0d1d35' : '#f8fafc'
  const divider       = dark ? '#1a3356' : '#e2e8f0'

  const badgeColors = {
    Admin:     dark ? { bg: 'rgba(239,68,68,0.15)',   color: '#fca5a5', border: '#991b1b' } : { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    Staff:     dark ? { bg: 'rgba(59,130,246,0.15)',  color: '#93c5fd', border: '#1e40af' } : { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    Librarian: dark ? { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '#6d28d9' } : { bg: '#f3e8ff', color: '#6b21a8', border: '#ddd6fe' },
    Patron:    dark ? { bg: 'rgba(251,191,36,0.15)',  color: '#fde68a', border: '#b45309' } : { bg: '#fef9c3', color: '#b45309', border: '#fde68a' },
    default:   dark ? { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '#334155' } : { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  }

  const statusColors = {
    Active:   dark ? { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '#10b981' } : { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    Inactive: dark ? { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '#334155' } : { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  }

  const getRoleBadgeStyle = (role) => {
    const c = badgeColors[role] || badgeColors.default
    return {
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: '0.5rem', padding: '0.25rem 0.75rem',
      fontWeight: 600, fontSize: '0.8rem', display: 'inline-block',
    }
  }

  const getStatusBadge = (status) => {
    const c = statusColors[status] || statusColors.Inactive
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      }}>
        {status === 'Active' ? <CheckCircle size={14} /> : <Circle size={14} />}
        {status || 'Unknown'}
      </span>
    )
  }

  const renderActions = (user) => {
    const btn = {
      padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      border: 'none', cursor: 'pointer', transition: 'background 0.2s',
    }
    const resetBtn = {
      ...btn,
      background: '#2563eb', color: '#fff',
      boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
    }
    const deactivateBtn = {
      ...btn,
      background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
      color: dark ? '#fca5a5' : '#991b1b',
      border: `1px solid ${dark ? '#991b1b' : '#fecaca'}`,
    }
    const makeStaffBtn = {
      ...btn,
      background: dark ? 'rgba(16,185,129,0.15)' : '#d1fae5',
      color: dark ? '#6ee7b7' : '#065f46',
      border: `1px solid ${dark ? '#10b981' : '#6ee7b7'}`,
    }

    // ── Admin row ────────────────────────────────────────────
    if (user.role === 'Admin') {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600,
          background: dark ? 'rgba(239,68,68,0.1)' : '#fee2e2',
          color: dark ? '#fca5a5' : '#991b1b',
          border: `1px solid ${dark ? '#991b1b' : '#fecaca'}`,
        }}>
          <ShieldCheck size={13} />
          System Account
        </span>
      )
    }

    // ── Librarian row ────────────────────────────────────────────────────────────
if (user.role === 'Librarian') {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {user.isActiveLibrarian ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700,
          background: '#f59e0b', color: '#fff',
          boxShadow: '0 2px 8px rgba(251,191,36,0.15)',
        }}>
          <Crown size={16} />
          Active Librarian
        </div>
      ) : (
        isAdmin && (
          <button
            onClick={() => onSetActiveLibrarian(user.id)}
            style={{ ...btn, background: '#6366f1', color: '#fff' }}
            title="Set as active librarian"
            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
          >
            <Crown size={16} />
            Set as Active
          </button>
        )
      )}
      {isAdmin && (
        <button
          onClick={() => onResetPassword(user)}
          style={resetBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
        >
          <Key size={14} /> Reset Password
        </button>
      )}
    </div>
  )
}

    // ── Patron row ───────────────────────────────────────────
    if (user.role === 'Patron') {
  const canAct = isAdmin || isStaff
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {canAct && (
        <button
          onClick={() => onMakeStaff(user)}
          style={makeStaffBtn}
          title="Promote this patron to Staff"
          onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(16,185,129,0.28)' : '#a7f3d0'}
          onMouseLeave={e => e.currentTarget.style.background = makeStaffBtn.background}
        >
          <UserCheck size={14} /> Make Staff
        </button>
      )}
      {isAdmin && user.status === 'Active' && (
        <button
          onClick={() => onDeactivateAccount(user.id)}
          style={deactivateBtn}
          onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.28)' : '#fecaca'}
          onMouseLeave={e => e.currentTarget.style.background = deactivateBtn.background}
        >
          <UserX size={14} /> Deactivate
        </button>
      )}
      {!canAct && <span style={{ fontSize: '0.85rem', color: textMuted }}>No actions available</span>}
    </div>
  )
}

    // ── Staff row ────────────────────────────────────────────
    if (user.role === 'Staff') {
  const canAct = isAdmin || isStaff
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {canAct ? (
        <button
          onClick={() => onMakePatron(user)}
          style={{
            ...btn,
            background: dark ? 'rgba(251,191,36,0.15)' : '#fef9c3',
            color: dark ? '#fde68a' : '#b45309',
            border: `1px solid ${dark ? '#b45309' : '#fde68a'}`,
          }}
          title="Demote this staff to Patron"
          onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(251,191,36,0.28)' : '#fde68a'}
          onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(251,191,36,0.15)' : '#fef9c3'}
        >
          <UserX size={14} /> Make Patron
        </button>
      ) : (
        <span style={{ fontSize: '0.85rem', color: textMuted }}>No actions available</span>
      )}
    </div>
  )
}
    return null
  }

  if (!users || users.length === 0) {
    return (
      <div style={{
        background: cardBg, border: `1.5px solid ${border}`, borderRadius: '1rem',
        boxShadow: dark ? '0 25px 50px -12px rgba(16,37,70,0.65)' : '0 25px 50px -12px rgba(0,0,0,0.35)',
        color: textPrimary, padding: '3rem', textAlign: 'center',
      }}>
        <div style={{ color: textMuted, marginBottom: '1.5rem' }}>
          <Circle size={64} style={{ opacity: 0.5 }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, marginBottom: '0.5rem' }}>No users found</h3>
        <p style={{ color: textSecondary, fontSize: '1rem' }}>Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div style={{
      background: cardBg, border: `1.5px solid ${border}`, borderRadius: '1rem',
      boxShadow: dark ? '0 25px 50px -12px rgba(16,37,70,0.65)' : '0 25px 50px -12px rgba(0,0,0,0.35)',
      color: textPrimary, overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theadBg, borderBottom: `1px solid ${divider}` }}>
              {['Name', 'Email / Username', 'Role', 'Status', 'Date Added', 'Actions'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700,
                  color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const isActiveLib = user.role === 'Librarian' && user.isActiveLibrarian
              const baseBg = isActiveLib ? (dark ? 'rgba(251,191,36,0.08)' : 'rgba(245,158,11,0.04)') : 'transparent'

              // ── Safe display values ──────────────────────────
              const displayName   = user.name || user.full_name || user.username || 'Unknown'
              const displayEmail  = user.email || user.username || '—'
              const displayRole   = user.role  || 'Unknown'
              const displayStatus = user.status || 'Inactive'
              const displayDate   = user.dateAdded || user.created_at

              return (
                <tr
                  key={`${user.source}-${user.id}`}
                  style={{
                    background: baseBg,
                    transition: 'background 0.15s',
                    animation: `fadeIn 0.3s ease-out ${index * 0.04}s both`,
                    borderBottom: `1px solid ${divider}`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = baseBg}
                >
                  {/* Name + Avatar */}
                  <td style={{ padding: '0.75rem 1.5rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '1rem', color: '#fff',
                        background: getAvatarColor(displayName), position: 'relative',
                      }}>
                        {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        {user.isActiveLibrarian && (
                          <div style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 20, height: 20, background: '#f59e0b', borderRadius: '50%',
                            border: `2px solid ${cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Crown size={10} style={{ color: '#fff' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, color: dark ? '#f8fafc' : textPrimary, fontSize: '1rem' }}>
                        {displayName}
                      </div>
                    </div>
                  </td>

                  {/* Email / Username */}
                  <td style={{ padding: '0.75rem 1.5rem', color: dark ? '#f8fafc' : textSecondary, fontSize: '0.95rem', fontWeight: dark ? 600 : 400 }}>
                    {displayEmail}
                  </td>

                  {/* Role badge */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={getRoleBadgeStyle(displayRole)}>{displayRole}</span>
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(displayStatus)}</td>

                  {/* Date Added */}
                  <td style={{ padding: '0.75rem 1.5rem', color: dark ? '#f8fafc' : textSecondary, fontSize: '0.95rem', fontWeight: dark ? 600 : 400 }}>
                    {displayDate
                      ? new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'
                    }
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.5rem' }}>{renderActions(user)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function getAvatarColor(name) {
  const colors = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#64748b']
  if (!name) return colors[0]
  return colors[name.charCodeAt(0) % colors.length]
}

export default UsersTable