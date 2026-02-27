import { useState, useEffect } from 'react'
import { XMarkIcon, LockClosedIcon, GlobeAltIcon, DocumentIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const ViewAccessionModal = ({ isOpen, onClose, accession, dark }) => {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  // ── Fetch fresh single accession on open ────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !accession?.id) return
    setLoading(true)
    setError(null)
    axios
      .get(`${API_BASE}/accessions/${accession.id}`, { headers: getAuthHeaders() })
      .then(({ data }) => setDetail(data))
      .catch(() => {
        setError('Failed to load accession details.')
        setDetail(accession) // fallback to list data
      })
      .finally(() => setLoading(false))
  }, [isOpen, accession?.id])

  // Reset on close
  useEffect(() => {
    if (!isOpen) { setDetail(null); setError(null) }
  }, [isOpen])

  if (!isOpen || !accession) return null

  const data = detail || accession

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    }
    return value
  }

  const accessionFields = [
    { label: 'Accession No.',    value: data.accession_no },
    { label: 'Date Accessioned', value: data.date_accessioned },
  ]

  const bibliographicFields = [
    { label: 'Title',                   value: data.title,                  wide: true },
    { label: 'Author',                  value: data.author },
    { label: 'Editor',                  value: data.editor },
    { label: 'Edition',                 value: data.edition },
    { label: 'Publication',             value: data.publication },
    { label: 'Publisher',               value: data.publisher },
    { label: 'Date of Publication',     value: data.date_of_publication },
    { label: 'Extent',                  value: data.extent },
    { label: 'Dimensions',              value: data.dimensions },
    { label: 'ISBN',                    value: data.isbn },
    { label: 'ISSN',                    value: data.issn },
    { label: 'Other Physical Details',  value: data.other_physical_details, wide: true },
    { label: 'Accompanying Material',   value: data.accompanying_material,  wide: true },
    { label: 'Subjects',                value: data.subjects,               wide: true },
    { label: 'Notes Area',              value: data.notes_area,             wide: true },
  ]

  // ── Colors ────────────────────────────────────────────────
  const overlayBg      = 'rgba(0,0,0,0.7)'
  const modalBg        = dark ? '#0f1f38' : '#ffffff'
  const headerBg       = dark ? '#0d1d35' : '#ffffff'
  const headerBorder   = dark ? '#1a3356' : '#e2e8f0'
  const insetBg        = dark ? '#081422' : '#f8fafc'
  const insetBorder    = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary    = dark ? '#dde8f5' : '#1e293b'
  const textMuted      = dark ? '#2e4d70' : '#94a3b8'
  const closeHoverBg   = dark ? '#1a3356' : '#f1f5f9'
  const closeIconColor = dark ? '#6b8cae' : '#64748b'

  const isStaff = data.access_level === 'staff_only'
  const accessBg    = isStaff ? (dark ? 'rgba(239,68,68,0.12)' : '#fef2f2') : (dark ? 'rgba(34,197,94,0.1)' : '#f0fdf4')
  const accessColor = isStaff ? (dark ? '#fca5a5' : '#dc2626') : (dark ? '#86efac' : '#16a34a')
  const AccessIcon  = isStaff ? LockClosedIcon : GlobeAltIcon

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: overlayBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', zIndex: 50,
    }}>
      <div style={{
        background: modalBg,
        borderRadius: '1rem',
        boxShadow: dark
          ? '0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.03) inset'
          : '0 24px 64px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: '42rem',
        maxHeight: '90vh', overflowY: 'auto',
        border: dark ? `1px solid ${headerBorder}` : 'none',
        transition: 'background 0.45s ease',
      }}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '1rem 1rem 0 0',
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>
              Accession Details
            </h2>
            {data.accession_no && (
              <p style={{ fontSize: '0.8125rem', color: textMuted, margin: '0.125rem 0 0' }}>
                {data.accession_no}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem', background: 'transparent', border: 'none',
              borderRadius: '0.5rem', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = closeHoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: closeIconColor }} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: textMuted, fontSize: '0.875rem' }}>
              Loading details…
            </div>
          )}

          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '0.5rem',
              background: dark ? 'rgba(220,38,38,0.1)' : '#fef2f2',
              border: `1px solid ${dark ? 'rgba(220,38,38,0.2)' : '#fecaca'}`,
              color: dark ? '#fca5a5' : '#dc2626',
              fontSize: '0.8125rem',
            }}>
              {error} Showing cached data.
            </div>
          )}

          {/* ── Access Level + Upload count pills ─────────────────────────── */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.8rem', fontWeight: 600,
              background: accessBg, color: accessColor,
            }}>
              <AccessIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              {isStaff ? 'Staff Only' : 'Public'}
            </span>

            {data.upload_count > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem', fontWeight: 600,
                background: dark ? 'rgba(30,64,175,0.15)' : '#dbeafe',
                color: dark ? '#93c5fd' : '#1d4ed8',
              }}>
                <DocumentIcon style={{ width: '0.9rem', height: '0.9rem' }} />
                {data.upload_count} Upload{data.upload_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Accession Info */}
          <Section label="Accession Info" textMuted={textMuted}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {accessionFields.map((field) => (
                <FieldCell
                  key={field.label}
                  label={field.label}
                  value={renderValue(field.value)}
                  insetBg={insetBg}
                  insetBorder={insetBorder}
                  textPrimary={textPrimary}
                  textMuted={textMuted}
                />
              ))}
            </div>
          </Section>

          {/* Bibliographic Details */}
          <Section label="Bibliographic Details" textMuted={textMuted}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {bibliographicFields.map((field) => (
                <FieldCell
                  key={field.label}
                  label={field.label}
                  value={renderValue(field.value)}
                  wide={field.wide}
                  insetBg={insetBg}
                  insetBorder={insetBorder}
                  textPrimary={textPrimary}
                  textMuted={textMuted}
                />
              ))}
            </div>
          </Section>

          {/* Archive Info — only if archived */}
          {data.is_archived === 1 && (
            <Section label="Archive Info" textMuted={textMuted}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <FieldCell label="Archived At"     value={renderValue(data.archived_at)}     insetBg={insetBg} insetBorder={insetBorder} textPrimary={textPrimary} textMuted={textMuted} />
                <FieldCell label="Archived By"     value={renderValue(data.archived_by)}     insetBg={insetBg} insetBorder={insetBorder} textPrimary={textPrimary} textMuted={textMuted} />
                <FieldCell label="Archive Reason"  value={renderValue(data.archive_reason)}  insetBg={insetBg} insetBorder={insetBorder} textPrimary={textPrimary} textMuted={textMuted} wide />
              </div>
            </Section>
          )}

        </div>
      </div>
    </div>
  )
}

const Section = ({ label, textMuted, children }) => (
  <div>
    <p style={{
      fontSize: '0.65rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      color: textMuted, margin: '0 0 0.75rem',
    }}>
      {label}
    </p>
    {children}
  </div>
)

const FieldCell = ({ label, value, wide, insetBg, insetBorder, textPrimary, textMuted }) => (
  <div style={{
    background: insetBg,
    border: `1px solid ${insetBorder}`,
    borderRadius: '0.5rem',
    padding: '0.75rem',
    gridColumn: wide ? '1 / -1' : undefined,
    transition: 'background 0.45s ease, border-color 0.45s ease',
  }}>
    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: textMuted, margin: '0 0 0.25rem' }}>
      {label}
    </p>
    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0, wordBreak: 'break-word' }}>
      {value}
    </p>
  </div>
)

export default ViewAccessionModal