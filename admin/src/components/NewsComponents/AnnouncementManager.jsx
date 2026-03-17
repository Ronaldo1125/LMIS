import { useState, useEffect, useCallback, useRef } from 'react'
import {
  MegaphoneIcon, PaperClipIcon, XMarkIcon,
  ArrowPathIcon, ChevronDownIcon,
  PencilSquareIcon, TrashIcon, CheckIcon,
} from '@heroicons/react/24/outline'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const AUDIENCES = [
  { value: 'all',    label: 'All Users' },
  { value: 'Patron', label: 'Patrons Only' },
  { value: 'Staff',  label: 'Staff Only' },
]

const MAX_FILES  = 5
const MAX_SIZE_MB = 10

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatFileSize = (bytes) => {
  if (bytes < 1024)    return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
})

/** Decode the JWT payload without verifying — for UI-only ownership checks.
 *  The server still enforces ownership; this just controls button visibility. */
const decodeToken = () => {
  try {
    const token = localStorage.getItem('authToken') || ''
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ ok, message }) => (
  <div style={{
    borderRadius: '0.45rem', padding: '0.55rem 0.875rem',
    fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.125rem',
    background: ok ? 'rgba(5,150,105,0.09)' : 'rgba(239,68,68,0.09)',
    border: `1px solid ${ok ? 'rgba(5,150,105,0.22)' : 'rgba(239,68,68,0.22)'}`,
    color: ok ? '#059669' : '#ef4444',
  }}>
    {message}
  </div>
)

const FieldError = ({ msg }) =>
  msg ? <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{msg}</p> : null

// ── Main component ───────────────────────────────────────────────────────────

const AnnouncementManager = ({ dark }) => {
  const [announcements, setAnnouncements] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [fetchError,    setFetchError]    = useState('')

  // Compose form
  const [form,       setForm]       = useState({ subject: '', description: '', audience: 'all' })
  const [files,      setFiles]      = useState([])
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status,     setStatus]     = useState(null)

  // List UI
  const [expanded, setExpanded] = useState(null)

  // Edit state
  const [editingId,   setEditingId]   = useState(null)
  const [editForm,    setEditForm]    = useState({ subject: '', description: '', audience: 'all' })
  const [editErrors,  setEditErrors]  = useState({})
  const [editSaving,  setEditSaving]  = useState(false)
  const [deletingId,  setDeletingId]  = useState(null)

  const fileInputRef = useRef(null)

  // Decode token once for ownership checks (UI only — server enforces too)
  const me = decodeToken() // { id, role, ... }
  const isAdmin     = me?.role === 'admin'
  const isLibrarian = me?.role === 'librarian'

  /** Can this user edit/delete a given announcement? */
  const canManage = (ann) => {
    if (isAdmin) return true
    if (isLibrarian) return ann.created_by === me?.id
    return false
  }

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const bg          = dark ? '#0d1b2e' : '#ffffff'
  const bg2         = dark ? '#07111f' : '#f8fafc'
  const bg3         = dark ? '#0b1525' : '#f1f5f9'
  const border      = dark ? '#1c2f4a' : '#e8eef6'
  const inputBg     = dark ? '#07111f' : '#f8fafc'
  const inputBorder = dark ? '#1c3254' : '#cbd5e1'
  const textPrimary = dark ? '#e8edf5' : '#0f172a'
  const textMuted   = dark ? '#5a7a99' : '#94a3b8'
  const accent      = '#154A9A'
  const accentLight = dark ? 'rgba(21,74,154,0.18)' : 'rgba(21,74,154,0.07)'
  const danger      = '#ef4444'
  const dangerLight = 'rgba(239,68,68,0.09)'

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true); setFetchError('')
    try {
      const res = await fetch(`${API_BASE}/announcements`, { headers: authHeaders() })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setAnnouncements(await res.json())
    } catch (err) {
      setFetchError(err.message || 'Failed to load announcements.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const combined = [...files, ...Array.from(e.target.files)].slice(0, MAX_FILES)
    const valid    = combined.filter(f => f.size <= MAX_SIZE_MB * 1024 * 1024)
    setFiles(valid)
    if (valid.length < combined.length)
      setErrors(er => ({ ...er, files: `Each file must be under ${MAX_SIZE_MB} MB.` }))
    else
      setErrors(er => ({ ...er, files: '' }))
    e.target.value = ''
  }
  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx))

  // ── Create ────────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.subject.trim())     e.subject     = 'Subject is required'
    if (!form.description.trim()) e.description = 'Message body is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true); setStatus(null)

    const body = new FormData()
    body.append('subject',     form.subject)
    body.append('description', form.description)
    body.append('audience',    form.audience)
    files.forEach(f => body.append('attachments', f))

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST', headers: authHeaders(), body,
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.message || `Error ${res.status}`)
      }
      const created = await res.json()
      setAnnouncements(prev => [created, ...prev])
      setForm({ subject: '', description: '', audience: 'all' })
      setFiles([]); setErrors({})
      setStatus({ ok: true, message: 'Announcement sent successfully.' })
      setTimeout(() => setStatus(null), 3500)
    } catch (err) {
      setStatus({ ok: false, message: err.message || 'Failed to send announcement.' })
    } finally { setSubmitting(false) }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  const startEdit = (ann) => {
    setEditingId(ann.id)
    setEditForm({ subject: ann.subject, description: ann.description, audience: ann.audience })
    setEditErrors({})
    setExpanded(ann.id) // keep it open
  }

  const cancelEdit = () => {
    setEditingId(null); setEditErrors({})
  }

  const saveEdit = async (id) => {
    const e = {}
    if (!editForm.subject.trim())     e.subject     = 'Subject is required'
    if (!editForm.description.trim()) e.description = 'Message body is required'
    if (Object.keys(e).length) { setEditErrors(e); return }

    setEditSaving(true)
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.message || `Error ${res.status}`)
      }
      const updated = await res.json()
      setAnnouncements(prev => prev.map(a => a.id === id ? updated : a))
      setEditingId(null)
    } catch (err) {
      setEditErrors({ _global: err.message })
    } finally { setEditSaving(false) }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.message || `Error ${res.status}`)
      }
      setAnnouncements(prev => prev.filter(a => a.id !== id))
      if (expanded === id) setExpanded(null)
    } catch (err) {
      alert(err.message || 'Failed to delete announcement.')
    } finally { setDeletingId(null) }
  }

  // ── Style helpers ─────────────────────────────────────────────────────────
  const card = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '0.875rem',
    padding: '1.625rem',
    boxShadow: dark ? '0 4px 28px rgba(0,0,0,0.35)' : '0 1px 6px rgba(15,23,42,0.06)',
    transition: 'background 0.4s ease, border-color 0.4s ease',
  }

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '0.625rem 0.875rem',
    borderRadius: '0.5rem',
    border: `1px solid ${hasErr ? danger : inputBorder}`,
    background: inputBg, color: textPrimary,
    fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.18s ease',
    boxSizing: 'border-box',
  })

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600,
    color: textMuted, marginBottom: '0.375rem',
    letterSpacing: '0.05em', textTransform: 'uppercase',
  }

  const audienceLabel = (a) => AUDIENCES.find(x => x.value === a)?.label || a

  const audienceBadgeStyle = {
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: accent, background: accentLight,
    borderRadius: '9999px', padding: '0.1rem 0.55rem',
  }

  const iconBtn = (color = textMuted) => ({
    background: 'none', border: 'none', cursor: 'pointer',
    color, padding: '0.25rem', display: 'flex', alignItems: 'center',
    borderRadius: '0.35rem', transition: 'color 0.15s ease, background 0.15s ease',
  })

  const sectionHeader = (icon, title, count) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '0.4rem', background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: textPrimary, letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>
      {count !== undefined && (
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: accent, background: accentLight, borderRadius: '9999px', padding: '0.15rem 0.6rem' }}>
          {count}
        </span>
      )}
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* ── Compose Form ── */}
      <div style={card}>
        {sectionHeader(
          <MegaphoneIcon style={{ width: '0.9rem', height: '0.9rem', color: accent }} />,
          'Send Announcement'
        )}
        {status && <StatusBadge ok={status.ok} message={status.message} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Subject */}
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              style={inputStyle(!!errors.subject)}
              placeholder="Announcement subject line…"
              value={form.subject}
              onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); setErrors(er => ({ ...er, subject: '' })) }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e  => e.target.style.borderColor = errors.subject ? danger : inputBorder}
            />
            <FieldError msg={errors.subject} />
          </div>

          {/* Message Body */}
          <div>
            <label style={labelStyle}>Message Body</label>
            <textarea
              style={{ ...inputStyle(!!errors.description), resize: 'vertical', minHeight: '6.5rem', lineHeight: 1.55 }}
              placeholder="Write your announcement here…"
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })) }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e  => e.target.style.borderColor = errors.description ? danger : inputBorder}
            />
            <FieldError msg={errors.description} />
          </div>

          {/* Audience — full width, no priority */}
          <div>
            <label style={labelStyle}>Audience</label>
            <select
              style={{ ...inputStyle(false), cursor: 'pointer' }}
              value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e  => e.target.style.borderColor = inputBorder}
            >
              {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          {/* Attachments */}
          <div>
            <label style={labelStyle}>Attachments (max {MAX_FILES})</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `1px dashed ${inputBorder}`, borderRadius: '0.5rem', padding: '0.7rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: textMuted, fontSize: '0.875rem', transition: 'border-color 0.18s ease, color 0.18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.color = textMuted }}
            >
              <PaperClipIcon style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0 }} />
              <span>Click to attach files</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>{files.length}/{MAX_FILES}</span>
            </div>
            <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
            <FieldError msg={errors.files} />

            {files.length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: bg3, border: `1px solid ${border}`, borderRadius: '0.375rem', padding: '0.35rem 0.625rem', fontSize: '0.75rem' }}>
                    <span style={{ color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.name}</span>
                    <span style={{ color: textMuted, flexShrink: 0 }}>{formatFileSize(f.size)}</span>
                    <button onClick={e => { e.stopPropagation(); removeFile(i) }} style={iconBtn(textMuted)}>
                      <XMarkIcon style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%', padding: '0.65rem',
              background: submitting ? (dark ? '#1c3461' : '#94a3b8') : accent,
              color: '#fff', border: 'none', borderRadius: '0.5rem',
              fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
              boxShadow: submitting ? 'none' : '0 2px 10px rgba(21,74,154,0.28)',
              transition: 'background 0.18s ease',
            }}
          >
            <MegaphoneIcon style={{ width: '0.9rem', height: '0.9rem' }} />
            {submitting ? 'Sending…' : 'Send Announcement'}
          </button>
        </div>
      </div>

      {/* ── Announcements List ── */}
      <div style={card}>
        {sectionHeader(
          <MegaphoneIcon style={{ width: '0.9rem', height: '0.9rem', color: accent }} />,
          'Sent Announcements',
          announcements.length
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={fetchAnnouncements}
            disabled={loading}
            style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: '0.4rem', padding: '0.3rem 0.6rem', cursor: loading ? 'not-allowed' : 'pointer', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, transition: 'border-color 0.18s ease, color 0.18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted }}
          >
            <ArrowPathIcon style={{ width: '0.75rem', height: '0.75rem', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: textMuted, fontSize: '0.875rem' }}>
            Loading announcements…
          </div>
        ) : fetchError ? (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', background: dangerLight, border: '1px solid rgba(239,68,68,0.18)', color: danger, fontSize: '0.875rem', textAlign: 'center' }}>
            {fetchError}
            <button onClick={fetchAnnouncements} style={{ display: 'block', margin: '0.625rem auto 0', fontSize: '0.75rem', color: danger, background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.35rem', padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Retry</button>
          </div>
        ) : announcements.length === 0 ? (
          <div style={{ padding: '3.5rem 0', textAlign: 'center', color: textMuted }}>
            <MegaphoneIcon style={{ width: '2rem', height: '2rem', margin: '0 auto 0.625rem', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>No announcements sent yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: '62vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {announcements.map(ann => {
              const isOpen    = expanded === ann.id
              const isEditing = editingId === ann.id
              const hasAtt    = ann.attachments?.length > 0
              const manageable = canManage(ann)

              return (
                <div key={ann.id} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: '0.625rem', overflow: 'hidden', transition: 'border-color 0.18s ease' }}>

                  {/* Row header */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Expand toggle */}
                    <button
                      onClick={() => { setExpanded(isOpen ? null : ann.id); if (isEditing) cancelEdit() }}
                      style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.8rem 0.975rem', display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left', minWidth: 0 }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: textPrimary, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ann.subject}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: textMuted }}>{formatDate(ann.sent_at || ann.created_at)}</span>
                          <span style={audienceBadgeStyle}>{audienceLabel(ann.audience)}</span>
                          {hasAtt && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', color: textMuted }}>
                              <PaperClipIcon style={{ width: '0.65rem', height: '0.65rem' }} />
                              {ann.attachments.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDownIcon style={{ width: '0.875rem', height: '0.875rem', color: textMuted, flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease' }} />
                    </button>

                    {/* Edit / Delete — only if user can manage */}
                    {manageable && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', paddingRight: '0.6rem', flexShrink: 0 }}>
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(ann.id)}
                              disabled={editSaving}
                              title="Save changes"
                              style={{ ...iconBtn('#059669'), padding: '0.3rem' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <CheckIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              title="Cancel edit"
                              style={{ ...iconBtn(textMuted), padding: '0.3rem' }}
                              onMouseEnter={e => e.currentTarget.style.background = bg3}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <XMarkIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { if (!isOpen) setExpanded(ann.id); startEdit(ann) }}
                              title="Edit announcement"
                              style={{ ...iconBtn(textMuted), padding: '0.3rem' }}
                              onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.background = accentLight }}
                              onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent' }}
                            >
                              <PencilSquareIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                            </button>
                            <button
                              onClick={() => handleDelete(ann.id)}
                              disabled={deletingId === ann.id}
                              title="Delete announcement"
                              style={{ ...iconBtn(textMuted), padding: '0.3rem' }}
                              onMouseEnter={e => { e.currentTarget.style.color = danger; e.currentTarget.style.background = dangerLight }}
                              onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent' }}
                            >
                              <TrashIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div style={{ padding: '0 0.975rem 0.9rem', borderTop: `1px solid ${border}` }}>
                      {isEditing ? (
                        /* ── Inline edit form ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', paddingTop: '0.75rem' }}>
                          {editErrors._global && <StatusBadge ok={false} message={editErrors._global} />}

                          <div>
                            <label style={labelStyle}>Subject</label>
                            <input
                              style={inputStyle(!!editErrors.subject)}
                              value={editForm.subject}
                              onChange={e => { setEditForm(f => ({ ...f, subject: e.target.value })); setEditErrors(er => ({ ...er, subject: '' })) }}
                              onFocus={e => e.target.style.borderColor = accent}
                              onBlur={e  => e.target.style.borderColor = editErrors.subject ? danger : inputBorder}
                            />
                            <FieldError msg={editErrors.subject} />
                          </div>

                          <div>
                            <label style={labelStyle}>Message Body</label>
                            <textarea
                              style={{ ...inputStyle(!!editErrors.description), resize: 'vertical', minHeight: '5rem', lineHeight: 1.55 }}
                              value={editForm.description}
                              onChange={e => { setEditForm(f => ({ ...f, description: e.target.value })); setEditErrors(er => ({ ...er, description: '' })) }}
                              onFocus={e => e.target.style.borderColor = accent}
                              onBlur={e  => e.target.style.borderColor = editErrors.description ? danger : inputBorder}
                            />
                            <FieldError msg={editErrors.description} />
                          </div>

                          <div>
                            <label style={labelStyle}>Audience</label>
                            <select
                              style={{ ...inputStyle(false), cursor: 'pointer' }}
                              value={editForm.audience}
                              onChange={e => setEditForm(f => ({ ...f, audience: e.target.value }))}
                              onFocus={e => e.target.style.borderColor = accent}
                              onBlur={e  => e.target.style.borderColor = inputBorder}
                            >
                              {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                            </select>
                          </div>

                          <p style={{ margin: 0, fontSize: '0.72rem', color: textMuted }}>
                            Note: attachments cannot be changed after sending.
                          </p>
                        </div>
                      ) : (
                        /* ── Read-only body ── */
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: textMuted, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                          {ann.description}
                        </p>
                      )}

                      {/* Attachments — always shown in expanded view */}
                      {hasAtt && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <p style={{ ...labelStyle, marginBottom: '0.3rem' }}>Attachments</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {ann.attachments.map(att => (
                              <a
                                key={att.id}
                                href={`${API_BASE.replace('/api', '')}/${att.file_path.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noreferrer"
                                download={att.file_name}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: accent, background: bg3, border: `1px solid ${border}`, borderRadius: '0.35rem', padding: '0.3rem 0.6rem', textDecoration: 'none', transition: 'background 0.15s ease' }}
                                onMouseEnter={e => e.currentTarget.style.background = accentLight}
                                onMouseLeave={e => e.currentTarget.style.background = bg3}
                              >
                                <PaperClipIcon style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.file_name}</span>
                                <span style={{ color: textMuted, flexShrink: 0 }}>{formatFileSize(att.file_size)}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

export default AnnouncementManager