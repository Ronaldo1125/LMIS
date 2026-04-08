import { useState, useRef, useEffect, useCallback } from 'react'
import {
  KeyIcon, CheckIcon, SunIcon, MoonIcon,
  CameraIcon, ArrowPathIcon, PencilIcon, XMarkIcon,
  TrashIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL

// ─── Helpers ──────────────────────────────────────────────────────────────────
const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`
const randomSeed = () => Math.random().toString(36).slice(2, 10)
const extractSeed = (url, fallback) => {
  try {
    const m = url?.match(/[?&]seed=([^&]+)/)
    return m ? decodeURIComponent(m[1]) : fallback
  } catch { return fallback }
}

function useInputStyles(dark) {
  useEffect(() => {
    const id = 'myprofile-input-styles'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('style')
      el.id = id
      document.head.appendChild(el)
    }
    const bg    = dark ? '#071020' : '#ffffff'
    const color = dark ? '#dde8f5' : '#1e293b'
    const ph    = dark ? '#2e4d70' : '#94a3b8'
    el.textContent = `
      .mp-input {
        background-color: ${bg} !important;
        color: ${color} !important;
        -webkit-text-fill-color: ${color} !important;
        caret-color: ${color} !important;
        transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
      }
      .mp-input::placeholder {
        color: ${ph} !important;
        -webkit-text-fill-color: ${ph} !important;
        opacity: 1 !important;
      }
      .mp-input:-webkit-autofill,
      .mp-input:-webkit-autofill:hover,
      .mp-input:-webkit-autofill:focus,
      .mp-input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px ${bg} inset !important;
        box-shadow: 0 0 0 1000px ${bg} inset !important;
        -webkit-text-fill-color: ${color} !important;
        caret-color: ${color} !important;
      }
    `
  }, [dark])
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div style={{
    position: 'fixed', bottom: '1.5rem', right: '1.5rem',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem',
    pointerEvents: 'none',
  }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.75rem 1rem', borderRadius: '0.75rem',
        background: t.type === 'success'
          ? 'linear-gradient(135deg, #064e3b, #065f46)'
          : 'linear-gradient(135deg, #7f1d1d, #991b1b)',
        border: `1px solid ${t.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(252,165,165,0.3)'}`,
        color: t.type === 'success' ? '#6ee7b7' : '#fca5a5',
        fontSize: '0.8rem', fontWeight: 600,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'slideInToast 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: 'none',
      }}>
        <CheckCircleIcon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
        {t.message}
      </div>
    ))}
  </div>
)

// ─── Inline editable field ────────────────────────────────────────────────────
const InlineField = ({ label, value, onSave, validate, C, dark, disabled }) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus() }, [editing])

  const handleSave = async () => {
    const trimmed = draft.trim()
    if (trimmed === value) { setEditing(false); return }
    const validationErr = validate?.(trimmed)
    if (validationErr) { setErr(validationErr); return }
    setLoading(true); setErr('')
    try { await onSave(trimmed); setEditing(false) }
    catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditing(false); setDraft(value); setErr('') }
  }

  return (
    <div>
      <p style={{ fontSize: '0.65rem', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.3rem' }}>{label}</p>
      {editing ? (
        <div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <input
              ref={inputRef}
              className="mp-input"
              value={draft}
              onChange={e => { setDraft(e.target.value); setErr('') }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1, border: '1.5px solid #2563eb',
                borderRadius: '0.5rem', padding: '0.4rem 0.75rem',
                fontSize: '0.875rem', outline: 'none',
                boxShadow: '0 0 0 3px rgba(37,99,235,0.15)',
                boxSizing: 'border-box',
              }}
            />
            <button onClick={handleSave} disabled={loading} style={{
              width: '2rem', height: '2rem', borderRadius: '0.4rem', border: 'none',
              background: '#2563eb', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              opacity: loading ? 0.6 : 1,
            }}>
              <CheckIcon style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
            <button onClick={() => { setEditing(false); setDraft(value); setErr('') }} style={{
              width: '2rem', height: '2rem', borderRadius: '0.4rem', border: `1px solid ${C.border}`,
              background: C.insetBg, color: C.textSecondary, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <XMarkIcon style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
          </div>
          {err && <p style={{ fontSize: '0.72rem', color: dark ? '#f87171' : '#dc2626', margin: '0.3rem 0 0' }}>{err}</p>}
        </div>
      ) : (
        <button
          onClick={() => !disabled && setEditing(true)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: disabled ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '0.925rem', color: C.textPrimary, fontWeight: 600 }}>{value}</span>
          {!disabled && <PencilIcon style={{ width: '0.75rem', height: '0.75rem', color: C.textMuted, flexShrink: 0, opacity: 0.6 }} />}
        </button>
      )}
    </div>
  )
}

// ─── AvatarPicker ─────────────────────────────────────────────────────────────
const AvatarPicker = ({ currentAvatar, username, dark, onSave, onClose, C }) => {
  const GRID = 18
  const initSeeds = () => {
    const s = Array.from({ length: GRID }, randomSeed)
    s[0] = extractSeed(currentAvatar, username)
    return s
  }
  const [seeds, setSeeds] = useState(initSeeds)
  const [selected, setSelected] = useState(currentAvatar || dicebearUrl(extractSeed(currentAvatar, username)))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSave = async () => {
    setSaving(true); setErr('')
    try { await onSave(selected); onClose() }
    catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(6px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '1.25rem',
        padding: '1.75rem', width: '100%', maxWidth: '26rem',
        boxShadow: dark ? '0 24px 60px rgba(0,0,0,0.7)' : '0 12px 48px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontWeight: 700, color: C.textPrimary, fontSize: '1rem' }}>Choose Avatar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSecondary, fontSize: '1.25rem' }}>✕</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '4.5rem', height: '4.5rem', flexShrink: 0, borderRadius: '0.875rem',
            border: `3px solid ${dark ? '#1a3356' : '#dbeafe'}`, background: dark ? '#081422' : '#f0f7ff',
            overflow: 'hidden', boxShadow: '0 4px 20px rgba(37,99,235,0.15)',
          }}>
            <img src={selected} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: C.textSecondary }}>
              Pick from the grid or shuffle for fresh options.
            </p>
            <button onClick={() => setSeeds(Array.from({ length: GRID }, randomSeed))} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem', border: `1px solid ${C.border}`, background: C.insetBg,
              color: C.textSecondary, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
            }}>
              <ArrowPathIcon style={{ width: '0.8rem', height: '0.8rem' }} /> Shuffle
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.45rem', marginBottom: '1.25rem' }}>
          {seeds.map((seed, i) => {
            const url = dicebearUrl(seed)
            const isSel = url === selected
            return (
              <button key={i} onClick={() => setSelected(url)} style={{
                padding: 0, border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                background: 'none', outline: 'none', position: 'relative',
              }}>
                <div style={{
                  borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '1',
                  border: isSel ? '2.5px solid #2563eb' : `2px solid ${dark ? '#1a3356' : '#e2e8f0'}`,
                  background: dark ? '#081422' : '#f0f7ff',
                  boxShadow: isSel ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                  transform: isSel ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                {isSel && (
                  <div style={{
                    position: 'absolute', top: '-3px', right: '-3px',
                    width: '1rem', height: '1rem', borderRadius: '50%',
                    background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${C.cardBg}`,
                  }}>
                    <CheckIcon style={{ width: '0.5rem', height: '0.5rem', color: '#fff' }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {err && <p style={{ fontSize: '0.8rem', margin: '0 0 1rem', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: dark ? '#fca5a5' : '#dc2626', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>{err}</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: `1px solid ${C.border}`, background: C.insetBg, color: C.textSecondary, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: `1px solid ${dark ? '#2563eb' : '#1d4ed8'}`, background: dark ? '#1e3a6e' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.65 : 1 }}>
            {saving ? 'Saving…' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────
const DeleteConfirmModal = ({ dark, C, username, onConfirm, onClose }) => {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleDelete = async () => {
    if (confirmText !== username) { setErr(`Type your username exactly: "${username}"`); return }
    setLoading(true); setErr('')
    try { await onConfirm() }
    catch (e) { setErr(e.message); setLoading(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(4px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: C.cardBg, border: `1px solid ${dark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
        borderRadius: '1.25rem', padding: '1.75rem', width: '100%', maxWidth: '22rem',
        boxShadow: dark ? '0 24px 60px rgba(0,0,0,0.7)' : '0 12px 48px rgba(239,68,68,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: dark ? 'rgba(239,68,68,0.15)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ExclamationTriangleIcon style={{ width: '1.5rem', height: '1.5rem', color: dark ? '#f87171' : '#dc2626' }} />
          </div>
        </div>
        <h3 style={{ textAlign: 'center', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.5rem', fontSize: '1rem' }}>Delete Account</h3>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: C.textSecondary, margin: '0 0 1.25rem', lineHeight: 1.6 }}>
          This is <strong style={{ color: dark ? '#f87171' : '#dc2626' }}>permanent and irreversible</strong>. Type your username to confirm.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: C.textSecondary, marginBottom: '0.35rem' }}>
            Type <strong style={{ color: C.textPrimary }}>{username}</strong> to confirm
          </label>
          <input
            className="mp-input"
            type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
            style={{ border: `1px solid ${dark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`, borderRadius: '0.5rem', padding: '0.625rem 1rem', width: '100%', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            placeholder={username} autoComplete="off"
          />
        </div>
        {err && <p style={{ fontSize: '0.8rem', margin: '0 0 1rem', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: dark ? '#fca5a5' : '#dc2626', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>{err}</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: `1px solid ${C.border}`, background: C.insetBg, color: C.textSecondary, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading || confirmText !== username} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: `1px solid ${dark ? 'rgba(239,68,68,0.4)' : '#dc2626'}`, background: dark ? 'rgba(239,68,68,0.2)' : '#dc2626', color: dark ? '#fca5a5' : '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: (loading || confirmText !== username) ? 'not-allowed' : 'pointer', opacity: (loading || confirmText !== username) ? 0.5 : 1 }}>
            {loading ? 'Deleting…' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PasswordField ────────────────────────────────────────────────────────────
const PasswordField = ({ label, value, onChange, placeholder, C }) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: C.textPrimary, marginBottom: '0.35rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="mp-input"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: '0.5rem',
            padding: '0.625rem 2.75rem 0.625rem 1rem',
            width: '100%',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)' }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeSlashIcon style={{ width: '1rem', height: '1rem' }} /> : <EyeIcon style={{ width: '1rem', height: '1rem' }} />}
        </button>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, iconBg, iconColor, textPrimary, textSecondary }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: '1rem', height: '1rem', color: iconColor }} />
    </div>
    <div>
      <h3 style={{ fontWeight: 700, color: textPrimary, margin: 0, fontSize: '0.875rem' }}>{title}</h3>
      <p style={{ fontSize: '0.7rem', color: textSecondary, margin: 0 }}>{subtitle}</p>
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const MyProfile = ({ user, setUser, dark, setDark, onLogout }) => {
  useInputStyles(dark)

  const [localUser, setLocalUser] = useState(user || {})
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || dicebearUrl(user?.username || 'default'))

  useEffect(() => {
    if (user) {
      setLocalUser(user)
      setAvatarUrl(user.avatar || dicebearUrl(user.username || 'default'))
    }
  }, [user])

  const updateUser = useCallback((patch) => {
    setLocalUser(prev => ({ ...prev, ...patch }))
    if (setUser) setUser(prev => ({ ...prev, ...patch }))
  }, [setUser])

  const [showPicker, setShowPicker] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [avatarHover, setAvatarHover] = useState(false)

  const [toasts, setToasts] = useState([])
  const toast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }

  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [unForm, setUnForm] = useState({ newUsername: '', password: '' })
  const [unError, setUnError] = useState('')
  const [unLoading, setUnLoading] = useState(false)

  const fullName = localUser?.full_name || localUser?.username || 'User'
  const username = localUser?.username || ''
  const role     = localUser?.role || ''

  const token = () => localStorage.getItem('authToken')

  const saveFullName = async (newName) => {
    const res = await fetch(`${API_URL}/adminpanel-users/${localUser.id}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ full_name: newName }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update name.')
    updateUser({ full_name: newName })
    toast('Display name updated!')
  }

  const saveUsername = async (newUn) => {
    if (!unForm.password) throw new Error('Current password is required.')
    const res = await fetch(`${API_URL}/adminpanel-users/${localUser.id}/username`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ newUsername: newUn, currentPassword: unForm.password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update username.')
    updateUser({ username: newUn })
    setUnForm({ newUsername: '', password: '' })
    toast('Username updated!')
  }

  const saveAvatar = async (url) => {
    const previousUrl = avatarUrl
    setAvatarUrl(url)
    updateUser({ avatar: url })
    try {
      const res = await fetch(`${API_URL}/adminpanel-users/${localUser.id}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ avatar: url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save avatar.')
      toast('Avatar updated!')
    } catch (e) {
      setAvatarUrl(previousUrl)
      updateUser({ avatar: previousUrl })
      throw e
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    if (pwForm.new !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    if (pwForm.new.length < 6) { setPwError('Password must be at least 6 characters.'); return }
    setPwLoading(true)
    try {
      const res = await fetch(`${API_URL}/adminpanel-users/${localUser.id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ password: pwForm.new }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update password.')
      setPwForm({ current: '', new: '', confirm: '' })
      toast('Password updated successfully!')
    } catch (err) {
      setPwError(err.message)
    } finally {
      setPwLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const res = await fetch(`${API_URL}/adminpanel-users/${localUser.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to delete account.')

    // Clear all auth data
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    sessionStorage.clear()

    // Call logout callback to redirect to login
    if (onLogout) onLogout()
  }

  const C = {
    pageBg:        dark ? '#080f1e' : '#f0f4f8',
    cardBg:        dark ? '#0d1b2e' : '#ffffff',
    insetBg:       dark ? '#071020' : '#f8fafc',
    border:        dark ? '#172640' : '#e2e8f0',
    textPrimary:   dark ? '#dde8f5' : '#1e293b',
    textSecondary: dark ? '#6b8cae' : '#64748b',
    textMuted:     dark ? '#2e4d70' : '#94a3b8',
    inputBg:       dark ? '#071020' : '#ffffff',
    accentBlue:    '#2563eb',
  }

  const card = {
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '1.25rem',
    boxShadow: dark ? '0 4px 32px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  }

  const insetCell = {
    background: C.insetBg,
    border: `1px solid ${C.border}`,
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
  }

  const getRoleBadge = (r) => {
    if (dark) {
      const map = { admin: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' }, librarian: { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd' }, staff: { bg: 'rgba(34,197,94,0.15)', color: '#86efac' } }
      return map[r] || { bg: 'rgba(180,180,180,0.1)', color: '#9ca3af' }
    }
    const map = { admin: { bg: '#f3e8ff', color: '#7e22ce' }, librarian: { bg: '#dbeafe', color: '#1d4ed8' }, staff: { bg: '#dcfce7', color: '#15803d' } }
    return map[r] || { bg: '#f1f5f9', color: '#475569' }
  }

  const roleLabels = { admin: 'Administrator', librarian: 'Librarian', staff: 'Staff', patron: 'Patron' }
  const badge = getRoleBadge(role)

  const btnPrimary = {
    padding: '0.65rem 1rem', borderRadius: '0.5rem', border: 'none',
    background: dark ? '#1e3a6e' : '#2563eb', color: '#fff',
    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
    width: '100%',
  }

  return (
    <>
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(2rem) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        *, *::before, *::after {
          transition: background-color 0.4s ease, border-color 0.4s ease, color 0.3s ease, box-shadow 0.4s ease;
        }
      `}</style>

      <Toast toasts={toasts} />

      {showPicker && (
        <AvatarPicker currentAvatar={avatarUrl} username={username} dark={dark} C={C} onSave={saveAvatar} onClose={() => setShowPicker(false)} />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal dark={dark} C={C} username={username} onConfirm={handleDeleteAccount} onClose={() => setShowDeleteModal(false)} />
      )}

      <div style={{ minHeight: '100vh', background: C.pageBg, padding: '1.5rem 1.25rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ── TOP ROW ───────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>

            {/* Profile Card */}
            <div style={card}>
              <div style={{
                height: '6rem',
                background: dark
                  ? 'linear-gradient(135deg, #0a1628 0%, #0d2247 50%, #091830 100%)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e40af 100%)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              </div>
              <div style={{ padding: '0 1.5rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '-2.5rem', marginBottom: '1rem' }}>
                  <div
                    style={{ position: 'relative', width: '5rem', height: '5rem', cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => setShowPicker(true)}
                    onMouseEnter={() => setAvatarHover(true)}
                    onMouseLeave={() => setAvatarHover(false)}
                  >
                    <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', border: `3px solid ${C.cardBg}`, boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.12)', overflow: 'hidden', background: dark ? '#081422' : '#f0f7ff' }}>
                      <img src={avatarUrl} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.52)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', opacity: avatarHover ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
                      <CameraIcon style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                      <span style={{ fontSize: '0.52rem', color: '#fff', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Edit</span>
                    </div>
                  </div>
                  <span style={{ background: badge.bg, color: badge.color, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                    {roleLabels[role] || role}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <InlineField label="Display Name" value={fullName} onSave={saveFullName} validate={v => !v ? 'Name cannot be empty.' : v.length > 60 ? 'Too long (max 60 chars).' : null} C={C} dark={dark} />
                    <p style={{ fontSize: '0.78rem', color: C.textSecondary, margin: '0.25rem 0 0' }}>@{username}</p>
                  </div>
                  <div style={insetCell}>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.2rem' }}>Role</p>
                    <p style={{ fontSize: '0.85rem', color: C.textPrimary, fontWeight: 600, margin: 0 }}>{roleLabels[role] || role}</p>
                  </div>
                  <div style={insetCell}>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.2rem' }}>Username</p>
                    <p style={{ fontSize: '0.85rem', color: C.textPrimary, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{username}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div style={{ ...card, padding: '1.25rem', minWidth: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem', overflow: 'visible' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? 'rgba(168,85,247,0.12)' : 'rgba(245,158,11,0.12)' }}>
                <div style={{ position: 'relative', width: '1.25rem', height: '1.25rem' }}>
                  <SunIcon style={{ position: 'absolute', inset: 0, width: '1.25rem', height: '1.25rem', color: '#f59e0b', opacity: dark ? 0 : 1, transform: dark ? 'scale(0.3) rotate(90deg)' : 'scale(1) rotate(0deg)', transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)' }} />
                  <MoonIcon style={{ position: 'absolute', inset: 0, width: '1.25rem', height: '1.25rem', color: '#e2d9f3', filter: dark ? 'drop-shadow(0 0 6px #c084fc)' : 'none', opacity: dark ? 1 : 0, transform: dark ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-90deg)', transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)' }} />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.1rem' }}>{dark ? 'Dark Mode' : 'Light Mode'}</p>
                <p style={{ fontSize: '0.68rem', color: C.textSecondary, margin: 0 }}>{dark ? 'Switch to light' : 'Switch to dark'}</p>
              </div>
              <button onClick={() => setDark(p => !p)} aria-label="Toggle theme" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '3.25rem', height: '1.75rem', borderRadius: '999px', padding: '0.2rem', border: 'none', cursor: 'pointer', background: dark ? '#6d28d9' : '#f59e0b', boxShadow: dark ? '0 0 16px rgba(109,40,217,0.5)' : '0 0 16px rgba(245,158,11,0.45)', outline: 'none' }}>
                <span style={{ width: '1.35rem', height: '1.35rem', borderRadius: '50%', background: dark ? '#0d1b2e' : '#fff', boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.6)' : '0 1px 5px rgba(0,0,0,0.2)', transform: dark ? 'translateX(1.5rem)' : 'translateX(0)', transition: 'transform 0.4s cubic-bezier(0.34,1.3,0.64,1)', display: 'block' }} />
              </button>
            </div>
          </div>

          {/* ── MIDDLE ROW ────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'stretch' }}>

            {/* Change Username */}
            <div style={{ ...card, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <SectionHeader
                icon={PencilIcon} title="Change Username" subtitle="Update your login handle"
                iconBg={dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)'}
                iconColor={dark ? '#93c5fd' : '#2563eb'}
                textPrimary={C.textPrimary} textSecondary={C.textSecondary}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: C.textSecondary, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Username</label>
                  <input
                    className="mp-input"
                    type="text"
                    value={unForm.newUsername}
                    onChange={e => { setUnForm(p => ({ ...p, newUsername: e.target.value })); setUnError('') }}
                    placeholder={`Current: @${username}`}
                    autoComplete="off"
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: '0.5rem',
                      padding: '0.575rem 0.875rem',
                      width: '100%',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                  />
                  <p style={{ fontSize: '0.68rem', color: C.textMuted, margin: '0.25rem 0 0' }}>Letters, numbers, underscores. Min 3 chars.</p>
                </div>
                <PasswordField
                  label="Current Password (to confirm)"
                  value={unForm.password}
                  onChange={e => { setUnForm(p => ({ ...p, password: e.target.value })); setUnError('') }}
                  placeholder="Enter your current password"
                  C={C}
                />
                {unError && <p style={{ fontSize: '0.78rem', margin: 0, borderRadius: '0.5rem', padding: '0.45rem 0.75rem', color: dark ? '#fca5a5' : '#dc2626', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>{unError}</p>}
                <button
                  disabled={unLoading || !unForm.newUsername || !unForm.password}
                  onClick={async () => {
                    setUnError(''); setUnLoading(true)
                    try { await saveUsername(unForm.newUsername.trim()) }
                    catch (e) { setUnError(e.message) }
                    finally { setUnLoading(false) }
                  }}
                  style={{ ...btnPrimary, opacity: (unLoading || !unForm.newUsername || !unForm.password) ? 0.5 : 1, cursor: (unLoading || !unForm.newUsername || !unForm.password) ? 'not-allowed' : 'pointer', marginTop: 'auto' }}
                  onMouseEnter={e => { if (!unLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {unLoading ? 'Updating…' : 'Update Username'}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div style={{ ...card, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <SectionHeader
                icon={KeyIcon} title="Change Password" subtitle="Keep your account secure"
                iconBg={dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)'}
                iconColor={dark ? '#93c5fd' : '#2563eb'}
                textPrimary={C.textPrimary} textSecondary={C.textSecondary}
              />
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <PasswordField label="New Password" value={pwForm.new} onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))} placeholder="Enter new password" C={C} />
                <PasswordField label="Confirm New Password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Confirm new password" C={C} />

                {pwForm.new && (() => {
                  const len = pwForm.new.length
                  const strength = len < 6 ? 0 : len < 8 ? 1 : len < 12 ? 2 : 3
                  const labels = ['Too short', 'Weak', 'Good', 'Strong']
                  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
                  return (
                    <div>
                      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.2rem' }}>
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', background: i <= strength ? colors[strength] : C.border, transition: 'background 0.3s' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.68rem', color: colors[strength], margin: 0, fontWeight: 600 }}>{labels[strength]}</p>
                    </div>
                  )
                })()}

                {pwError && <p style={{ fontSize: '0.78rem', margin: 0, borderRadius: '0.5rem', padding: '0.45rem 0.75rem', color: dark ? '#fca5a5' : '#dc2626', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>{pwError}</p>}

                <button type="submit" disabled={pwLoading}
                  style={{ ...btnPrimary, opacity: pwLoading ? 0.6 : 1, cursor: pwLoading ? 'not-allowed' : 'pointer', marginTop: 'auto' }}
                  onMouseEnter={e => { if (!pwLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Danger Zone ───────────────────────────────────────────────── */}
          {role === 'librarian' && (
            <div style={{ ...card, padding: '1.25rem 1.5rem', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: dark ? 'rgba(239,68,68,0.12)' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrashIcon style={{ width: '1rem', height: '1rem', color: dark ? '#f87171' : '#dc2626' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.15rem' }}>Danger Zone</p>
                    <p style={{ fontSize: '0.72rem', color: C.textSecondary, margin: 0 }}>
                      Once deleted, all your data is gone forever. This <strong style={{ color: dark ? '#f87171' : '#dc2626' }}>cannot be undone</strong>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{ flexShrink: 0, padding: '0.5rem 1.125rem', borderRadius: '0.5rem', border: `1px solid ${dark ? 'rgba(239,68,68,0.4)' : '#dc2626'}`, background: 'transparent', color: dark ? '#f87171' : '#dc2626', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <TrashIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default MyProfile