import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Copy, AlertTriangle, BookOpen, X, ChevronRight } from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000'
function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

function normalize(str) {
  return (str || '').trim().toLowerCase()
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DuplicateTitlesDetector({ dark = false }) {
  const [duplicates, setDuplicates] = useState([])
  const [loading, setLoading]       = useState(true)
  const [selected, setSelected]     = useState(null)
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
        const res = await fetch(`${API_BASE_URL}/api/books?limit=999999&showArchived=false`, { headers })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const books = data.books || []

        const titleGroups = {}
        books.forEach(book => {
          const key = normalize(book.title)
          if (!key) return
          if (!titleGroups[key]) titleGroups[key] = []
          titleGroups[key].push(book)
        })

        const dupes = Object.values(titleGroups)
          .filter(g => g.length > 1)
          .map(g => {
            const authors = g.map(b => normalize(b.author || ''))
            const allSameAuthor = authors.every(a => a === authors[0] && a !== '')
            return {
              title: g[0].title,
              count: g.length,
              matchLevel: allSameAuthor ? 'full' : 'partial',
              books: g,
            }
          })
          .sort((a, b) => {
            if (a.matchLevel !== b.matchLevel) return a.matchLevel === 'full' ? -1 : 1
            return b.count - a.count
          })

        setDuplicates(dupes)
      } catch (e) {
        console.error('[DuplicateTitlesDetector]', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openModal = (dupe) => {
    setSelected(dupe)
    setIsModalOpen(true)
    setTimeout(() => setIsAnimating(true), 10)
  }
  const closeModal = () => {
    setIsAnimating(false)
    setTimeout(() => { setIsModalOpen(false); setSelected(null) }, 320)
  }

  const totalDupes = duplicates.reduce((sum, d) => sum + d.count, 0)
  const redCount    = duplicates.filter(d => d.matchLevel === 'full').length
  const yellowCount = duplicates.filter(d => d.matchLevel === 'partial').length

  return (
    <>
      <div style={{
        background: card, border: `1px solid ${bdr}`, borderRadius: 12,
        padding: '20px 22px', boxShadow: shadow,
        borderTop: '2.5px solid #ef4444',
        transition: 'background 0.35s ease, border-color 0.35s ease',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes dup-up   { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
          @keyframes dup-spin { to { transform: rotate(360deg) } }
          .dup-row { transition: background 0.15s ease; cursor: pointer; }
          .dup-row:hover { background: ${dark ? '#0f1e36' : '#f0f7ff'} !important; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Copy size={15} color="#ef4444" strokeWidth={2.2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', letterSpacing: '-0.02em', fontFamily: "'Sora', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Duplicate Titles
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: txt2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Books with matching title or author</p>
            </div>
          </div>
          {!loading && duplicates.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              {redCount > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 99,
                  background: dark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)',
                  border: `1px solid rgba(239,68,68,0.2)`,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>{redCount}</span>
                </div>
              )}
              {yellowCount > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 99,
                  background: dark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.07)',
                  border: `1px solid rgba(245,158,11,0.2)`,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{yellowCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: txt2, padding: '12px 0' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${bdr}`, borderTopColor: '#ef4444', animation: 'dup-spin 0.8s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13 }}>Scanning collection…</span>
          </div>
        ) : duplicates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <BookOpen size={18} color="#22c55e" />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: txt1 }}>No duplicates found</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2 }}>Your collection looks clean</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
            {duplicates.slice(0, 5).map((dupe, i) => {
              const accentColor = dupe.matchLevel === 'full' ? '#ef4444' : '#f59e0b'
              return (
                <div
                  key={i}
                  className="dup-row"
                  onClick={() => openModal(dupe)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', borderRadius: 8,
                    background: surf, border: `1px solid ${bdr}`,
                    borderLeft: `3px solid ${accentColor}`,
                    animation: `dup-up 0.35s ease ${i * 0.05}s both`,
                    minWidth: 0,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dupe.title}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: txt2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dupe.matchLevel === 'full' ? 'Same title & author' : 'Same title, different authors'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: accentColor,
                      background: dark ? `${accentColor}18` : `${accentColor}10`,
                      padding: '2px 7px', borderRadius: 99,
                    }}>{dupe.count}×</span>
                    <ChevronRight size={13} color={txt2} />
                  </div>
                </div>
              )
            })}
            {duplicates.length > 5 && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2, textAlign: 'center' }}>
                +{duplicates.length - 5} more duplicate groups
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selected && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: card, border: `1px solid ${bdr}`,
              borderRadius: 16, boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(15,23,42,0.18)',
              width: '100%', maxWidth: '30rem', height: '70vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', borderBottom: `1px solid ${bdr}`,
              background: dark ? '#07111f' : '#f8fafc', borderRadius: '16px 16px 0 0', flexShrink: 0,
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: txt1, fontFamily: "'Sora', sans-serif" }}>
                  {selected.count} copies found
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: txt2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{selected.title}"</p>
              </div>
              <button onClick={closeModal}
                style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0, marginLeft: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={16} color={txt2} />
              </button>
            </div>

            {/* Modal Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8, borderRadius: '0 0 16px 16px' }}>
              {selected.books.map((book, i) => {
                const accentColor = selected.matchLevel === 'full' ? '#ef4444' : '#f59e0b'
                const dateAdded = book.created_at || book.accessioned_at || book.date_added
                return (
                  <div key={book.id || i} style={{
                    padding: '10px 12px', borderRadius: 9,
                    border: `1px solid ${bdr}`,
                    borderLeft: `3px solid ${accentColor}`,
                    background: dark ? '#0c1c34' : '#ffffff',
                    minWidth: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: txt1, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</span>
                      <span style={{ fontSize: 10, color: txt2, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
                        {formatDate(dateAdded)}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      by {book.author || 'Unknown'} · {book.category || 'Uncategorized'}
                    </p>
                    {book.accession_no && (
                      <p style={{ margin: '2px 0 0', fontSize: 10, color: dark ? '#4a6a8a' : '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
                        {book.accession_no}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}