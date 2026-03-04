import { useState } from 'react'
import { KeyIcon, CheckIcon, SunIcon, MoonIcon, PaintBrushIcon } from '@heroicons/react/24/outline'

/*
  Add this to your global CSS (index.css) for smooth full-page transitions:

  *, *::before, *::after {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.3s ease, box-shadow 0.4s ease;
  }
*/

const MyProfile = ({ user, setCurrentView, dark, setDark }) => {
  const fullName = user?.full_name || user?.username || 'User'
  const username = user?.username || ''
  const role = user?.role || ''
  const email = user?.email || `${username}@lmis-dro5.gov`
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRoleLabel = (r) => {
    switch (r) {
      case 'admin':     return 'Administrator'
      case 'librarian': return 'Librarian'
      case 'staff':     return 'Staff'
      case 'patron':    return 'Patron'
      default:          return r
    }
  }

  const getRoleBadgeStyle = (r) => {
    if (dark) {
      switch (r) {
        case 'admin':     return { background: 'rgba(168,85,247,0.15)', color: '#c084fc' }
        case 'librarian': return { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }
        case 'staff':     return { background: 'rgba(34,197,94,0.15)',  color: '#86efac' }
        default:          return { background: 'rgba(180,180,180,0.1)', color: '#9ca3af' }
      }
    }
    switch (r) {
      case 'admin':     return { background: '#f3e8ff', color: '#7e22ce' }
      case 'librarian': return { background: '#dbeafe', color: '#1d4ed8' }
      case 'staff':     return { background: '#dcfce7', color: '#15803d' }
      default:          return { background: '#f1f5f9', color: '#475569' }
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPwError('Passwords do not match.'); return }
    if (passwordForm.newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`http://localhost:5000/api/adminpanel-users/${user.id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passwordForm.newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update password.')
      setPwSuccess(true)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ─── Navy color system — matches the rest of the app ─────────────────────
  const C = {
    // Backgrounds
    pageBg:  dark ? '#0a1628' : '#f1f5f9',
    cardBg:  dark ? '#0f1f38' : '#ffffff',
    insetBg: dark ? '#081422' : '#f8fafc',

    // Borders
    border:  dark ? '#1a3356' : '#e2e8f0',

    // Text
    textPrimary:   dark ? '#dde8f5' : '#1e293b',
    textSecondary: dark ? '#6b8cae' : '#64748b',
    textMuted:     dark ? '#2e4d70' : '#94a3b8',

    // Input
    inputBg: dark ? '#081422' : '#ffffff',

    // Banner — blue gradient in both modes
    banner: dark
      ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)'
      : 'linear-gradient(135deg, var(--dark-blue-1) 0%, var(--dark-blue-2) 100%)',

    // Toggle pill — purple glow in dark, amber in light
    pillBg:   dark ? '#2563eb' : '#f59e0b',
    pillGlow: dark
      ? '0 0 16px rgba(168,85,247,0.5), 0 0 32px rgba(168,85,247,0.2), 0 2px 8px rgba(0,0,0,0.4)'
      : '0 0 18px rgba(245,158,11,0.45)',

    // Icon box
    iconBoxBg:   dark ? 'rgba(37,99,235,0.15)' : 'rgba(245,158,11,0.14)',
    iconBoxGlow: dark ? '0 0 10px rgba(37,99,235,0.2)' : '0 0 14px rgba(245,158,11,0.28)',
  }

  const cardStyle = {
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '1.125rem',
    boxShadow: dark
      ? '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset'
      : '0 1px 8px rgba(0,0,0,0.05)',
    transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
    overflow: 'hidden',
  }

  const insetCell = {
    background: C.insetBg,
    border: `1px solid ${C.border}`,
    borderRadius: '0.75rem',
    padding: '0.875rem',
    transition: 'background 0.4s ease, border-color 0.4s ease',
  }

  const inputBase = {
    background: C.inputBg,
    border: `1px solid ${C.border}`,
    color: C.textPrimary,
    borderRadius: '0.5rem',
    padding: '0.625rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'background 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, padding: '1.5rem', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>

        {/* ── Profile Card ─────────────────────────────────────────── */}
        <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>

          {/* Banner — uses C.banner so light mode stays blue */}
          <div style={{ height: '6rem', background: C.banner, transition: 'background 0.4s ease' }} />

          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-2.5rem', marginBottom: '1rem' }}>

              {/* Avatar */}
              <div style={{
                width: '5rem', height: '5rem', borderRadius: '1rem', flexShrink: 0,
                border: `4px solid ${C.cardBg}`,
                boxShadow: dark ? '0 4px 16px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--dark-blue-1), var(--dark-blue-2))',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.75rem', textTransform: 'uppercase' }}>
                  {fullName.charAt(0)}
                </span>
              </div>

              {/* Role Badge */}
              <div style={{ paddingBottom: '0.25rem' }}>
                <span style={{
                  ...getRoleBadgeStyle(role),
                  borderRadius: '999px', padding: '0.2rem 0.75rem',
                  fontSize: '0.7rem', fontWeight: 600,
                  transition: 'background 0.4s ease, color 0.3s ease',
                }}>
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.125rem' }}>{fullName}</h2>
            <p style={{ fontSize: '0.875rem', color: C.textSecondary, margin: 0 }}>@{username}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                { label: 'Email',        value: email },
                { label: 'Role',         value: getRoleLabel(role) },
                { label: 'Username',     value: username },
                { label: 'Member Since', value: createdAt },
              ].map(({ label, value }) => (
                <div key={label} style={insetCell}>
                  <p style={{ fontSize: '0.65rem', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>{label}</p>
                  <p style={{ fontSize: '0.875rem', color: C.textPrimary, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Customize ─────────────────────────────────────────────── */}
        <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(30,64,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PaintBrushIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--dark-blue-1)' }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: C.textPrimary, margin: 0 }}>Customize</h3>
              <p style={{ fontSize: '0.75rem', color: C.textSecondary, margin: 0 }}>Personalize your experience</p>
            </div>
          </div>

          {/* Toggle row */}
          <div style={{ ...insetCell, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

              {/* Animated icon box */}
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.iconBoxBg,
                boxShadow: C.iconBoxGlow,
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}>
                <div style={{ position: 'relative', width: '1.2rem', height: '1.2rem' }}>
                  <SunIcon style={{
                    position: 'absolute', inset: 0, width: '1.2rem', height: '1.2rem', color: '#f59e0b',
                    opacity: dark ? 0 : 1,
                    transform: dark ? 'scale(0.3) rotate(90deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                  <MoonIcon style={{
                    position: 'absolute', inset: 0, width: '1.2rem', height: '1.2rem',
                    color: '#e2d9f3',
                    filter: dark ? 'drop-shadow(0 0 6px #c084fc) drop-shadow(0 0 12px #a855f7)' : 'none',
                    opacity: dark ? 1 : 0,
                    transform: dark ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-90deg)',
                    transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: C.textPrimary, margin: 0 }}>
                  {dark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p style={{ fontSize: '0.75rem', color: C.textSecondary, margin: 0 }}>
                  {dark ? 'Switch to light theme' : 'Switch to dark theme'}
                </p>
              </div>
            </div>

            {/* ── Pill toggle ── */}
            <button
              onClick={() => setDark(prev => !prev)}
              aria-label="Toggle dark mode"
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center',
                width: '3.5rem', height: '1.875rem',
                borderRadius: '999px', padding: '0.22rem',
                border: 'none', cursor: 'pointer', flexShrink: 0,
                background: C.pillBg,
                boxShadow: C.pillGlow,
                outline: 'none',
                transition: 'background 0.4s ease, box-shadow 0.4s ease',
              }}
            >
              {/* Shine overlay */}
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '999px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                pointerEvents: 'none',
              }} />

              {/* Thumb */}
              <span style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '1.4rem', height: '1.4rem', borderRadius: '50%',
                background: dark ? '#0f1f38' : '#ffffff',
                boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.6)' : '0 1px 5px rgba(0,0,0,0.25)',
                transform: dark ? 'translateX(1.625rem)' : 'translateX(0)',
                transition: 'transform 0.45s cubic-bezier(0.34,1.3,0.64,1), background 0.4s ease, box-shadow 0.4s ease',
              }}>
                <span style={{ position: 'relative', width: '0.75rem', height: '0.75rem' }}>
                  <SunIcon style={{
                    position: 'absolute', inset: 0, width: '0.75rem', height: '0.75rem', color: '#f59e0b',
                    opacity: dark ? 0 : 1,
                    transform: dark ? 'scale(0) rotate(45deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.3s ease',
                  }} />
                  <MoonIcon style={{
                    position: 'absolute', inset: 0, width: '0.75rem', height: '0.75rem',
                    color: '#e2d9f3',
                    filter: dark ? 'drop-shadow(0 0 3px #c084fc) drop-shadow(0 0 6px #a855f7)' : 'none',
                    opacity: dark ? 1 : 0,
                    transform: dark ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-45deg)',
                    transition: 'all 0.3s ease',
                  }} />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ── Change Password ───────────────────────────────────────── */}
        <div style={{ ...cardStyle, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(30,64,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--dark-blue-1)' }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: C.textPrimary, margin: 0 }}>Change Password</h3>
              <p style={{ fontSize: '0.75rem', color: C.textSecondary, margin: 0 }}>Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { field: 'newPassword',     label: 'New Password',     placeholder: 'Enter new password' },
              { field: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm new password' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: C.textPrimary, marginBottom: '0.35rem' }}>
                  {label}
                </label>
                <input
                  type="password"
                  value={passwordForm[field]}
                  onChange={(e) => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                  style={inputBase}
                  placeholder={placeholder}
                  required
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}

            {pwError && (
              <p style={{
                fontSize: '0.875rem', margin: 0, borderRadius: '0.5rem', padding: '0.625rem 1rem',
                color: dark ? '#fca5a5' : '#dc2626',
                background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`,
              }}>{pwError}</p>
            )}

            {pwSuccess && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.875rem', borderRadius: '0.5rem', padding: '0.625rem 1rem',
                color: dark ? '#86efac' : '#15803d',
                background: dark ? 'rgba(22,163,74,0.1)' : '#f0fdf4',
                border: `1px solid ${dark ? 'rgba(22,163,74,0.2)' : '#bbf7d0'}`,
              }}>
                <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                Password updated successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: 'none',
                background: 'linear-gradient(135deg, var(--dark-blue-1), var(--dark-blue-2))',
                color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 2px 12px rgba(30,64,175,0.35)',
                transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(30,64,175,0.5)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,64,175,0.35)' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default MyProfile