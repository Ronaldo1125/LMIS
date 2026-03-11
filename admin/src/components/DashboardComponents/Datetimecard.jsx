import { CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const DateTimeCard = ({ dark }) => {
  const [now, setNow] = useState(new Date())
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const h24 = now.getHours()
  const h12 = h24 % 12 || 12
  const min = now.getMinutes()
  const sec = now.getSeconds()
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const blink = sec % 2 === 0

  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const cardBorder    = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#6b7280'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.2)' : 'rgba(0,0,0,0.04)'
  const iconColor     = dark ? '#93c5fd' : '#374151'
  const labelColor    = dark ? '#6b8cae' : '#6b7280'
  const tickFilled    = dark ? '#93c5fd' : '#4b5563'
  const tickEmpty     = dark ? '#1a3356' : '#e2e8f0'
  const bdr = cardBorder
  const accentColor = dark ? '#60a5fa' : '#2563eb'
  const txt1 = textPrimary
  const txt2 = textSecondary

const dateStr = now.toLocaleDateString(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: dark ? '#0c1c34' : '#ffffff',
        border: `1px solid ${hovered ? (dark ? '#2a4a70' : '#bfcfe8') : bdr}`,
        borderTop: `2.5px solid ${accentColor}`,
        borderRadius: 12,
        padding: '18px 20px',
        minHeight: 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        boxShadow: hovered
          ? (dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 6px 20px rgba(0,0,0,0.1)')
          : (dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)'),
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient tint */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 100% 0%, ${dark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.07)'} 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0.5, transition: 'opacity 0.3s ease',
      }} />

      {/* Icon | divider | date + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        {/* Icon centered */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: dark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.09)',
          border: `1px solid ${dark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.14)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CalendarIcon style={{ width: '0.9rem', height: '0.9rem', color: accentColor }} />
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 32, background: dark ? '#1a3356' : '#e8edf5', flexShrink: 0 }} />

        {/* Date + Time stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <p style={{
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: txt2, margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {dateStr}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <p style={{
              fontSize: '1.25rem', fontWeight: 800, lineHeight: 1,
              color: txt1, margin: 0,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              fontFeatureSettings: '"tnum"',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {pad(h12)}
              <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s ease' }}>:</span>
              {pad(min)}
              <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s ease' }}>:</span>
              {pad(sec)}
            </p>
            <span style={{
              fontSize: '0.75rem', fontWeight: 800,
              color: accentColor, letterSpacing: '0.04em',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {ampm}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateTimeCard