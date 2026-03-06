import { CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const DateTimeCard = ({ dark }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (new Date().getSeconds() === 0) {
        setIsFlipping(true)
        setTimeout(() => setIsFlipping(false), 600)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

  const formatTime = (date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  })

  const seconds = currentTime.getSeconds()
  const shouldPulse = seconds % 2 === 0

  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const cardBorder    = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#6b7280'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.2)' : 'rgba(0,0,0,0.04)'
  const iconColor     = dark ? '#93c5fd' : '#374151'
  const labelColor    = dark ? '#6b8cae' : '#6b7280'
  const tickFilled    = dark ? '#93c5fd' : '#4b5563'
  const tickEmpty     = dark ? '#1a3356' : '#e2e8f0'

  return (
    <div
      style={{
        borderRadius: '0.5rem',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        padding: '0.75rem 1rem',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        overflow: 'hidden',
        animation: isFlipping ? 'pulse 0.6s ease' : undefined,
        transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Icon */}
        <div style={{
          padding: '0.5rem',
          borderRadius: '0.4rem',
          flexShrink: 0,
          background: iconBoxBg,
          border: `1px solid ${cardBorder}`,
          transition: 'background 0.45s ease',
        }}>
          <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
        </div>

        {/* Divider */}
        <div style={{
          width: '1px', alignSelf: 'stretch',
          background: dark ? '#1a3356' : '#e2e8f0',
          flexShrink: 0,
        }} />

        {/* Date + Time stacked */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: labelColor, margin: '0 0 0.1rem',
            transition: 'color 0.45s ease',
          }}>
            {formatDate(currentTime)}
          </p>
          <p style={{
            fontSize: '1.25rem', fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFeatureSettings: '"tnum"',
            color: textPrimary, margin: 0, lineHeight: 1.2,
            transition: 'color 0.45s ease',
          }}>
            {formatTime(currentTime).split(':').map((part, idx) => (
              <span key={idx}>
                {part}
                {idx < 2 && (
                  <span style={{ opacity: shouldPulse ? 1 : 0.35, transition: 'opacity 0.2s ease' }}>:</span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Ticking progress — vertical pills on the right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flexShrink: 0 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              width: '0.2rem', height: '0.22rem',
              borderRadius: '999px',
              background: i < Math.floor(seconds / 5) ? tickFilled : tickEmpty,
              opacity: i < Math.floor(seconds / 5) ? 0.9 : 0.4,
              transition: 'background 0.3s ease, opacity 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DateTimeCard