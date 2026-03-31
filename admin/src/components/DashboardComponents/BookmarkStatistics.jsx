import { useEffect, useState, useCallback } from 'react'
import {
  BookmarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  TrophyIcon,
  Squares2X2Icon,
  BoltIcon,
} from '@heroicons/react/24/outline'

const FONT_HEADING = "'Sora', -apple-system, sans-serif"
const FONT_BODY    = "'DM Sans', -apple-system, 'Segoe UI', sans-serif"
const FONT_MONO    = "'DM Mono', 'Fira Mono', monospace"

const API_BASE_URL = 'http://localhost:5000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

async function apiFetch(path) {
  const token = getToken()
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${API_BASE_URL}${path}`, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const CAT_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669',
  '#f59e0b', '#dc2626', '#64748b', '#94a3b8',
]

// ── Trend badge ─────────────────────────────────────────────────────────────
const Trend = ({ value }) => {
  if (value > 0) return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#22c55e', fontSize: 11, fontWeight: 700, fontFamily: FONT_BODY }}>
      <ArrowTrendingUpIcon style={{ width: 12, height: 12 }} />+{value}%
    </span>
  )
  if (value < 0) return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f87171', fontSize: 11, fontWeight: 700, fontFamily: FONT_BODY }}>
      <ArrowTrendingDownIcon style={{ width: 12, height: 12 }} />{value}%
    </span>
  )
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8', fontSize: 11, fontWeight: 700, fontFamily: FONT_BODY }}>
      <MinusIcon style={{ width: 12, height: 12 }} />0%
    </span>
  )
}

// ── Section header ───────────────────────────────────────────────────────────
const SubHeader = ({ icon: Icon, label, dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <div style={{
      width: 26, height: 26, borderRadius: 7,
      background: dark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.08)',
      border: `1px solid ${dark ? 'rgba(96,165,250,0.18)' : 'rgba(37,99,235,0.12)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon style={{ width: '0.75rem', height: '0.75rem', color: dark ? '#60a5fa' : '#2563eb' }} />
    </div>
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
      textTransform: 'uppercase', color: dark ? '#6b8cae' : '#94a3b8',
      fontFamily: FONT_BODY,
    }}>
      {label}
    </span>
  </div>
)

// ── KPI card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, dark, accentColor = '#2563eb' }) => {
  const bdr = dark ? '#1a3356' : '#e8edf5'
  const bg  = dark ? '#07111f' : '#f8fafc'
  return (
    <div style={{
      background: bg, border: `1px solid ${bdr}`,
      borderTop: `2px solid ${accentColor}`,
      borderRadius: 10, padding: '12px 13px',
      display: 'flex', flexDirection: 'column', gap: 4,
      fontFamily: FONT_BODY,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Icon style={{ width: '0.8rem', height: '0.8rem', color: dark ? '#6b8cae' : '#94a3b8' }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: dark ? '#2e4d70' : '#94a3b8' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: dark ? '#e2ecf8' : '#0f172a', fontFamily: FONT_MONO, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: dark ? '#6b8cae' : '#94a3b8', marginTop: 1 }}>{sub}</div>
    </div>
  )
}

// ── Category bar ─────────────────────────────────────────────────────────────
const CategoryBar = ({ name, count, total, color, dark }) => {
  const pct = total ? Math.round((count / total) * 100) : 0
  const bdr = dark ? '#1a3356' : '#e8edf5'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontSize: 11, fontWeight: 600, width: 96, flexShrink: 0,
        color: dark ? '#94afc8' : '#475569',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: FONT_BODY,
      }}>
        {name}
      </span>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: dark ? '#1a3356' : '#e8edf5', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 99,
          background: color,
          transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: color, width: 28, textAlign: 'right', flexShrink: 0 }}>
        {count}
      </span>
    </div>
  )
}

// ── Top book row ──────────────────────────────────────────────────────────────
const BookRow = ({ rank, title, author, bookmarkCount, dark }) => {
  const rankColor = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#b45309' : (dark ? '#2e4d70' : '#cbd5e1')
  const bdr = dark ? '#1a3356' : '#e8edf5'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8,
      transition: 'background 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.background = dark ? '#0f1e36' : '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        fontFamily: FONT_MONO, fontSize: 11, fontWeight: 800,
        color: rankColor, width: 16, flexShrink: 0, textAlign: 'center',
      }}>
        {rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: dark ? '#e2ecf8' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_HEADING }}>
          {title}
        </div>
        <div style={{ fontSize: 10, color: dark ? '#6b8cae' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_BODY }}>
          {author}
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: dark ? '#0f1e36' : '#f1f5f9',
        border: `1px solid ${bdr}`,
        borderRadius: 6, padding: '3px 7px',
        flexShrink: 0,
      }}>
        <BookmarkIcon style={{ width: 9, height: 9, color: dark ? '#6b8cae' : '#94a3b8' }} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155' }}>
          {bookmarkCount}
        </span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════════════
const BookmarkStatistics = ({ dark = false }) => {
  const [stats, setStats]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [refreshing, setRefreshing]     = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [allBookmarks, topBooks] = await Promise.all([
        apiFetch('/api/bookmarks?limit=9999').catch(() => null),
        apiFetch('/api/bookmarks/top?limit=5').catch(() => null),
      ])

      const bookmarks = allBookmarks?.bookmarks ?? []
      const total     = allBookmarks?.pagination?.total ?? bookmarks.length

      const catMap = {}
      bookmarks.forEach(b => {
        const cat = b.category || 'Uncategorized'
        catMap[cat] = (catMap[cat] || 0) + 1
      })
      const categories = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([name, count], i) => ({ name, count, color: CAT_COLORS[i % CAT_COLORS.length] }))

      const publicCount     = bookmarks.filter(b => b.access_level === 'public').length
      const restrictedCount = bookmarks.filter(b => b.access_level !== 'public').length

      const now     = Date.now()
      const oneWeek = 7 * 24 * 60 * 60 * 1000
      const thisWeek = bookmarks.filter(b => now - new Date(b.bookmarked_at) < oneWeek).length
      const lastWeek = bookmarks.filter(b => {
        const d = now - new Date(b.bookmarked_at)
        return d >= oneWeek && d < 2 * oneWeek
      }).length
      const weekTrend = lastWeek === 0
        ? (thisWeek > 0 ? 100 : 0)
        : Math.round(((thisWeek - lastWeek) / lastWeek) * 100)

      const today = bookmarks.filter(b => now - new Date(b.bookmarked_at) < 24 * 60 * 60 * 1000).length

      const sparkData = Array.from({ length: 7 }, (_, i) => {
        const dayStart = now - (6 - i) * 24 * 60 * 60 * 1000
        const dayEnd   = dayStart + 24 * 60 * 60 * 1000
        return bookmarks.filter(b => {
          const t = new Date(b.bookmarked_at).getTime()
          return t >= dayStart && t < dayEnd
        }).length
      })

      const withDigital = bookmarks.filter(b => b.has_digital_copy).length
      const digitalPct  = total ? Math.round((withDigital / total) * 100) : 0
      const topBooksData = topBooks?.books ?? topBooks ?? []

      setStats({ total, thisWeek, lastWeek, weekTrend, today, categories, publicCount, restrictedCount, sparkData, digitalPct, withDigital, topBooks: topBooksData })
      setLastRefreshed(new Date())
    } catch (e) {
      console.error('[BookmarkStatistics]', e)
      setError('Failed to load bookmark statistics.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Tokens ──────────────────────────────────────────────────────────────
  const bg      = dark ? '#0c1c34' : '#ffffff'
  const bdr     = dark ? '#1a3356' : '#e8edf5'
  const txt1    = dark ? '#e2ecf8' : '#0f172a'
  const txt2    = dark ? '#6b8cae' : '#64748b'
  const surface = dark ? '#07111f' : '#f8fafc'

  const cardStyle = {
    background: bg, border: `1px solid ${bdr}`,
    borderRadius: 12,
    boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)',
    padding: '20px 22px',
    transition: 'background 0.35s ease, border-color 0.35s ease',
    fontFamily: FONT_BODY,
  }

  const innerCard = {
    background: surface, border: `1px solid ${bdr}`,
    borderRadius: 10, padding: '14px 16px',
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }} />
        <div style={{ width: 160, height: 13, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }} />
      </div>
      {[70, 50, 90, 60].map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: 9, borderRadius: 5, marginBottom: 12, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
      ))}
    </div>
  )

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: 13 }}>
        <BoltIcon style={{ width: 14, height: 14 }} />
        <span>{error}</span>
      </div>
      <button onClick={() => load()} style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: txt2, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT_BODY }}>
        <ArrowPathIcon style={{ width: 11, height: 11 }} /> Retry
      </button>
    </div>
  )

  if (!stats) return null

  const totalCatCount = stats.categories.reduce((a, c) => a + c.count, 0)
  const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  return (
    <div style={cardStyle}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: dark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.09)',
            border: `1px solid ${dark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.14)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookmarkIcon style={{ width: '0.95rem', height: '0.95rem', color: dark ? '#60a5fa' : '#2563eb' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', margin: 0, letterSpacing: '-0.02em', fontFamily: FONT_HEADING }}>
              Bookmark Statistics
            </h2>
            <p style={{ fontSize: 11, color: txt2, margin: 0, fontFamily: FONT_BODY }}>
              {lastRefreshed
                ? `Updated ${lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Live data'}
            </p>
          </div>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          title="Refresh"
          style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${bdr}`, background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: txt2, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowPathIcon style={{ width: 13, height: 13, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <KpiCard icon={BookmarkIcon}          label="Total"   value={stats.total.toLocaleString()} sub="all time"      dark={dark} accentColor="#2563eb" />
        <div style={{
          background: surface, border: `1px solid ${bdr}`,
          borderTop: `2px solid #7c3aed`,
          borderRadius: 10, padding: '12px 13px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CalendarDaysIcon style={{ width: '0.8rem', height: '0.8rem', color: dark ? '#6b8cae' : '#94a3b8' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: dark ? '#2e4d70' : '#94a3b8', fontFamily: FONT_BODY }}>Week</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: dark ? '#e2ecf8' : '#0f172a', fontFamily: FONT_MONO, letterSpacing: '-0.02em' }}>{stats.thisWeek}</div>
          <Trend value={stats.weekTrend} />
        </div>
        <KpiCard icon={ClockIcon}             label="Today"   value={stats.today}                   sub="bookmarks"    dark={dark} accentColor="#0891b2" />
        <KpiCard icon={DevicePhoneMobileIcon} label="Digital" value={`${stats.digitalPct}%`}        sub="have e-copy"  dark={dark} accentColor="#059669" />
      </div>

      {/* ── 7-day activity bar chart ──────────────────────────────────── */}
      <div style={{ ...innerCard, marginBottom: 14 }}>
        <SubHeader icon={BoltIcon} label="7-Day Activity" dark={dark} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
          {stats.sparkData.map((v, i) => {
            const max  = Math.max(...stats.sparkData, 1)
            const h    = Math.max(4, Math.round((v / max) * 44))
            const isToday = i === 6
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: v > 0 ? (dark ? '#6b8cae' : '#94a3b8') : (dark ? '#2e4d70' : '#e2e8f0') }}>{v || ''}</span>
                <div
                  title={`${v} bookmark${v !== 1 ? 's' : ''}`}
                  style={{
                    width: '100%', height: h, borderRadius: 4,
                    background: isToday
                      ? '#2563eb'
                      : (dark ? 'rgba(37,99,235,0.28)' : 'rgba(37,99,235,0.18)'),
                    border: isToday ? '1px solid rgba(37,99,235,0.5)' : 'none',
                    transition: 'height 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
                <span style={{ fontSize: 9, fontWeight: 600, color: dark ? '#2e4d70' : '#cbd5e1', fontFamily: FONT_BODY }}>{DAY_LABELS[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Two-col: categories + top books ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

        {/* Category breakdown */}
        <div style={innerCard}>
          <SubHeader icon={Squares2X2Icon} label="By Category" dark={dark} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {stats.categories.length > 0
              ? stats.categories.map((cat, i) => (
                  <CategoryBar key={i} {...cat} total={totalCatCount} dark={dark} />
                ))
              : <span style={{ fontSize: 11, color: txt2 }}>No category data.</span>
            }
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Categories', value: stats.categories.length },
              { label: 'Public',     value: stats.publicCount },
            ].map(p => (
              <div key={p.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '5px 10px', borderRadius: 7,
                background: dark ? '#0f1e36' : '#f1f5f9',
                border: `1px solid ${bdr}`,
              }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155' }}>{p.value}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: txt2, marginTop: 1 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top bookmarked books */}
        <div style={innerCard}>
          <SubHeader icon={TrophyIcon} label="Most Bookmarked" dark={dark} />
          {stats.topBooks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.topBooks.slice(0, 5).map((book, i) => (
                <BookRow
                  key={book.id ?? i}
                  rank={i + 1}
                  title={book.title}
                  author={book.author}
                  bookmarkCount={book.bookmark_count ?? book.bookmarkCount ?? '—'}
                  dark={dark}
                />
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 11, color: txt2 }}>No top-books data available.</span>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 14, paddingTop: 12,
        borderTop: `1px solid ${bdr}`,
        fontSize: 11, color: txt2, fontFamily: FONT_BODY,
      }}>
        <span>{stats.withDigital} of {stats.total} bookmarks have a digital copy</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span>vs last week: {stats.lastWeek}</span>
          <ChevronRightIcon style={{ width: 10, height: 10 }} />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default BookmarkStatistics