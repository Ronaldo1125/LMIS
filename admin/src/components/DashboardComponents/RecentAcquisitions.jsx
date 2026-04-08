import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import PDFThumbnail from './PDFThumbnail'


const RecentAcquisitions = ({ dark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [acquisitions, setAcquisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const categoryColors = {
    'Books': '#2563eb',
    'Reports': '#64748b',
    'Periodicals': '#7c3aed',
    'Sourcebook': '#f59e0b',
    'Thesis/Research papers': '#0891b2',
    'Statute/Law/Legal Documents': '#374151',
    'Guides/Manuals': '#059669',
    'Reference Materials': '#dc2626',
    'Uncategorized': '#94a3b8'
  }

  const categoryTypes = {
    'Books': 'Book', 'Reports': 'Report', 'Periodicals': 'Periodical',
    'Sourcebook': 'Sourcebook', 'Thesis/Research papers': 'Thesis',
    'Statute/Law/Legal Documents': 'Law Doc', 'Guides/Manuals': 'Manual',
    'Reference Materials': 'Reference', 'Uncategorized': 'Other'
  }

  useEffect(() => { fetchAcquisitions() }, [])
  
  const API_URL = import.meta.env.VITE_API_URL

  const fetchAcquisitions = async () => {
    try {
      setLoading(true); setError(null)
      const res = await fetch(`${API_URL}/acquisitions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      if (!res.ok) throw new Error('Failed to fetch acquisitions')
      const data = await res.json()
      setAcquisitions((data.data || []).map(item => ({
        title: item.title,
        type: categoryTypes[item.category] || 'Other',
        author: item.author || 'Unknown Author',
        date: item.date_accessioned,
        category: item.category || 'Uncategorized',
        color: categoryColors[item.category] || '#94a3b8',
        id: item.id, uploadId: item.upload_id,
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (ds) => {
    const d = new Date(ds), now = new Date()
    const diff = Math.ceil(Math.abs(now - d) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 14) return `${diff}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const openModal = () => { setIsModalOpen(true); setTimeout(() => setIsAnimating(true), 10) }
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setIsModalOpen(false), 380) }

  // ── Tokens ──────────────────────────────────────────────────────────────
  const bg       = dark ? '#0c1c34' : '#ffffff'
  const bdr      = dark ? '#1a3356' : '#e8edf5'
  const txt1     = dark ? '#e2ecf8' : '#0f172a'
  const txt2     = dark ? '#6b8cae' : '#64748b'
  const txt3     = dark ? '#2e4d70' : '#94a3b8'
  const itemBg   = dark ? '#07111f' : '#f8fafc'
  const modalBg  = dark ? '#0c1c34' : '#ffffff'
  const hdBg     = dark ? '#07111f' : '#f8fafc'

  const cardStyle = {
    background: bg, border: `1px solid ${bdr}`,
    borderRadius: 12,
    boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)',
    padding: '20px 22px', display: 'flex', flexDirection: 'column', height: '100%',
    transition: 'background 0.35s ease, border-color 0.35s ease',
    fontFamily: "'DM Sans', sans-serif",
  }

  const SectionHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: dark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.09)',
          border: `1px solid ${dark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.14)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BookOpenIcon style={{ width: '0.95rem', height: '0.95rem', color: dark ? '#60a5fa' : '#2563eb' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', margin: 0, letterSpacing: '-0.02em', fontFamily: "'Sora', sans-serif" }}>
            Recent Acquisitions
          </h2>
          <p style={{ fontSize: 11, color: txt2, margin: 0 }}>Latest additions to the collection</p>
        </div>
      </div>
    </div>
  )

  if (loading || error || acquisitions.length === 0) return (
    <div style={cardStyle}>
      <SectionHeader />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 120 }}>
        <span style={{ color: error ? '#f87171' : txt2, fontSize: 13 }}>
          {loading ? 'Loading…' : error ? `Error: ${error}` : 'No acquisitions found'}
        </span>
      </div>
    </div>
  )

  return (
    <div style={cardStyle}>
      <SectionHeader />

      {/* Preview list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {acquisitions.slice(0, 4).map((item, i) => (
          <div
            key={item.id || i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              background: hoveredIndex === i ? (dark ? '#0f1e36' : '#f0f5ff') : itemBg,
              border: `1px solid ${hoveredIndex === i ? item.color + '50' : bdr}`,
              borderLeft: `3px solid ${item.color}`,
              borderRadius: 9, padding: '10px 12px',
              transition: 'all 0.2s ease',
              cursor: 'default',
              transform: hoveredIndex === i ? 'translateX(4px)' : 'translateX(0)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: txt1, margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.title}</p>
                <p style={{ fontSize: 11, color: txt2, fontStyle: 'italic', margin: '2px 0 0' }}>
                  by {item.author}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: item.color, background: `${item.color}18`,
                  border: `1px solid ${item.color}28`,
                  padding: '2px 6px', borderRadius: 5,
                }}>{item.type}</span>
                <span style={{ fontSize: 10, color: txt3 }}>{formatDate(item.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={openModal}
        style={{
          marginTop: 14, padding: '9px 14px', borderRadius: 9,
          background: dark ? '#1a3356' : '#2563eb',
          color: '#ffffff', border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 13, width: '100%',
          transition: 'all 0.2s ease', fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '-0.01em',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        View All ({acquisitions.length} total)
      </button>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
          }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#0c1c34' : '#ffffff', border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              borderRadius: 16,
              boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.15)',
              width: '100%', maxWidth: '42rem',
              height: '70vh', minHeight: 300,
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              background: dark ? '#07111f' : '#f8fafc', borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#0f172a', margin: 0, fontFamily: "'Sora', sans-serif" }}>
                  Recent Acquisitions
                </h2>
                <p style={{ fontSize: 11, color: dark ? '#6b8cae' : '#64748b', margin: '2px 0 0' }}>
                  {acquisitions.length} items in the collection
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XMarkIcon style={{ width: '1.2rem', height: '1.2rem', color: '#64748b' }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, borderRadius: '0 0 16px 16px' }}>
              {acquisitions.map((item, i) => (
                <div
                  key={item.id || i}
                  style={{
                    padding: '12px 14px', borderRadius: 10,
                    border: `1px solid ${item.color}40`,
                    background: dark ? '#0c1c34' : '#ffffff',
                    display: 'flex', gap: 12,
                  }}
                >
                  <div style={{ width: '4.5rem', height: '5.5rem', flexShrink: 0, borderRadius: 7, overflow: 'hidden' }}>
                    <PDFThumbnail uploadId={item.uploadId} title={item.title} style={{ borderRadius: 7 }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: txt1, margin: 0 }}>{item.title}</h3>
                        <span style={{
                          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.06em', color: item.color,
                          background: `${item.color}18`, border: `1px solid ${item.color}28`,
                          padding: '2px 6px', borderRadius: 5, flexShrink: 0,
                        }}>{item.type}</span>
                      </div>
                      <p style={{ fontSize: 11, color: txt2, fontStyle: 'italic', margin: '3px 0 0' }}>by {item.author}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${bdr}`, paddingTop: 6 }}>
                      <span style={{ fontSize: 11, color: txt2 }}>{item.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default RecentAcquisitions