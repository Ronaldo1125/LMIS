import { useState } from 'react'
import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats, dark }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      lightBg: '#eff6ff', // bg-blue-50
      darkBg: 'rgba(15, 97, 247, 0.15)',
      iconColor: '#0F61F7',
      borderColor: '#0F61F7'
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      lightBg: '#faf5ff', // bg-purple-50
      darkBg: 'rgba(63, 27, 210, 0.15)',
      iconColor: '#3F1BD2',
      borderColor: '#3F1BD2'
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      lightBg: '#fff7ed', // bg-orange-50
      darkBg: 'rgba(255, 166, 2, 0.15)',
      iconColor: '#FFA602',
      borderColor: '#FFA602'
    }
  ]

  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const cardBorder   = dark ? '#1a3356' : '#f3f4f6'
  const textPrimary  = dark ? '#dde8f5' : '#154A9A'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '0.75rem', 
      marginBottom: '1.25rem' 
    }}>
      {cards.map((card, index) => {
        const Icon = card.icon
        const isHovered = hoveredIndex === index

        return (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              background: cardBg,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${cardBorder}`,
              borderLeft: `4px solid ${card.borderColor}`,
              boxShadow: isHovered 
                ? (dark ? '0 10px 20px rgba(0,0,0,0.4)' : '0 10px 15px -3px rgba(0,0,0,0.1)') 
                : (dark ? '0 4px 6px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)'),
              display: 'flex',
              gap: '0.625rem',
              alignItems: 'center',
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.45s ease, border-color 0.45s ease',
              cursor: 'default'
            }}
          >
            {/* Icon Container */}
            <div style={{
              width: '2rem',
              height: '2rem',
              background: dark ? card.darkBg : card.lightBg,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.45s ease'
            }}>
              <Icon 
                style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  color: card.iconColor 
                }} 
                strokeWidth={2.5} 
              />
            </div>

            {/* Text Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: '10px',
                fontWeight: 600,
                color: textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                marginBottom: '0.125rem'
              }}>
                {card.title}
              </p>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: 800,
                color: textPrimary,
                transition: 'color 0.45s ease'
              }}>
                {card.count.toLocaleString()}
              </h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards