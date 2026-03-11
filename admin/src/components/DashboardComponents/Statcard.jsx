import { useEffect, useRef, useState } from 'react'

function AnimatedCount({ target, duration = 1000 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  const isNumeric = target !== '—' && !isNaN(parseFloat(String(target).replace(/,/g, '')))

  useEffect(() => {
    if (!isNumeric) return
    const numeric = parseFloat(String(target).replace(/,/g, ''))
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setVal(Math.round(numeric * ease))
      if (t < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, isNumeric])

  if (!isNumeric) return <>{target}</>
  return <>{val.toLocaleString()}</>
}

function MiniSparkline({ data, color }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data, 1), min = Math.min(...data)
  const range = max - min || 1
  const W = 52, H = 22
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 3) - 1.5
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = data[data.length - 1]
  const lx = W, ly = H - ((last - min) / range) * (H - 3) - 1.5
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
      <circle cx={lx} cy={ly.toFixed(1)} r="2.2" fill={color} />
    </svg>
  )
}

const StatCard = ({ title, value, icon: Icon, colorVar = '#2563eb', dark }) => {
  const [hovered, setHovered] = useState(false)

  const numeric = value !== '—' && !isNaN(parseFloat(String(value).replace(/,/g, '')))
    ? parseFloat(String(value).replace(/,/g, '')) : null

  const sparkData = numeric !== null
    ? Array.from({ length: 7 }, (_, i) => {
        const base = numeric * 0.6
        const wave = Math.sin(i * 2.1 + numeric * 0.01) * numeric * 0.2
        return Math.max(0, Math.round(base + wave + (i / 6) * numeric * 0.4))
      })
    : null

  const isUp = sparkData ? sparkData[sparkData.length - 1] >= sparkData[0] : true
  const trendPct = sparkData && sparkData[0] > 0
    ? Math.abs(Math.round(((sparkData[sparkData.length - 1] - sparkData[0]) / sparkData[0]) * 100))
    : null

  const trendColor = isUp ? '#22c55e' : '#f87171'

  const bg   = dark ? '#0c1c34' : '#ffffff'
  const bdr  = dark ? '#1a3356' : '#e8edf5'
  const txt1 = dark ? '#e2ecf8' : '#0f172a'
  const txt2 = dark ? '#6b8cae' : '#64748b'

  const resolvedColor = colorVar.startsWith('var(')
    ? (dark ? '#60a5fa' : '#2563eb')
    : colorVar

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: dark ? '#0c1c34' : '#ffffff',
        border: `1px solid ${hovered ? (dark ? '#2a4a70' : '#bfcfe8') : bdr}`,
        borderTop: `2.5px solid ${resolvedColor}`,
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
        background: `radial-gradient(ellipse at 100% 0%, ${resolvedColor}${dark ? '18' : '0e'} 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0.5, transition: 'opacity 0.3s ease',
      }} />

      {/* Icon | divider | label + number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        {/* Icon centered */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: `${resolvedColor}${dark ? '1e' : '12'}`,
          border: `1px solid ${resolvedColor}${dark ? '28' : '1a'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: '0.9rem', height: '0.9rem', color: resolvedColor }} />
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 32, background: dark ? '#1a3356' : '#e8edf5', flexShrink: 0 }} />

        {/* Label + Number */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <p style={{
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: txt2, margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '1.25rem', fontWeight: 800, lineHeight: 1,
            color: txt1, margin: 0,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <AnimatedCount target={value} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatCard