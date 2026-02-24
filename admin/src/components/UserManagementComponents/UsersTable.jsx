import { Key, UserX, CheckCircle, Circle, Crown, AlertCircle } from 'lucide-react'

function UsersTable({ users, onResetPassword, onDeactivateAccount, onSetActiveLibrarian, isAdmin, dark = false }) {
  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const theadBg      = dark ? '#081422' : '#f8fafc'
  const rowHover     = dark ? '#0d1d35' : '#f8fafc'
  const divider      = dark ? '#1a3356' : '#e2e8f0'
  const badgeColors = {
    Staff:      dark ? { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '#1e40af' } : { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    Librarian:  dark ? { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '#6d28d9' } : { bg: '#f3e8ff', color: '#6b21a8', border: '#ddd6fe' },
    Patron:     dark ? { bg: 'rgba(251,191,36,0.15)', color: '#fde68a', border: '#b45309' } : { bg: '#fef9c3', color: '#b45309', border: '#fde68a' },
    default:    dark ? { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '#334155' } : { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  }
  const statusColors = {
    Active:   dark ? { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '#10b981' } : { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    Inactive: dark ? { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '#334155' } : { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  }

  const getRoleBadgeStyle = (role) => {
    const c = badgeColors[role] || badgeColors.default
    return {
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: '0.5rem',
      padding: '0.25rem 0.75rem',
      fontWeight: 600,
      fontSize: '0.8rem',
      display: 'inline-block',
    }
  }

  const getStatusBadge = (status) => {
    const c = statusColors[status] || statusColors.Inactive
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`
      }}>
        {status === 'Active' ? <CheckCircle size={14} /> : <Circle size={14} />}
        {status}
      </span>
    )
  }

  const renderActions = (user) => {
    // Button styles
    const btn = {
      padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer',
      transition: 'background 0.2s, color 0.2s',
    }
    const resetBtn = {
      ...btn,
      background: dark ? '#2563eb' : '#2563eb',
      color: '#fff',
      boxShadow: dark ? '0 2px 8px rgba(37,99,235,0.15)' : '0 2px 8px rgba(37,99,235,0.15)',
    }
    const resetBtnHover = dark ? '#1d4ed8' : '#1d4ed8'
    const deactivateBtn = {
      ...btn,
      background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
      color: dark ? '#fca5a5' : '#991b1b',
      border: `1px solid ${dark ? '#991b1b' : '#fecaca'}`,
    }
    const deactivateBtnHover = dark ? 'rgba(239,68,68,0.25)' : '#fecaca'
    // Patron actions
    if (user.role === 'Patron') {
      return (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <button
                onClick={() => onResetPassword(user)}
                style={resetBtn}
                onMouseEnter={e => e.currentTarget.style.background = resetBtnHover}
                onMouseLeave={e => e.currentTarget.style.background = resetBtn.background}
              >
                <Key size={14} />
                Reset Password
              </button>
              {user.status === 'Active' && (
                <button
                  onClick={() => onDeactivateAccount(user.id)}
                  style={deactivateBtn}
                  onMouseEnter={e => e.currentTarget.style.background = deactivateBtnHover}
                  onMouseLeave={e => e.currentTarget.style.background = deactivateBtn.background}
                >
                  <UserX size={14} />
                  Deactivate
                </button>
              )}
            </>
          )}
          {!isAdmin && <span style={{ fontSize: '0.85rem', color: textMuted }}>No actions available</span>}
        </div>
      )
    }

    // Librarian actions
    if (user.role === 'Librarian') {
      return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {user.isActiveLibrarian ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700, background: dark ? '#f59e0b' : '#f59e0b', color: '#fff', boxShadow: dark ? '0 2px 8px rgba(251,191,36,0.15)' : '0 2px 8px rgba(251,191,36,0.15)' }}>
              <Crown size={16} className="fill-white" />
              <span>Active Librarian</span>
            </div>
          ) : (
            <>
              {isAdmin ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSetActiveLibrarian(user.id)}
                    style={{ ...btn, background: dark ? '#6366f1' : '#6366f1', color: '#fff' }}
                    title="Set as active librarian (will deactivate current active librarian)"
                    onMouseEnter={e => e.currentTarget.style.background = dark ? '#4338ca' : '#4338ca'}
                    onMouseLeave={e => e.currentTarget.style.background = dark ? '#6366f1' : '#6366f1'}
                  >
                    <Crown size={16} />
                    <span>Set as Active</span>
                  </button>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: dark ? 'rgba(148,163,184,0.12)' : '#f1f5f9', color: textMuted, border: `1px solid ${divider}` }}>
                    <AlertCircle size={12} />
                    Inactive
                  </span>
                </div>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: dark ? 'rgba(148,163,184,0.12)' : '#f1f5f9', color: textMuted, border: `1px solid ${divider}` }}>
                  <AlertCircle size={14} />
                  Inactive Librarian
                </span>
              )}
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => onResetPassword(user)}
              style={resetBtn}
              onMouseEnter={e => e.currentTarget.style.background = resetBtnHover}
              onMouseLeave={e => e.currentTarget.style.background = resetBtn.background}
            >
              <Key size={14} />
              Reset Password
            </button>
          )}
        </div>
      )
    }

    // Staff actions
    if (user.role === 'Staff') {
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isAdmin ? (
            <button
              onClick={() => onResetPassword(user)}
              style={resetBtn}
              onMouseEnter={e => e.currentTarget.style.background = resetBtnHover}
              onMouseLeave={e => e.currentTarget.style.background = resetBtn.background}
            >
              <Key size={14} />
              Reset Password
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: textMuted }}>No actions available</span>
          )}
        </div>
      )
    }

    return null
  }

  if (users.length === 0) {
    return (
      <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: '1rem', boxShadow: dark ? '0 25px 50px -12px rgba(16, 37, 70, 0.65)' : '0 25px 50px -12px rgba(0, 0, 0, 0.35)', color: textPrimary, padding: '3rem', textAlign: 'center' }}>
        <div style={{ color: textMuted, marginBottom: '1.5rem' }}>
          <Circle size={64} style={{ opacity: 0.5 }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, marginBottom: '0.5rem' }}>
          No users found
        </h3>
        <p style={{ color: textSecondary, fontSize: '1rem' }}>Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: '1rem', boxShadow: dark ? '0 25px 50px -12px rgba(16, 37, 70, 0.65)' : '0 25px 50px -12px rgba(0, 0, 0, 0.35)', color: textPrimary, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theadBg, borderBottom: `1px solid ${divider}` }}>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email/Username</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Added</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: dark ? '#f8fafc' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  background: user.role === 'Librarian' && user.isActiveLibrarian ? (dark ? 'rgba(251,191,36,0.08)' : 'transparent') : 'transparent',
                  transition: 'background 0.15s',
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                  borderBottom: `1px solid ${divider}`,
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = rowHover}
                onMouseLeave={e => e.currentTarget.style.background = user.role === 'Librarian' && user.isActiveLibrarian ? (dark ? 'rgba(251,191,36,0.08)' : 'transparent') : 'transparent'}
              >
                <td style={{ padding: '0.75rem 1.5rem', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#fff', background: getAvatarColor(user.name), position: 'relative',
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      {user.isActiveLibrarian && (
                        <div style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: '#f59e0b', borderRadius: '50%', border: `2px solid ${cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Crown size={10} style={{ color: '#fff' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: dark ? '#f8fafc' : textPrimary, fontSize: '1rem', letterSpacing: 0.2 }}>{user.name}</div>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1.5rem', color: dark ? '#f8fafc' : textSecondary, fontSize: '0.95rem', fontWeight: dark ? 600 : 400 }}>{user.email}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(user.status)}</td>
                <td style={{ padding: '0.75rem 1.5rem', color: dark ? '#f8fafc' : textSecondary, fontSize: '0.95rem', fontWeight: dark ? 600 : 400 }}>
                  {new Date(user.dateAdded).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>{renderActions(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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

// Helper function to generate solid colors based on name
function getAvatarColor(name) {
  const colors = [
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#64748b'  // Slate
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default UsersTable