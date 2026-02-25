import { CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const DateTimeCard = ({ dark }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Add a subtle flip animation every minute
      if (new Date().getSeconds() === 0) {
        setIsFlipping(true)
        setTimeout(() => setIsFlipping(false), 600)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  // Fun quirk: pulse the seconds colon
  const seconds = currentTime.getSeconds()
  const shouldPulse = seconds % 2 === 0

  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#e5e7eb'
  const cardBorder   = dark ? '#1a3356' : 'rgba(209,213,219,0.6)'
  const textPrimary  = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#374151'
  const iconBoxBg    = dark ? 'rgba(30,64,175,0.2)' : 'rgba(255,255,255,0.6)'
  const iconBoxBorder = dark ? '#1a3356' : 'rgba(209,213,219,0.6)'
  const iconColor    = dark ? '#93c5fd' : '#374151'
  const labelColor   = dark ? '#2e4d70' : '#4b5563'
  const tickFilled   = dark ? '#93c5fd' : '#4b5563'
  const tickEmpty    = dark ? '#1a3356' : '#9ca3af'

  return (
    <div
      style={{
        borderRadius: '1rem',
        boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
        padding: '1rem',
        background: cardBg,
        border: `2px solid ${cardBorder}`,
        position: 'relative',
        overflow: 'hidden',
        animation: isFlipping ? 'pulse 0.6s ease' : undefined,
        transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.3s ease, transform 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      {/* Decorative corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '5rem', height: '5rem', opacity: dark ? 0.08 : 0.2,
        background: 'radial-gradient(circle at top right, #ffffff 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          padding: '0.5rem',
          borderRadius: '0.625rem',
          background: iconBoxBg,
          border: `1px solid ${iconBoxBorder}`,
          backdropFilter: 'blur(4px)',
          transition: 'background 0.45s ease',
        }}>
          <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
        </div>
        <p style={{
          fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: labelColor, margin: 0,
          transition: 'color 0.45s ease',
        }}>
          Right Now
        </p>
      </div>

      {/* Date & Time */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textSecondary, margin: '0 0 0.25rem', transition: 'color 0.45s ease' }}>
          {formatDate(currentTime)}
        </p>
        <p style={{
          fontSize: '1.5rem', fontWeight: 400,
          letterSpacing: '-0.02em',
          fontFeatureSettings: '"tnum"',
          color: textPrimary, margin: 0,
          transition: 'color 0.45s ease',
        }}>
          {formatTime(currentTime).split(':').map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < 2 && (
                <span style={{
                  display: 'inline-block',
                  opacity: shouldPulse ? 1 : 0.4,
                  transition: 'opacity 0.2s ease',
                }}>
                  :
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* Ticking progress bar */}
      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '0.25rem', flex: 1,
              borderRadius: '999px',
              background: i < (seconds / 5) ? tickFilled : tickEmpty,
              opacity: i < (seconds / 5) ? 0.9 : 0.4,
              transition: 'background 0.3s ease, opacity 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DateTimeCard