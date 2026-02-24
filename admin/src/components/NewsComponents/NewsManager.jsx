import { useState, useEffect, useCallback } from 'react'
import { LinkIcon, PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon, NewspaperIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const CATEGORIES = ['Education', 'Events', 'Policy', 'Technology', 'General']

const CATEGORY_STYLES = {
  Education:  { bg: 'rgba(21,74,154,0.10)',  text: '#3b6fd4' },
  Events:     { bg: 'rgba(124,58,237,0.10)', text: '#7c3aed' },
  Policy:     { bg: 'rgba(217,119,6,0.10)',  text: '#d97706' },
  Technology: { bg: 'rgba(5,150,105,0.10)',  text: '#059669' },
  General:    { bg: 'rgba(100,116,139,0.10)',text: '#64748b' },
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const truncateUrl = (url, max = 42) =>
  url.length > max ? url.slice(0, max) + '…' : url

// ── Shared token helper ───────────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
})

// ── Sub-components ────────────────────────────────────────

const StatusBadge = ({ ok, message }) => (
  <div style={{
    borderRadius: '0.45rem',
    padding: '0.55rem 0.875rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    marginBottom: '1.125rem',
    background: ok ? 'rgba(5,150,105,0.09)' : 'rgba(239,68,68,0.09)',
    border: `1px solid ${ok ? 'rgba(5,150,105,0.22)' : 'rgba(239,68,68,0.22)'}`,
    color: ok ? '#059669' : '#ef4444',
  }}>
    {message}
  </div>
)

const FieldError = ({ msg }) =>
  msg ? <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: '#ef4444' }}>{msg}</p> : null

// ── Main Component ────────────────────────────────────────

const NewsManager = ({ dark }) => {
  const [newsList,      setNewsList]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [fetchError,    setFetchError]    = useState('')
  const [form,          setForm]          = useState({ title: '', url: '', category: 'General' })
  const [errors,        setErrors]        = useState({})
  const [submitting,    setSubmitting]    = useState(false)
  const [status,        setStatus]        = useState(null)   // { ok, message }
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting,      setDeleting]      = useState(null)

  // ── Palette ───────────────────────────────────────────
  const bg          = dark ? '#0d1b2e' : '#ffffff'
  const bg2         = dark ? '#07111f' : '#f8fafc'
  const border      = dark ? '#1c2f4a' : '#e8eef6'
  const inputBg     = dark ? '#07111f' : '#f8fafc'
  const inputBorder = dark ? '#1c3254' : '#cbd5e1'
  const textPrimary = dark ? '#e8edf5' : '#0f172a'
  const textMuted   = dark ? '#5a7a99' : '#94a3b8'
  const accent      = '#154A9A'
  const accentLight = dark ? 'rgba(21,74,154,0.18)' : 'rgba(21,74,154,0.07)'

  // ── Fetch ─────────────────────────────────────────────
  const fetchNews = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch(`${API_BASE}/news`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setNewsList(data)
    } catch (err) {
      setFetchError(err.message || 'Failed to load news.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  // ── Validation ────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.url.trim()) {
      e.url = 'URL is required'
    } else {
      try { new URL(form.url) }
      catch { e.url = 'Enter a valid URL (include https://)' }
    }
    return e
  }

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Error ${res.status}`)
      }
      const created = await res.json()
      setNewsList(prev => [created, ...prev])
      setForm({ title: '', url: '', category: 'General' })
      setErrors({})
      setStatus({ ok: true, message: 'Article published successfully.' })
      setTimeout(() => setStatus(null), 3500)
    } catch (err) {
      setStatus({ ok: false, message: err.message || 'Failed to publish article.' })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      const res = await fetch(`${API_BASE}/news/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      setNewsList(prev => prev.filter(n => n.id !== id))
      setDeleteConfirm(null)
    } catch {
      setStatus({ ok: false, message: 'Failed to remove article. Please try again.' })
    } finally {
      setDeleting(null)
    }
  }

  // ── Styles ────────────────────────────────────────────
  const card = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '0.875rem',
    padding: '1.625rem',
    boxShadow: dark ? '0 4px 28px rgba(0,0,0,0.35)' : '0 1px 6px rgba(15,23,42,0.06)',
    transition: 'background 0.4s ease, border-color 0.4s ease',
  }

  const inputStyle = (hasErr) => ({
    width: '100%',
    padding: '0.6rem 0.875rem',
    borderRadius: '0.45rem',
    border: `1px solid ${hasErr ? '#ef4444' : inputBorder}`,
    background: inputBg,
    color: textPrimary,
    fontSize: '0.8375rem',
    outline: 'none',
    transition: 'border-color 0.18s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  })

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: textMuted,
    marginBottom: '0.375rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }

  const sectionHeader = (icon, title, count) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '1.875rem', height: '1.875rem', borderRadius: '0.4rem',
          background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: textPrimary, letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>
      {count !== undefined && (
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          color: accent,
          background: accentLight,
          borderRadius: '9999px',
          padding: '0.15rem 0.6rem',
          letterSpacing: '0.03em',
        }}>
          {count}
        </span>
      )}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* ── Add Form ── */}
      <div style={card}>
        {sectionHeader(
          <LinkIcon style={{ width: '0.9rem', height: '0.9rem', color: accent }} />,
          'Add News Link'
        )}

        {status && <StatusBadge ok={status.ok} message={status.message} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Article Title</label>
            <input
              style={inputStyle(!!errors.title)}
              placeholder="e.g. DepEd Releases New Guidelines..."
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })) }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = errors.title ? '#ef4444' : inputBorder}
            />
            <FieldError msg={errors.title} />
          </div>

          {/* URL */}
          <div>
            <label style={labelStyle}>Article URL</label>
            <div style={{ position: 'relative' }}>
              <LinkIcon style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                width: '0.8rem', height: '0.8rem', color: textMuted, pointerEvents: 'none',
              }} />
              <input
                style={{ ...inputStyle(!!errors.url), paddingLeft: '2.125rem' }}
                placeholder="https://example.com/article"
                value={form.url}
                onChange={e => { setForm(f => ({ ...f, url: e.target.value })); setErrors(er => ({ ...er, url: '' })) }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = errors.url ? '#ef4444' : inputBorder}
              />
            </div>
            <FieldError msg={errors.url} />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{ ...inputStyle(false), cursor: 'pointer' }}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = inputBorder}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: submitting ? (dark ? '#1c3461' : '#94a3b8') : accent,
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.45rem',
              fontSize: '0.8375rem',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              letterSpacing: '0.01em',
              transition: 'background 0.18s ease, opacity 0.18s ease',
              fontFamily: 'inherit',
              boxShadow: submitting ? 'none' : '0 2px 10px rgba(21,74,154,0.28)',
            }}
          >
            <PlusIcon style={{ width: '0.9rem', height: '0.9rem' }} />
            {submitting ? 'Publishing…' : 'Publish Article'}
          </button>
        </div>
      </div>

      {/* ── News List ── */}
      <div style={card}>
        {sectionHeader(
          <NewspaperIcon style={{ width: '0.9rem', height: '0.9rem', color: accent }} />,
          'Published Articles',
          newsList.length
        )}

        {/* Refresh */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={fetchNews}
            disabled={loading}
            title="Refresh"
            style={{
              background: 'transparent', border: `1px solid ${border}`,
              borderRadius: '0.4rem', padding: '0.3rem 0.6rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.72rem', fontWeight: 600, fontFamily: 'inherit',
              transition: 'border-color 0.18s ease, color 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted }}
          >
            <ArrowPathIcon style={{ width: '0.75rem', height: '0.75rem', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: textMuted, fontSize: '0.8375rem' }}>
            Loading articles…
          </div>
        ) : fetchError ? (
          <div style={{
            padding: '1rem', borderRadius: '0.45rem',
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
            color: '#ef4444', fontSize: '0.8rem', textAlign: 'center',
          }}>
            {fetchError}
            <button
              onClick={fetchNews}
              style={{
                display: 'block', margin: '0.625rem auto 0', fontSize: '0.75rem',
                color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '0.35rem', padding: '0.3rem 0.7rem', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Retry
            </button>
          </div>
        ) : newsList.length === 0 ? (
          <div style={{ padding: '3.5rem 0', textAlign: 'center', color: textMuted }}>
            <NewspaperIcon style={{ width: '2rem', height: '2rem', margin: '0 auto 0.625rem', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '0.8375rem' }}>No articles published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {newsList.map(item => {
              const cat = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.General
              const isConfirming = deleteConfirm === item.id
              const isDeletingThis = deleting === item.id
              return (
                <div
                  key={item.id}
                  style={{
                    background: isConfirming
                      ? (dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.04)')
                      : bg2,
                    border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.22)' : border}`,
                    borderRadius: '0.625rem',
                    padding: '0.8rem 0.975rem',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: cat.bg, color: cat.text,
                          borderRadius: '9999px', padding: '0.05rem 0.55rem',
                          fontSize: '0.6375rem', fontWeight: 700, letterSpacing: '0.06em',
                          textTransform: 'uppercase', flexShrink: 0,
                        }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: textMuted }}>
                          {formatDate(item.created_at || item.addedAt)}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.8375rem', fontWeight: 600, color: textPrimary, lineHeight: 1.4 }}>
                        {item.title}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                          fontSize: '0.7rem', color: accent, textDecoration: 'none',
                          opacity: 0.85,
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                      >
                        {truncateUrl(item.url)}
                        <ArrowTopRightOnSquareIcon style={{ width: '0.65rem', height: '0.65rem' }} />
                      </a>
                    </div>

                    {/* Delete controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                      {!isConfirming ? (
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          title="Remove"
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: textMuted, padding: '0.25rem', borderRadius: '0.35rem',
                            transition: 'color 0.15s ease, background 0.15s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent' }}
                        >
                          <TrashIcon style={{ width: '0.9rem', height: '0.9rem' }} />
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeletingThis}
                            style={{
                              fontSize: '0.72rem', fontWeight: 700,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '0.35rem', border: 'none', cursor: isDeletingThis ? 'not-allowed' : 'pointer',
                              background: '#ef4444', color: '#ffffff', fontFamily: 'inherit',
                              opacity: isDeletingThis ? 0.7 : 1,
                            }}
                          >
                            {isDeletingThis ? 'Removing…' : 'Remove'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{
                              fontSize: '0.72rem', fontWeight: 600,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '0.35rem', border: `1px solid ${border}`,
                              cursor: 'pointer', background: 'transparent',
                              color: textMuted, fontFamily: 'inherit',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${inputBorder}; border-radius: 9999px; }
      `}</style>
    </div>
  )
}

export default NewsManager