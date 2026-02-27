import {
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'

const StatsOverview = ({ accessions, pagination, dark }) => {
  // Use server-reported total if available, otherwise fall back to current page length
  const totalAccessions = pagination?.total ?? accessions.length

  // The following stats are computed from the current page only.
  // They reflect visible data — for full accuracy these would need dedicated API endpoints.
  const uniqueTitles = new Set(accessions.map((item) => item.title).filter(Boolean)).size

  const now = new Date()
  const thisMonthCount = accessions.filter((item) => {
    if (!item.date_accessioned) return false
    const d = new Date(item.date_accessioned)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  const uniquePublishers = new Set(
    accessions.map((item) => item.publisher).filter(Boolean)
  ).size

  // If paginated, surface a note on page-scoped stats
  const isPaginated = pagination && pagination.totalPages > 1
  const pageNote = isPaginated ? ` (this page)` : ''

  const stats = [
    {
      label: 'Total Accessions',
      value: totalAccessions.toLocaleString(),
      // No subValue note — this one is accurate via pagination.total
      icon: ClipboardDocumentCheckIcon,
      iconBg:    dark ? 'rgba(15,97,247,0.15)'  : '#eff6ff',
      iconColor: dark ? '#93c5fd' : '#0F61F7',
      accent:    '#0F61F7',
    },
    {
      label: 'Unique Titles',
      value: uniqueTitles.toLocaleString(),
      subValue: isPaginated ? `Page ${pagination.page} of ${pagination.totalPages}` : undefined,
      icon: DocumentArrowDownIcon,
      iconBg:    dark ? 'rgba(63,27,210,0.15)'  : '#f5f3ff',
      iconColor: dark ? '#c4b5fd' : '#3F1BD2',
      accent:    '#3F1BD2',
    },
    {
      label: 'This Month',
      value: thisMonthCount.toLocaleString(),
      subValue: `New accessions${pageNote}`,
      icon: ClockIcon,
      iconBg:    dark ? 'rgba(255,166,2,0.15)'  : '#fff7ed',
      iconColor: dark ? '#fdba74' : '#FFA602',
      accent:    '#FFA602',
    },
    {
      label: 'Unique Publishers',
      value: uniquePublishers.toLocaleString(),
      subValue: isPaginated ? `On this page` : undefined,
      icon: BuildingLibraryIcon,
      iconBg:    dark ? 'rgba(255,208,2,0.12)'  : '#fefce8',
      iconColor: dark ? '#fde047' : '#ca8a04',
      accent:    '#FFD002',
    },
  ]

  const cardBg     = dark ? '#0f1f38' : '#ffffff'
  const cardBorder = dark ? '#1a3356' : '#e2e8f0'
  const labelColor = dark ? '#2e4d70' : '#4b5563'
  const valueColor = dark ? '#dde8f5' : '#154A9A'
  const subColor   = dark ? '#2e4d70' : '#6b7280'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    }}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderLeft: `4px solid ${stat.accent}`,
              borderRadius: '0.75rem',
              padding: '0.75rem',
              height: '5rem',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'background 0.45s ease, border-color 0.45s ease, transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = dark ? '0 6px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'
            }}
          >
            {/* Icon box */}
            <div style={{
              width: '2.25rem', height: '2.25rem', flexShrink: 0,
              background: stat.iconBg,
              borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.45s ease',
            }}>
              <Icon style={{ width: '1.25rem', height: '1.25rem', color: stat.iconColor }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.625rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: labelColor, margin: '0 0 0.125rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                transition: 'color 0.45s ease',
              }}>
                {stat.label}
              </p>
              <h3 style={{
                fontWeight: 700, color: valueColor,
                margin: '0 0 0.125rem', lineHeight: 1.2,
                fontSize: 'clamp(0.7rem, 1vw, 1rem)',
                transition: 'color 0.45s ease',
              }}>
                {stat.value}
              </h3>
              {stat.subValue && (
                <span style={{
                  fontSize: '0.625rem', fontWeight: 500,
                  color: subColor, display: 'block',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  transition: 'color 0.45s ease',
                }}>
                  {stat.subValue}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsOverview