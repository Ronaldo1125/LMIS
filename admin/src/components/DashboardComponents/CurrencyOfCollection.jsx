import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CalendarClock, TrendingUp, TrendingDown, Minus, X } from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000'
function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

const PALETTE = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#84cc16']

const PERIODS = [
  { key: 'day',   label: 'Day',   days: 1   },
  { key: 'week',  label: 'Week',  days: 7   },
  { key: 'month', label: 'Month', days: 30  },
  { key: 'year',  label: 'Year',  days: 365 },
]

function freshnessBadge(avgYear) {
  const age = new Date().getFullYear() - avgYear
  if (age <= 5)  return { label: 'Current',  color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  }
  if (age <= 10) return { label: 'Aging',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' }
  return              { label: 'Outdated',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)'  }
}

function filterByPeriod(books, days) {
  if (!days) return books
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return books.filter(b => {
    const d = b.created_at || b.accessioned_at || b.date_added
    if (!d) return false
    return new Date(d) >= cutoff
  })
}

export default function CurrencyOfCollection({ dark = false }) {
  const [allBooks, setAllBooks]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [period, setPeriod]         = useState('year')
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [isAnimating, setIsAnimating]   = useState(false)

  const card   = dark ? '#0c1c34' : '#ffffff'
  const bdr    = dark ? '#1a3356' : '#e8edf5'
  const surf   = dark ? '#07111f' : '#f8fafc'
  const txt1   = dark ? '#e2ecf8' : '#0f172a'
  const txt2   = dark ? '#6b8cae' : '#64748b'
  const shadow = dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 1px 6px rgba(0,0,0,0.07)'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const token = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [catRes, bookRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books/meta/categories`, { headers }),
          fetch(`${API_BASE_URL}/api/books?limit=999999&showArchived=false`, { headers }),
        ])
        const catsData  = catRes.ok  ? await catRes.json()  : []
        const booksData = bookRes.ok ? await bookRes.json() : {}
        setCategories(catsData)
        setAllBooks(booksData.books || [])
      } catch (e) {
        console.error('[CurrencyOfCollection]', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const derivedData = (() => {
    const days = PERIODS.find(p => p.key === period)?.days
    const books = filterByPeriod(allBooks, days).filter(b => {
      const y = parseInt(b.publication_year || b.year || b.pub_year)
      return !isNaN(y) && y > 1900 && y <= new Date().getFullYear()
    })
    const catYears = {}
    books.forEach(book => {
      const y = parseInt(book.publication_year || book.year || book.pub_year)
      const cat = book.category || 'Uncategorized'
      const match = categories.find(c => c.id === cat || c.name === cat)
      let catName = cat
      if (match?.parent_id) {
        const parent = categories.find(c => c.id === match.parent_id)
        if (parent) catName = parent.name
      } else if (match) {
        catName = match.name
      }
      if (!catYears[catName]) catYears[catName] = []
      catYears[catName].push(y)
    })
    return Object.entries(catYears)
      .map(([name, years]) => ({
        name,
        avg: Math.round(years.reduce((a, b) => a + b, 0) / years.length),
        count: years.length,
        min: Math.min(...years),
        max: Math.max(...years),
      }))
      .sort((a, b) => b.avg - a.avg)
  })()

  const allYears = derivedData.map(r => r.avg)
  const overall = allYears.length > 0
    ? Math.round(allYears.reduce((a, b) => a + b, 0) / allYears.length)
    : null
  const overallBadge = overall ? freshnessBadge(overall) : null

  const openModal  = () => { setIsModalOpen(true);  setTimeout(() => setIsAnimating(true), 10) }
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setIsModalOpen(false), 320) }

  const TrendIcon = ({ avg }) => {
    const age = new Date().getFullYear() - avg
    if (age <= 5)  return <TrendingUp  size={13} color="#22c55e" />
    if (age <= 10) return <Minus       size={13} color="#f59e0b" />
    return               <TrendingDown size={13} color="#ef4444" />
  }

  const PeriodTabs = () => (
    <div style={{
      display: 'flex', gap: 4,
      background: surf, borderRadius: 8, padding: 3,
      border: `1px solid ${bdr}`,
    }}>
      {PERIODS.map(p => (
        <button
          key={p.key}
          onClick={() => setPeriod(p.key)}
          style={{
            flex: 1, padding: '5px 0', borderRadius: 6, border: 'none',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.18s ease',
            background: period === p.key ? (dark ? '#1a3356' : '#ffffff') : 'transparent',
            color: period === p.key ? (dark ? '#e2ecf8' : '#0f172a') : txt2,
            boxShadow: period === p.key && !dark ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )

  const Row = ({ row, i }) => {
    const badge = freshnessBadge(row.avg)
    return (
      <div className="cc-row" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 8,
        background: surf, border: `1px solid ${bdr}`,
        borderLeft: `3px solid ${PALETTE[i % PALETTE.length]}`,
        transition: 'background 0.15s ease',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>{row.count} books · {row.min}–{row.max}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
          <TrendIcon avg={row.avg} />
          <span style={{ fontSize: 12, fontWeight: 800, color: badge.color, fontVariantNumeric: 'tabular-nums', fontFamily: "'DM Mono', monospace" }}>{row.avg}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: badge.color, background: dark ? `${badge.color}18` : badge.bg, padding: '1px 6px', borderRadius: 99 }}>{badge.label}</span>
        </div>
      </div>
    )
  }

  const ModalRow = ({ row, i }) => {
    const badge = freshnessBadge(row.avg)
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 12px', borderRadius: 8,
        border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
        borderLeft: `3px solid ${PALETTE[i % PALETTE.length]}`,
        background: dark ? '#0c1c34' : '#ffffff',
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1 }}>{row.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>{row.count} books · {row.min}–{row.max}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendIcon avg={row.avg} />
          <span style={{ fontSize: 13, fontWeight: 800, color: badge.color, fontVariantNumeric: 'tabular-nums', fontFamily: "'DM Mono', monospace" }}>{row.avg}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: badge.color, background: dark ? `${badge.color}18` : badge.bg, padding: '2px 7px', borderRadius: 99 }}>{badge.label}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{
        background: card, border: `1px solid ${bdr}`, borderRadius: 12,
        padding: '20px 22px', boxShadow: shadow,
        borderTop: '2.5px solid #8b5cf6',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}>
        <style>{`
          @keyframes cc-up { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
          @keyframes cc-spin { to { transform: rotate(360deg) } }
          .cc-row:hover { background: ${dark ? '#0f1e36' : '#f0f7ff'} !important; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)',
              border: `1px solid ${dark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarClock size={15} color="#8b5cf6" strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', letterSpacing: '-0.02em', fontFamily: "'Sora', sans-serif" }}>
                Collection Currency
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: txt2 }}>Avg publication year per category</p>
            </div>
          </div>
          {overall && overallBadge && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: dark ? `${overallBadge.color}18` : overallBadge.bg,
              border: `1px solid ${overallBadge.color}30`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: overallBadge.color, fontVariantNumeric: 'tabular-nums' }}>{overall}</span>
              <span style={{ fontSize: 10, color: overallBadge.color, fontWeight: 600 }}>{overallBadge.label}</span>
            </div>
          )}
        </div>

        {/* Period Tabs */}
        <div style={{ marginBottom: 14 }}>
          <PeriodTabs />
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: txt2, padding: '12px 0' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${bdr}`, borderTopColor: '#8b5cf6', animation: 'cc-spin 0.8s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13 }}>Analyzing collection…</span>
          </div>
        ) : derivedData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: txt1 }}>No data for this period</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2 }}>Try a wider time range</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {derivedData.slice(0, 5).map((row, i) => (
                <Row key={row.name} row={row} i={i} />
              ))}
            </div>
            {derivedData.length > 5 && (
              <button
                onClick={openModal}
                style={{
                  marginTop: 10, width: '100%', padding: '7px', borderRadius: 8,
                  background: 'transparent', border: `1px solid ${bdr}`,
                  fontSize: 12, fontWeight: 600, color: txt2, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? '#0f1e36' : '#f0f7ff'; e.currentTarget.style.color = txt1 }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = txt2 }}
              >
                View all {derivedData.length} categories →
              </button>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#0c1c34' : '#ffffff',
              border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              borderRadius: 16,
              boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(15,23,42,0.18)',
              width: '100%', maxWidth: '30rem', height: '70vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              background: dark ? '#07111f' : '#f8fafc', borderRadius: '16px 16px 0 0',
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: dark ? '#e2ecf8' : '#0f172a', fontFamily: "'Sora', sans-serif" }}>
                  All Categories — Currency
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: dark ? '#6b8cae' : '#64748b' }}>
                  Overall avg: {overall ?? '—'} · {PERIODS.find(p => p.key === period)?.label} view
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={16} color={dark ? '#6b8cae' : '#64748b'} />
              </button>
            </div>

            <div style={{ padding: '10px 18px', flexShrink: 0, borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}` }}>
              <PeriodTabs />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 7, borderRadius: '0 0 16px 16px' }}>
              {derivedData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: txt1 }}>No data for this period</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2 }}>Try a wider time range</p>
                </div>
              ) : derivedData.map((row, i) => <ModalRow key={row.name} row={row} i={i} />)}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}