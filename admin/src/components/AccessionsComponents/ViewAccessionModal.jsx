import { XMarkIcon } from '@heroicons/react/24/outline'

const ViewAccessionModal = ({ isOpen, onClose, accession, dark }) => {
  if (!isOpen || !accession) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    // Format dates nicely
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    }
    return value
  }

  const accessionFields = [
    { label: 'Accession No.', value: accession.accession_no },
    { label: 'Date Accessioned', value: accession.date_accessioned },
  ]

  const bibliographicFields = [
    { label: 'Title', value: accession.title, wide: true },
    { label: 'Author', value: accession.author },
    { label: 'Editor', value: accession.editor },
    { label: 'Edition', value: accession.edition },
    { label: 'Publication', value: accession.publication },
    { label: 'Publisher', value: accession.publisher },
    { label: 'Date of Publication', value: accession.date_of_publication },
    { label: 'Extent', value: accession.extent },
    { label: 'Dimensions', value: accession.dimensions },
    { label: 'ISBN', value: accession.isbn },
    { label: 'ISSN', value: accession.issn },
    { label: 'Other Physical Details', value: accession.other_physical_details, wide: true },
    { label: 'Accompanying Material', value: accession.accompanying_material, wide: true },
    { label: 'Subjects', value: accession.subjects, wide: true },
    { label: 'Notes Area', value: accession.notes_area, wide: true },
  ]

  // ── Colors ────────────────────────────────────────────────
  const overlayBg    = 'rgba(0,0,0,0.7)'
  const modalBg      = dark ? '#0f1f38' : '#ffffff'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const insetBg      = dark ? '#081422' : '#f8fafc'
  const insetBorder  = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textMuted    = dark ? '#2e4d70' : '#94a3b8'
  const closeHoverBg = dark ? '#1a3356' : '#f1f5f9'
  const closeIconColor = dark ? '#6b8cae' : '#64748b'

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
            {accession.accession_no && (
              <p style={{ fontSize: '0.8125rem', color: textMuted, margin: '0.125rem 0 0' }}>
                {accession.accession_no}
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
    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0 }}>
      {value}
    </p>
  </div>
)

export default ViewAccessionModal