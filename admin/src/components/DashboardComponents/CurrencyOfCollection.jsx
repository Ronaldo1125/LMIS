import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  CalendarClock, TrendingUp as RateIcon,
  X, ChevronRight, ArrowLeft,
  CheckCircle, AlertTriangle, Clock,
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

const PALETTE = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#84cc16', '#f97316']

const QUICK_PERIODS = [
  { key: '5',   label: '≤5 yrs',  maxAge: 5   },
  { key: '10',  label: '≤10 yrs', maxAge: 10  },
  { key: '20',  label: '≤20 yrs', maxAge: 20  },
  { key: 'all', label: 'All',     maxAge: null },
]

const VIEWS = [
  { key: 'age',  label: 'How Old Are Our Books?',    icon: CalendarClock },
  { key: 'rate', label: 'How Fast Do We Add Books?', icon: RateIcon      },
]

const NOW_YEAR = new Date().getFullYear()

function getBookYear(b) {
  return parseInt(b.date_of_publication || b.publication_year || b.year || b.pub_year)
}
function getAge(year) { return NOW_YEAR - year }

function freshnessBadge(avgYear) {
  const age = getAge(avgYear)
  if (age <= 5)  return { label: 'Up to Date',  color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   Icon: CheckCircle   }
  if (age <= 10) return { label: 'Getting Old', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', Icon: Clock         }
  return              { label: 'Outdated',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   Icon: AlertTriangle }
}

function freshnessBreakdown(years) {
  let fresh = 0, aging = 0, old = 0
  years.forEach(y => {
    const a = NOW_YEAR - y
    if (a <= 5) fresh++
    else if (a <= 10) aging++
    else old++
  })
  const t = years.length
  return {
    fresh: { count: fresh, pct: t ? Math.round(fresh / t * 100) : 0 },
    aging: { count: aging, pct: t ? Math.round(aging / t * 100) : 0 },
    old:   { count: old,   pct: t ? Math.round(old   / t * 100) : 0 },
  }
}

// ── Outside sub-components ────────────────────────────────

function ViewToggle({ view, setView, surf, bdr, txt2, dark }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: surf, borderRadius: 8, padding: 3, border: `1px solid ${bdr}` }}>
      {VIEWS.map(v => {
        const Icon = v.icon
        const active = view === v.key
        return (
          <button type="button" key={v.key} onClick={() => setView(v.key)} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none',
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            transition: 'all 0.18s ease',
            background: active ? (dark ? '#1a3356' : '#ffffff') : 'transparent',
            color: active ? (dark ? '#e2ecf8' : '#0f172a') : txt2,
            boxShadow: active && !dark ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            whiteSpace: 'nowrap',
          }}>
            <Icon size={11} />
            {v.label}
          </button>
        )
      })}
    </div>
  )
}

function PeriodControl({ quickPeriod, setQuickPeriod, useCustom, setUseCustom, customAge, setCustomAge, surf, bdr, txt1, txt2, dark }) {
  const PRESETS = [1, 2, 3, 5, 10, 15, 25, 50]
  const sliderVal = parseInt(customAge) || 10

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Quick tabs + Custom button */}
      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{ display: 'flex', flex: 1, gap: 3, background: surf, borderRadius: 8, padding: 3, border: `1px solid ${bdr}` }}>
          {QUICK_PERIODS.map(p => {
            const active = !useCustom && quickPeriod === p.key
            return (
              <button type="button" key={p.key} onClick={() => { setQuickPeriod(p.key); setUseCustom(false) }} style={{
                flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: active ? (dark ? '#1a3356' : '#ffffff') : 'transparent',
                color: active ? (dark ? '#e2ecf8' : '#0f172a') : txt2,
                boxShadow: active && !dark ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>
                {p.label}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => setUseCustom(u => !u)} style={{
          padding: '6px 14px', borderRadius: 8,
          border: `1.5px solid ${useCustom ? '#8b5cf6' : bdr}`,
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
          background: useCustom ? (dark ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.08)') : surf,
          color: useCustom ? '#8b5cf6' : txt2,
          transition: 'all 0.18s ease', whiteSpace: 'nowrap',
        }}>
          {useCustom ? `Custom: ${sliderVal}yr` : 'Custom'}
        </button>
      </div>

      {/* Custom panel */}
      {useCustom && (
        <div style={{
          background: surf,
          border: `1.5px solid #8b5cf6`,
          borderRadius: 12, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8b5cf6' }}>Show books published within the last</span>
            <span style={{
              fontSize: 14, fontWeight: 800, color: '#8b5cf6',
              background: dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)',
              padding: '2px 10px', borderRadius: 99,
              fontFamily: "'DM Mono', monospace",
            }}>
              {sliderVal} {sliderVal === 1 ? 'year' : 'years'}
            </span>
          </div>

          {/* Slider */}
          <div style={{ position: 'relative' }}>
            <style>{`
              .co-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 99px; outline: none; cursor: pointer; background: linear-gradient(to right, #8b5cf6 ${(sliderVal / 100) * 100}%, ${dark ? '#1a3356' : '#e8edf5'} ${(sliderVal / 100) * 100}%); }
              .co-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #8b5cf6; border: 2.5px solid ${dark ? '#0c1c34' : '#ffffff'}; cursor: pointer; box-shadow: 0 1px 6px rgba(139,92,246,0.4); }
              .co-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #8b5cf6; border: 2.5px solid ${dark ? '#0c1c34' : '#ffffff'}; cursor: pointer; }
            `}</style>
            <input
              type="range" min={1} max={100}
              value={sliderVal}
              onChange={e => setCustomAge(e.target.value)}
              className="co-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: txt2 }}>1 yr</span>
              <span style={{ fontSize: 9, color: txt2 }}>50 yrs</span>
              <span style={{ fontSize: 9, color: txt2 }}>100 yrs</span>
            </div>
          </div>

          {/* Preset chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {PRESETS.map(val => {
              const active = sliderVal === val
              return (
                <button type="button" key={val} onClick={() => setCustomAge(String(val))} style={{
                  padding: '3px 10px', borderRadius: 99,
                  border: `1px solid ${active ? '#8b5cf6' : bdr}`,
                  background: active ? (dark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)') : 'transparent',
                  color: active ? '#8b5cf6' : txt2,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}>
                  {val}yr
                </button>
              )
            })}
          </div>

          {/* Result label */}
          <p style={{ margin: 0, fontSize: 11, color: txt2 }}>
            Showing books published in{' '}
            <strong style={{ color: txt1 }}>{NOW_YEAR - sliderVal}</strong> or later
          </p>
        </div>
      )}
    </div>
  )
}

function AgeRow({ row, i, surf, bdr, txt1, txt2, dark, onClick }) {
  const badge = row.avg ? freshnessBadge(row.avg) : null
  const age   = row.avg ? getAge(row.avg) : null
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 8,
      background: surf, border: `1px solid ${bdr}`,
      borderLeft: `3px solid ${PALETTE[i % PALETTE.length]}`,
      cursor: 'pointer', transition: 'background 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.background = dark ? '#0f1e36' : '#f0f7ff'}
      onMouseLeave={e => e.currentTarget.style.background = surf}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>{row.count} books{row.min && row.max ? ` · published ${row.min}–${row.max}` : ''}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {age !== null && badge && (
          <>
            <span style={{ fontSize: 11, fontWeight: 700, color: badge.color, fontFamily: "'DM Mono', monospace" }}>~{age}yr old</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: badge.color, background: dark ? `${badge.color}18` : badge.bg, padding: '2px 7px', borderRadius: 99 }}>
              <badge.Icon size={10} />{badge.label}
            </span>
          </>
        )}
        <ChevronRight size={13} color={txt2} />
      </div>
    </div>
  )
}

function RateCard({ item, i, surf, bdr, txt2 }) {
  const color = PALETTE[i % PALETTE.length]
  return (
    <div style={{ padding: '12px 14px', borderRadius: 10, background: surf, border: `1px solid ${bdr}`, borderTop: `2.5px solid ${color}` }}>
      <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 600, color: txt2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1.2 }}>{item.value}</p>
      <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>{item.sub}</p>
    </div>
  )
}

function ModalCatCard({ row, i, bdr, txt1, txt2, dark, onClick }) {
  const badge = row.avg ? freshnessBadge(row.avg) : null
  const age   = row.avg ? getAge(row.avg) : null
  return (
    <div onClick={onClick} style={{
      borderRadius: 10, border: `1px solid ${bdr}`,
      borderLeft: `3px solid ${PALETTE[i % PALETTE.length]}`,
      background: dark ? '#0c1c34' : '#ffffff',
      cursor: 'pointer', transition: 'background 0.15s ease', overflow: 'hidden',
    }}
      onMouseEnter={e => e.currentTarget.style.background = dark ? '#0f1e36' : '#f0f7ff'}
      onMouseLeave={e => e.currentTarget.style.background = dark ? '#0c1c34' : '#ffffff'}
    >
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>{row.count} books{row.min && row.max ? ` · ${row.min}–${row.max}` : ''}</p>
          {row.breakdown && (
            <div style={{ display: 'flex', borderRadius: 99, overflow: 'hidden', height: 4, gap: 1, marginTop: 6 }}>
              {row.breakdown.fresh.pct > 0 && <div style={{ flex: row.breakdown.fresh.pct, background: '#22c55e' }} />}
              {row.breakdown.aging.pct > 0 && <div style={{ flex: row.breakdown.aging.pct, background: '#f59e0b' }} />}
              {row.breakdown.old.pct   > 0 && <div style={{ flex: row.breakdown.old.pct,   background: '#ef4444' }} />}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {age !== null && badge && (
            <span style={{ fontSize: 11, fontWeight: 700, color: badge.color, fontFamily: "'DM Mono', monospace" }}>~{age}yr</span>
          )}
          <ChevronRight size={14} color={txt2} />
        </div>
      </div>
    </div>
  )
}

function BookList({ row, activeMaxAge, surf, bdr, txt1, txt2, dark }) {
  const [search, setSearch]       = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  const visibleBooks = useMemo(() => {
    let list = row.books.filter(book => {
      if (activeMaxAge === null) return true
      const y = getBookYear(book)
      return !isNaN(y) && (NOW_YEAR - y) <= activeMaxAge
    })
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b => (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q))
    }
    if (sortOrder === 'newest')      list = [...list].sort((a, b) => (getBookYear(b) || 0) - (getBookYear(a) || 0))
    else if (sortOrder === 'oldest') list = [...list].sort((a, b) => (getBookYear(a) || 0) - (getBookYear(b) || 0))
    else                             list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    return list
  }, [row.books, search, sortOrder, activeMaxAge])

  const upToDate   = visibleBooks.filter(b => { const y = getBookYear(b); return !isNaN(y) && (NOW_YEAR - y) <= 5 }).length
  const gettingOld = visibleBooks.filter(b => { const y = getBookYear(b); return !isNaN(y) && (NOW_YEAR - y) > 5 && (NOW_YEAR - y) <= 10 }).length
  const outdated   = visibleBooks.filter(b => { const y = getBookYear(b); return !isNaN(y) && (NOW_YEAR - y) > 10 }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input type="text" placeholder="Search title or author…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '7px 10px', borderRadius: 8, background: surf, border: `1px solid ${bdr}`, color: txt1, fontSize: 11, outline: 'none' }}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
          style={{ padding: '7px 8px', borderRadius: 8, background: surf, border: `1px solid ${bdr}`, color: txt1, fontSize: 11, outline: 'none', cursor: 'pointer' }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: surf, border: `1px solid ${bdr}` }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: txt2 }}>{visibleBooks.length} of {row.books.length} books</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {upToDate   > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>{upToDate} up to date</span>}
          {gettingOld > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>{gettingOld} getting old</span>}
          {outdated   > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>{outdated} outdated</span>}
        </div>
      </div>

      {visibleBooks.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: txt2, textAlign: 'center', padding: '20px 0' }}>No books match.</p>
      ) : visibleBooks.map((book, i) => {
        const y       = getBookYear(book)
        const hasYear = !isNaN(y) && y > 1800
        const badge   = hasYear ? freshnessBadge(y) : null
        const age     = hasYear ? NOW_YEAR - y : null
        return (
          <div key={book.id || i} style={{
            padding: '9px 12px', borderRadius: 8,
            background: dark ? '#0c1c34' : '#ffffff',
            border: `1px solid ${bdr}`,
            borderLeft: badge ? `3px solid ${badge.color}` : `3px solid ${bdr}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {book.title || 'Untitled'}
                </p>
                {book.author && (
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    by {book.author}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                {hasYear ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 800, color: badge.color, fontFamily: "'DM Mono', monospace" }}>{y}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: badge.color, background: dark ? `${badge.color}18` : badge.bg, padding: '1px 7px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                      {age}yr · {badge.label}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: 9, color: txt2, fontStyle: 'italic' }}>No year</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export default function CurrencyOfCollection({ dark = false }) {
  const [allBooks, setAllBooks]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [view, setView]             = useState('age')
  const [quickPeriod, setQuickPeriod] = useState('all')
  const [customAge, setCustomAge]     = useState('10')
  const [useCustom, setUseCustom]     = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [drillCat, setDrillCat]       = useState(null)

  const card = dark ? '#0c1c34' : '#ffffff'
  const bdr  = dark ? '#1a3356' : '#e8edf5'
  const surf = dark ? '#07111f' : '#f8fafc'
  const txt1 = dark ? '#e2ecf8' : '#0f172a'
  const txt2 = dark ? '#6b8cae' : '#64748b'
  const theme = { surf, bdr, txt1, txt2, dark }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const h = getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
        const [cr, br] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books/meta/categories`, { headers: h }),
          fetch(`${API_BASE_URL}/api/books?limit=999999&showArchived=false`, { headers: h }),
        ])
        setCategories(cr.ok ? await cr.json() : [])
        const bd = br.ok ? await br.json() : {}
        setAllBooks(bd.books || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  const activeMaxAge = useMemo(() => {
    if (useCustom) {
      const v = parseInt(customAge)
      return isNaN(v) || v <= 0 ? null : v
    }
    return QUICK_PERIODS.find(p => p.key === quickPeriod)?.maxAge ?? null
  }, [useCustom, customAge, quickPeriod])

  const ageData = useMemo(() => {
    const catMap = {}
    allBooks.forEach(book => {
      const y = getBookYear(book)
      if (activeMaxAge !== null && (isNaN(y) || (NOW_YEAR - y) > activeMaxAge)) return
      const cat = book.category || 'Uncategorized'
      const match = categories.find(c => c.id === cat || c.name === cat)
      let catName = cat
      if (match?.parent_id) {
        const parent = categories.find(c => c.id === match.parent_id)
        if (parent) catName = parent.name
      } else if (match) catName = match.name
      if (!catMap[catName]) catMap[catName] = { years: [], books: [] }
      catMap[catName].books.push(book)
      if (!isNaN(y) && y > 1800 && y <= NOW_YEAR + 1) catMap[catName].years.push(y)
    })
    return Object.entries(catMap)
      .map(([name, { years, books }]) => ({
        name, books, years, count: books.length,
        avg: years.length > 0 ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : null,
        min: years.length > 0 ? Math.min(...years) : null,
        max: years.length > 0 ? Math.max(...years) : null,
        breakdown: years.length > 0 ? freshnessBreakdown(years) : null,
      }))
      .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
  }, [allBooks, categories, activeMaxAge])

  const overallSummary = useMemo(() => {
    let fresh = 0, aging = 0, old = 0
    ageData.forEach(r => {
      if (!r.breakdown) return
      fresh += r.breakdown.fresh.count
      aging += r.breakdown.aging.count
      old   += r.breakdown.old.count
    })
    return { fresh, aging, old, total: fresh + aging + old }
  }, [ageData])

  const rateData = useMemo(() => {
    const dated = allBooks.filter(b => b.created_at || b.accessioned_at || b.date_added)
    if (!dated.length) return null
    const dates = dated.map(b => new Date(b.created_at || b.accessioned_at || b.date_added)).filter(d => !isNaN(d)).sort((a, b) => a - b)
    if (!dates.length) return null
    const totalDays = Math.max(1, Math.round((Date.now() - dates[0]) / 86400000))
    const total = dated.length
    return [
      { label: 'Per Day',   value: (total / totalDays).toFixed(2),                    sub: 'books on average each day'   },
      { label: 'Per Week',  value: (total / Math.max(1, totalDays / 7)).toFixed(1),   sub: 'books on average each week'  },
      { label: 'Per Month', value: (total / Math.max(1, totalDays / 30)).toFixed(1),  sub: 'books on average each month' },
      { label: 'Per Year',  value: (total / Math.max(1, totalDays / 365)).toFixed(0), sub: 'books on average each year'  },
    ]
  }, [allBooks])

  const openModal  = () => { setIsModalOpen(true);  setTimeout(() => setIsAnimating(true), 10) }
  const closeModal = () => { setIsAnimating(false); setTimeout(() => { setIsModalOpen(false); setDrillCat(null) }, 320) }
  const accentColor = view === 'age' ? '#8b5cf6' : '#10b981'

  return (
    <>
      <style>{`@keyframes co-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '20px 22px', borderTop: `2.5px solid ${accentColor}`, transition: 'background 0.35s ease' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: dark ? `rgba(${view === 'age' ? '139,92,246' : '16,185,129'},0.15)` : `rgba(${view === 'age' ? '139,92,246' : '16,185,129'},0.08)`,
            border: `1px solid rgba(${view === 'age' ? '139,92,246' : '16,185,129'},0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {view === 'age' ? <CalendarClock size={15} color="#8b5cf6" strokeWidth={2.2} /> : <RateIcon size={15} color="#10b981" strokeWidth={2.2} />}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', letterSpacing: '-0.02em', fontFamily: "'Sora', sans-serif" }}>
              {view === 'age' ? 'How Old Are Our Books?' : 'How Fast Do We Add Books?'}
            </h2>
            <p style={{ margin: 0, fontSize: 11, color: txt2 }}>
              {view === 'age'
                ? overallSummary.total > 0 ? `${overallSummary.fresh} up to date · ${overallSummary.aging} getting old · ${overallSummary.old} outdated` : 'Book freshness by section'
                : 'Average number of books added over time'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <ViewToggle view={view} setView={setView} {...theme} />
        </div>

        {view === 'age' && (
          <div style={{ marginBottom: 14 }}>
            <PeriodControl
              quickPeriod={quickPeriod} setQuickPeriod={setQuickPeriod}
              useCustom={useCustom} setUseCustom={setUseCustom}
              customAge={customAge} setCustomAge={setCustomAge}
              {...theme}
            />
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: txt2, padding: '12px 0' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${bdr}`, borderTopColor: accentColor, animation: 'co-spin 0.8s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13 }}>Loading…</span>
          </div>
        ) : view === 'age' ? (
          ageData.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: txt2, textAlign: 'center', padding: '20px 0' }}>No books match this filter.</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ageData.slice(0, 4).map((row, i) => (
                  <AgeRow key={row.name} row={row} i={i} {...theme} onClick={() => { setDrillCat(row); openModal() }} />
                ))}
              </div>
              {ageData.length > 4 && (
                <button type="button" onClick={() => { setDrillCat(null); openModal() }}
                  style={{ marginTop: 10, width: '100%', padding: '7px', borderRadius: 8, background: 'transparent', border: `1px solid ${bdr}`, fontSize: 12, fontWeight: 600, color: txt2, cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? '#0f1e36' : '#f0f7ff'; e.currentTarget.style.color = txt1 }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = txt2 }}
                >
                  View all {ageData.length} sections →
                </button>
              )}
            </>
          )
        ) : rateData ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {rateData.map((item, i) => <RateCard key={item.label} item={item} i={i} surf={surf} bdr={bdr} txt2={txt2} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: txt1 }}>No data available</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2 }}>Books need a created_at date to calculate this</p>
          </div>
        )}
      </div>

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{
            background: dark ? '#0c1c34' : '#ffffff',
            border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
            borderRadius: 16, width: '100%', maxWidth: '32rem', height: '82vh',
            display: 'flex', flexDirection: 'column',
            transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
            opacity: isAnimating ? 1 : 0,
            transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`, background: dark ? '#07111f' : '#f8fafc', borderRadius: '16px 16px 0 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {drillCat && (
                  <button type="button" onClick={() => setDrillCat(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <ArrowLeft size={16} color={dark ? '#6b8cae' : '#64748b'} />
                  </button>
                )}
                <div>
                  <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: dark ? '#e2ecf8' : '#0f172a', fontFamily: "'Sora', sans-serif" }}>
                    {drillCat ? drillCat.name : 'Book Age by Section'}
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2 }}>
                    {drillCat ? `${drillCat.count} books — click ← to go back` : 'Tap any section to see its books'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeModal} style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={16} color={dark ? '#6b8cae' : '#64748b'} />
              </button>
            </div>

            {!drillCat && overallSummary.total > 0 && (
              <div style={{ padding: '10px 18px', flexShrink: 0, borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}` }}>
                <div style={{ display: 'flex', borderRadius: 99, overflow: 'hidden', height: 7, gap: 1, marginBottom: 5 }}>
                  {overallSummary.fresh > 0 && <div style={{ flex: overallSummary.fresh, background: '#22c55e' }} />}
                  {overallSummary.aging > 0 && <div style={{ flex: overallSummary.aging, background: '#f59e0b' }} />}
                  {overallSummary.old   > 0 && <div style={{ flex: overallSummary.old,   background: '#ef4444' }} />}
                </div>
                <p style={{ margin: 0, fontSize: 10, color: txt2 }}>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>{overallSummary.fresh} up to date</span>
                  {' · '}
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{overallSummary.aging} getting old</span>
                  {' · '}
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>{overallSummary.old} outdated</span>
                </p>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {drillCat
                ? <BookList row={drillCat} activeMaxAge={activeMaxAge} surf={surf} bdr={bdr} txt1={txt1} txt2={txt2} dark={dark} />
                : ageData.map((row, i) => (
                    <ModalCatCard key={row.name} row={row} i={i} bdr={bdr} txt1={txt1} txt2={txt2} dark={dark} onClick={() => setDrillCat(row)} />
                  ))
              }
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}