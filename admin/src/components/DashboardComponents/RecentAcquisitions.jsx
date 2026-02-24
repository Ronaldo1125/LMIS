import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const RecentAcquisitions = ({ dark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [acquisitions, setAcquisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Category color mapping
  const categoryColors = {
    'Books': 'var(--dark-blue-1)',
    'Reports': '#64748b',
    'Periodicals': 'var(--secondary-1-medium)',
    'Sourcebook': 'var(--secondary-3-medium)',
    'Thesis/Research papers': 'var(--dark-blue-1)',
    'Statute/Law/Legal Documents': '#64748b',
    'Guides/Manuals': 'var(--secondary-1-medium)',
    'Reference Materials': 'var(--secondary-3-medium)',
    'Uncategorized': '#94a3b8'
  }

  // Category type mapping
  const categoryTypes = {
    'Books': 'Book',
    'Reports': 'Report',
    'Periodicals': 'Periodical',
    'Sourcebook': 'Sourcebook',
    'Thesis/Research papers': 'Thesis',
    'Statute/Law/Legal Documents': 'Law Document',
    'Guides/Manuals': 'Manual',
    'Reference Materials': 'Reference Material',
    'Uncategorized': 'Uncategorized'
  }

  useEffect(() => {
    fetchAcquisitions()
  }, [])

  const fetchAcquisitions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/acquisitions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch acquisitions')
      }

      const data = await response.json()
      
      // Map the data to include color and type based on category
      const formattedAcquisitions = (data.data || []).map(item => ({
        title: item.title,
        type: categoryTypes[item.category] || 'Other',
        author: item.author || 'Unknown Author',
        date: item.date_accessioned,
        category: item.category || 'Uncategorized',
        color: categoryColors[item.category] || '#505862',
        id: item.id
      }))

      setAcquisitions(formattedAcquisitions)
    } catch (err) {
      console.error('Error fetching acquisitions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const openModal = () => {
    setIsModalOpen(true)
    setTimeout(() => setIsAnimating(true), 10)
  }

  const closeModal = () => {
    setIsAnimating(false)
    setTimeout(() => setIsModalOpen(false), 400)
  }

  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const cardBorder   = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted    = dark ? '#2e4d70' : '#6b7280'
  const itemBg       = dark ? '#081422' : '#ffffff'
  const itemBorder   = dark ? '#1a3356' : '#e2e8f0'
  const imagePlaceholder = dark ? '#1a3356' : '#e5e7eb'
  const imagePlaceholderText = dark ? '#2e4d70' : '#9ca3af'
  const modalBg      = dark ? '#0f1f38' : '#ffffff'
  const modalBorder  = dark ? '#1a3356' : '#e2e8f0'
  const closeHover   = dark ? '#1a3356' : '#f1f5f9'

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '0.5rem',
    boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', height: '100%',
    position: 'relative',
    transition: 'background 0.45s ease, border-color 0.45s ease',
  }

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
          Recent Acquisitions
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: textSecondary }}>Loading acquisitions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
          Recent Acquisitions
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: dark ? '#fca5a5' : '#ef4444' }}>Error: {error}</span>
        </div>
      </div>
    )
  }

  if (acquisitions.length === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
          Recent Acquisitions
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: textSecondary }}>No recent acquisitions found</span>
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
        Recent Acquisitions
      </h2>

      {/* Preview list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {acquisitions.slice(0, 4).map((item, index) => (
          <div
            key={item.id || index}
            style={{
              background: itemBg,
              border: `1px solid ${itemBorder}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.75rem', color: textSecondary, fontStyle: 'italic', margin: '0.25rem 0 0' }}>
              by {item.author}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={openModal}
        style={{
          marginTop: '1rem', padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          background: dark ? '#1a3356' : '#64748b',
          color: '#ffffff',
          border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: '0.875rem',
          transition: 'background 0.2s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.background = dark ? '#2e4d70' : '#475569' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = dark ? '#1a3356' : '#64748b' }}
      >
        View More ({acquisitions.length} total)
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50,
            background: isAnimating ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
            opacity: isAnimating ? 1 : 0,
            transition: 'background 0.4s ease, opacity 0.4s ease',
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: modalBg,
              border: dark ? `1px solid ${modalBorder}` : 'none',
              borderRadius: '1rem',
              boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.15)',
              width: '100%', maxWidth: '42rem',
              height: '85vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(2.5rem)',
              opacity: isAnimating ? 1 : 0,
              transformOrigin: 'bottom center',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: `1px solid ${modalBorder}`,
              borderRadius: '1rem 1rem 0 0',
              background: dark ? '#0d1d35' : '#ffffff',
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>
                  Recent Acquisitions
                </h2>
                <p style={{ fontSize: '0.75rem', color: textMuted, margin: '0.25rem 0 0' }}>
                  {acquisitions.length} items acquired in the last 14 days
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: '0.5rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = closeHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: textSecondary }} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {acquisitions.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${item.color}`,
                    display: 'flex', gap: '1rem',
                    background: dark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                    transition: 'background 0.45s ease',
                  }}
                >
                  {/* Image Placeholder — ONLY IN MODAL */}
                  <div style={{
                    width: '5rem', height: '6rem',
                    background: imagePlaceholder,
                    borderRadius: '0.375rem',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: imagePlaceholderText,
                  }}>
                    Image
                  </div>

                  {/* Text Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: 0 }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: textSecondary, fontStyle: 'italic', margin: '0.125rem 0 0' }}>
                          by {item.author}
                        </p>
                      </div>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem', fontWeight: 700,
                        textTransform: 'uppercase',
                        background: `${item.color}25`,
                        color: item.color,
                        flexShrink: 0,
                      }}>
                        {item.type}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderTop: `1px solid ${dark ? '#1a3356' : '#f1f5f9'}`,
                      paddingTop: '0.5rem',
                    }}>
                      <span style={{ fontSize: '0.75rem', color: textMuted }}>{item.category}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.color }}>
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: `1px solid ${modalBorder}`,
              display: 'flex', justifyContent: 'flex-end',
              background: dark ? '#0d1d35' : '#ffffff',
              borderRadius: '0 0 1rem 1rem',
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 500,
                  background: 'var(--dark-blue-1)', color: '#ffffff',
                  border: 'none', cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default RecentAcquisitions