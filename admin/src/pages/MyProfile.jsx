import { useState } from 'react'
import { KeyIcon, CheckIcon, SunIcon, MoonIcon, PaintBrushIcon, CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline'


/*
  Add this to your global CSS (index.css) for smooth full-page transitions:

  *, *::before, *::after {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.3s ease, box-shadow 0.4s ease;
  }
*/

// ─── DiceBear config ────────────────────────────────────────────────────────
const DICEBEAR_STYLES = [
  { id: 'pixel-art', label: 'Pixel Art' },
]

const dicebearUrl = (style, seed) =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`

const randomSeed = () => Math.random().toString(36).slice(2, 10)

// ─── AvatarPicker modal ─────────────────────────────────────────────────────
const AvatarPicker = ({ currentAvatar, username, dark, onSave, onClose, C }) => {
  const STYLE = 'pixel-art'
  const GRID_COUNT = 12

  const extractSeed = (url, fallback) => {
    try {
      const match = url?.match(/[?&]seed=([^&]+)/)
      return match ? decodeURIComponent(match[1]) : fallback
    } catch { return fallback }
  }

  const generateSeeds = () => Array.from({ length: GRID_COUNT }, () => randomSeed())

  const [seeds, setSeeds] = useState(() => {
    const initial = generateSeeds()
    initial[0] = extractSeed(currentAvatar, username)
    return initial
  })
  const [selected, setSelected] = useState(currentAvatar || dicebearUrl(STYLE, extractSeed(currentAvatar, username)))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleShuffle = () => setSeeds(generateSeeds())

  const handleSave = async () => {
    setSaving(true)
    setErr('')
    try {
      await onSave(selected)
      onClose()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 50,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  }

  const modal = {
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '1.25rem',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '28rem',
    boxShadow: dark ? '0 24px 60px rgba(0,0,0,0.7)' : '0 12px 48px rgba(0,0,0,0.15)',
  }

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontWeight: 700, color: C.textPrimary, fontSize: '1rem' }}>Choose Avatar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSecondary, fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Selected preview + shuffle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '5rem', height: '5rem', flexShrink: 0, borderRadius: '1rem',
            border: `3px solid ${dark ? '#1a3356' : '#dbeafe'}`,
            background: dark ? '#081422' : '#f0f7ff',
            overflow: 'hidden',
            boxShadow: dark ? '0 0 0 1px rgba(37,99,235,0.2), 0 8px 24px rgba(0,0,0,0.5)' : '0 4px 20px rgba(37,99,235,0.15)',
          }}>
            <img src={selected} alt="Selected avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: C.textSecondary }}>
              Click any avatar below to select it, then shuffle for more options.
            </p>
            <button
              onClick={handleShuffle}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 0.875rem', borderRadius: '0.5rem',
                border: `1px solid ${C.border}`, background: C.insetBg,
                color: C.textSecondary, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}
            >
              <ArrowPathIcon style={{ width: '0.875rem', height: '0.875rem' }} />
              Shuffle
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem',
          marginBottom: '1.25rem',
        }}>
          {seeds.map((seed, i) => {
            const url = dicebearUrl(STYLE, seed)
            const isSelected = url === selected
            return (
              <button
                key={i}
                onClick={() => setSelected(url)}
                style={{
                  padding: 0, border: 'none', borderRadius: '0.625rem', cursor: 'pointer',
                  background: 'none', outline: 'none', position: 'relative',
                }}
              >
                <div style={{
                  borderRadius: '0.625rem',
                  border: isSelected
                    ? '2.5px solid #2563eb'
                    : `2px solid ${dark ? '#1a3356' : '#e2e8f0'}`,
                  overflow: 'hidden',
                  background: dark ? '#081422' : '#f0f7ff',
                  boxShadow: isSelected
                    ? '0 0 0 3px rgba(37,99,235,0.2)'
                    : 'none',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  aspectRatio: '1',
                }}>
                  <img
                    src={url}
                    alt={`Avatar option ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '1.1rem', height: '1.1rem', borderRadius: '50%',
                    background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${C.cardBg}`,
                  }}>
                    <CheckIcon style={{ width: '0.55rem', height: '0.55rem', color: '#fff' }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {err && (
          <p style={{
            fontSize: '0.8rem', margin: '0 0 1rem', borderRadius: '0.5rem', padding: '0.5rem 0.875rem',
            color: dark ? '#fca5a5' : '#dc2626',
            background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
            border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`,
          }}>{err}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.65rem', borderRadius: '0.5rem',
            border: `1px solid ${C.border}`, background: C.insetBg,
            color: C.textSecondary, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: `1px solid ${dark ? '#2563eb' : '#1d4ed8'}`,
            background: dark ? '#1e3a6e' : '#2563eb',
            color: '#fff', fontWeight: 600, fontSize: '0.875rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.65 : 1,
          }}>
            {saving ? 'Saving…' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
const MyProfile = ({ user, setUser, dark, setDark }) => {
  const fullName = user?.full_name || user?.username || 'User'
  const username = user?.username || ''
  const role     = user?.role || ''

  // Avatar state — falls back to dicebear if none saved
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar || dicebearUrl('pixel-art', username)
  )
  const [showPicker, setShowPicker] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [loading, setLoading]   = useState(false)

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

  // Save avatar to backend and update local state
  const handleSaveAvatar = async (url) => {
    const token = localStorage.getItem('authToken')
    const res = await fetch(`http://localhost:5000/api/adminpanel-users/${user.id}/avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ avatar: url }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to save avatar.')
    setAvatarUrl(url)
    if (setUser) setUser((prev) => ({ ...prev, avatar: url }))
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

  // ─── Color system ────────────────────────────────────────────────────────
  const C = {
    pageBg:        dark ? '#0a1628' : '#f1f5f9',
    cardBg:        dark ? '#0f1f38' : '#ffffff',
    insetBg:       dark ? '#081422' : '#f8fafc',
    border:        dark ? '#1a3356' : '#e2e8f0',
    textPrimary:   dark ? '#dde8f5' : '#1e293b',
    textSecondary: dark ? '#6b8cae' : '#64748b',
    textMuted:     dark ? '#2e4d70' : '#94a3b8',
    inputBg:       dark ? '#081422' : '#ffffff',
    bannerBg:      dark ? '#0d1d35' : '#1e40af',
    pillBg:        dark ? '#2563eb' : '#f59e0b',
    pillGlow:      dark
      ? '0 0 16px rgba(168,85,247,0.5), 0 0 32px rgba(168,85,247,0.2), 0 2px 8px rgba(0,0,0,0.4)'
      : '0 0 18px rgba(245,158,11,0.45)',
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
    <>
      {showPicker && (
        <AvatarPicker
          currentAvatar={avatarUrl}
          username={username}
          dark={dark}
          C={{ ...C, insetBg: C.insetBg, inputBg: C.inputBg }}
          onSave={handleSaveAvatar}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div style={{ minHeight: '100vh', background: C.pageBg, padding: '1.5rem', transition: 'background 0.4s ease' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>

          {/* ── Profile Card ─────────────────────────────────────── */}
          <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>

            {/* Flat banner — no gradient */}
            <div style={{ height: '6rem', background: C.bannerBg, transition: 'background 0.4s ease' }} />

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-2.5rem', marginBottom: '1rem' }}>

                {/* ── Avatar with change button ── */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '5rem', height: '5rem', borderRadius: '1rem',
                    border: `4px solid ${C.cardBg}`,
                    boxShadow: dark ? '0 4px 16px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    background: dark ? '#081422' : '#f0f7ff',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                  }}>
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  {/* Change avatar button — text pill style */}
                  <button
                    onClick={() => setShowPicker(true)}
                    title="Change avatar"
                    style={{
                      position: 'absolute', bottom: '-10px', left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      border: `1px solid ${C.border}`,
                      background: C.cardBg,
                      color: C.textSecondary,
                      cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600,
                      whiteSpace: 'nowrap',
                      boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.1)',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.textPrimary; e.currentTarget.style.borderColor = dark ? '#2e4d70' : '#cbd5e1' }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.borderColor = C.border }}
                  >
                    <CameraIcon style={{ width: '0.65rem', height: '0.65rem' }} />
                    Edit
                  </button>
                </div>

                {/* Role badge */}
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

              {/* Extra top margin to account for the Edit pill overlapping */}
              <div style={{ marginTop: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.125rem' }}>{fullName}</h2>
                <p style={{ fontSize: '0.875rem', color: C.textSecondary, margin: 0 }}>@{username}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
                {[
                  { label: 'Role',     value: getRoleLabel(role) },
                  { label: 'Username', value: username },
                ].map(({ label, value }) => (
                  <div key={label} style={insetCell}>
                    <p style={{ fontSize: '0.65rem', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: C.textPrimary, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Customize ────────────────────────────────────────── */}
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

            <div style={{ ...insetCell, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: C.iconBoxBg, boxShadow: C.iconBoxGlow,
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
                      position: 'absolute', inset: 0, width: '1.2rem', height: '1.2rem', color: '#e2d9f3',
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

              <button
                onClick={() => setDark(prev => !prev)}
                aria-label="Toggle dark mode"
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center',
                  width: '3.5rem', height: '1.875rem', borderRadius: '999px', padding: '0.22rem',
                  border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: C.pillBg, boxShadow: C.pillGlow, outline: 'none',
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                }}
              >
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
                      position: 'absolute', inset: 0, width: '0.75rem', height: '0.75rem', color: '#e2d9f3',
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

          {/* ── Change Password ───────────────────────────────────── */}
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
                  background: dark ? '#1e3a6e' : '#2563eb',
                  color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,64,175,0.35)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default MyProfile