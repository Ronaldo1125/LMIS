import { useState } from 'react'
import { 
  BookOpenIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const StatsOverview = ({ stats, dark }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const cards = [
    {
      label: 'Total Books',
      value: stats ? stats.totalBooks.toLocaleString() : '—',
      icon: BookOpenIcon,
      lightBg: '#eff6ff',
      darkBg: 'rgba(15, 97, 247, 0.15)',
      iconColor: '#0F61F7',
      borderColor: '#0F61F7'
    },
    {
      label: 'Missing ISBN/ISSN',
      value: stats ? stats.missingIdentifiers.toLocaleString() : '—',
      icon: ExclamationTriangleIcon,
      lightBg: '#fff7ed',
      darkBg: 'rgba(255, 166, 2, 0.15)',
      iconColor: '#FFA602',
      borderColor: '#FFA602'
    },
    {
      label: 'Most Common Publisher',
      value: stats ? stats.mostCommonPublisher : '—',
      subValue: stats ? `${stats.mostCommonPublisherCount} titles` : '',
      icon: BuildingLibraryIcon,
      lightBg: '#faf5ff',
      darkBg: 'rgba(63, 27, 210, 0.15)',
      iconColor: '#3F1BD2',
      borderColor: '#3F1BD2'
    },
    {
      label: 'Recently Cataloged',
      value: stats ? stats.recentlyCataloged.toLocaleString() : '—',
      subValue: 'Last 30 days',
      icon: ClockIcon,
      lightBg: '#fefce8',
      darkBg: 'rgba(255, 208, 2, 0.15)',
      iconColor: '#FFD002',
      borderColor: '#FFD002'
    }
  ]

  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const cardBorder   = dark ? '#1a3356' : '#f3f4f6'
  const textPrimary  = dark ? '#dde8f5' : '#154A9A'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted     = dark ? '#2e4d70' : '#6b7280'

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
      gap: '1.25rem', 
      marginBottom: '1.5rem' 
    }}>
      {cards.map((stat, index) => {
        const Icon = stat.icon
        const isHovered = hoveredIndex === index

        return (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              background: cardBg,
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: `1px solid ${cardBorder}`,
              borderLeft: `4px solid ${stat.borderColor}`,
              height: '5rem',
              display: 'flex',
              gap: '0.625rem',
              alignItems: 'center',
              boxShadow: isHovered 
                ? (dark ? '0 10px 20px rgba(0,0,0,0.4)' : '0 10px 15px -3px rgba(0,0,0,0.1)') 
                : (dark ? '0 4px 6px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)'),
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.45s ease, border-color 0.45s ease',
              cursor: 'default'
            }}
          >
            {/* Icon Container */}
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              background: dark ? stat.darkBg : stat.lightBg,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.45s ease'
            }}>
              <Icon 
                style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: stat.iconColor 
                }} 
              />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: '10px',
                fontWeight: 700,
                color: textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.125rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {stat.label}
              </p>
              
              <h3 style={{
                margin: 0,
                fontWeight: 800,
                color: textPrimary,
                lineHeight: 1.1,
                fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                transition: 'color 0.45s ease'
              }}>
                {stat.value}
              </h3>

              {stat.subValue && (
                <span style={{ 
                  fontSize: '10px', 
                  color: textMuted, 
                  fontWeight: 500, 
                  display: 'block',
                  marginTop: '0.125rem'
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