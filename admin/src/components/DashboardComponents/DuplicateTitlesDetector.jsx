import { useState, useEffect } from 'react'
import { Copy, AlertTriangle, BookOpen, X, ChevronRight } from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000'
function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

export default function DuplicateTitlesDetector({ dark = false }) {
  const [duplicates, setDuplicates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const card   = dark ? '#0c1c34' : '#ffffff'
  const bdr    = dark ? '#1a3356' : '#e8edf5'
  const surf   = dark ? '#07111f' : '#f8fafc'
  const txt1   = dark ? '#e2ecf8' : '#0f172a'
  const txt2   = dark ? '#6b8cae' : '#64748b'
  const shadow = dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 1px 6px rgba(0,0,0,0.07)'

  const cardBase = {
    background: card, border: `1px solid ${bdr}`, borderRadius: 12,
    padding: '20px 22px', boxShadow: shadow,
    transition: 'background 0.35s ease, border-color 0.35s ease',
  }

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      try {
        const token = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_BASE_URL}/api/books?limit=999999&showArchived=false`, { headers })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const books = data.books || []

        // Group by normalized title
        const groups = {}
        books.forEach(book => {
          const key = (book.title || '').trim().toLowerCase()
          if (!key) return
          if (!groups[key]) groups[key] = []
          groups[key].push(book)
        })

        const dupes = Object.values(groups)
          .filter(g => g.length > 1)
          .sort((a, b) => b.length - a.length)
          .map(g => ({
            title: g[0].title,
            count: g.length,
            books: g,
          }))

        setDuplicates(dupes)
      } catch (e) {
        console.error('[DuplicateTitlesDetector]', e)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
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

  return (
    <>
      <div style={cardBase}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500;700&display=swap');
          @keyframes dup-up { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
          .dup-row { transition: background 0.15s ease; cursor: pointer; }
          .dup-row:hover { background: ${dark ? '#0f1e36' : '#f0f7ff'} !important; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Copy size={15} color="#ef4444" strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', letterSpacing: '-0.02em', fontFamily: "'Sora', sans-serif" }}>
                Duplicate Titles
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: txt2 }}>Books with matching title in system</p>
            </div>
          </div>
          {!loading && duplicates.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: dark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.15)'}`,
            }}>
              <AlertTriangle size={11} color="#ef4444" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>{totalDupes} duplicates</span>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: txt2, padding: '12px 0' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${bdr}`, borderTopColor: '#ef4444', animation: 'dup-spin 0.8s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13 }}>Scanning collection…</span>
            <style>{`@keyframes dup-spin { to { transform: rotate(360deg) } }`}</style>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {duplicates.slice(0, 5).map((dupe, i) => (
              <div
                key={i}
                className="dup-row"
                onClick={() => openModal(dupe)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', borderRadius: 8,
                  background: surf, border: `1px solid ${bdr}`,
                  borderLeft: `3px solid #ef4444`,
                  animation: `dup-up 0.35s ease ${i * 0.05}s both`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dupe.title}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: txt2 }}>
                    {dupe.books[0]?.author || 'Unknown author'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#ef4444',
                    background: dark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                    padding: '2px 8px', borderRadius: 99,
                  }}>{dupe.count}×</span>
                  <ChevronRight size={13} color={txt2} />
                </div>
              </div>
            ))}
            {duplicates.length > 5 && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: txt2, textAlign: 'center' }}>
                +{duplicates.length - 5} more duplicate groups
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
            background: 'transparent', transition: 'background 0.32s ease',
          }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff', border: `1px solid #e8edf5`,
              borderRadius: 16, boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
              width: '100%', maxWidth: '30rem', maxHeight: '80vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #e8edf5', background: '#f8fafc', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Duplicate Entries</h2>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>{selected.count} copies of "{selected.title}"</p>
              </div>
              <button onClick={closeModal} style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={16} color="#64748b" />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.books.map((book, i) => (
                <div key={book.id || i} style={{ padding: '10px 12px', borderRadius: 9, border: '1px solid #e8edf5', background: i === 0 ? '#fff' : '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{book.title}</span>
                    {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.08)', padding: '1px 7px', borderRadius: 99 }}>Original</span>}
                    {i > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '1px 7px', borderRadius: 99 }}>Duplicate</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>by {book.author || 'Unknown'} · {book.category || 'Uncategorized'}</p>
                  {book.accession_no && <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>Accession: {book.accession_no}</p>}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 18px', borderTop: '1px solid #e8edf5', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 16px 16px' }}>
              <button onClick={closeModal} style={{ padding: '7px 18px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
