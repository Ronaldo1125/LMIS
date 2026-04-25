import { useState, useEffect } from 'react'
import { MessageSquare, Star, Trash2 } from 'lucide-react'

const Feedbacks = ({ dark }) => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, feedbackId: null })

  // ── Colors ────────────────────────────────────────────────
  const pageBg       = dark ? '#0a1628' : '#f8fafc'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg    = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor    = dark ? '#93c5fd' : '#2563eb'
  const borderColor  = dark ? '#1a3356' : '#e2e8f0'
  const hoverBg      = dark ? '#1a3356' : '#f1f5f9'

  // ── Fetch Feedbacks ───────────────────────────────────────
  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedbacks`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data)
      } else {
        setError('Failed to fetch feedbacks')
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      setError('An error occurred while fetching feedbacks')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete Feedback ───────────────────────────────────────
  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, feedbackId: id })
  }

  const confirmDelete = async () => {
    const id = deleteModal.feedbackId
    setDeleteModal({ isOpen: false, feedbackId: null })

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedbacks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setFeedbacks(feedbacks.filter(f => f.id !== id))
      } else {
        alert('Failed to delete feedback')
      }
    } catch (err) {
      console.error('Error deleting feedback:', err)
      alert('An error occurred while deleting feedback')
    }
  }

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, feedbackId: null })
  }

  // ── Render Star Rating ────────────────────────────────────
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: '1rem',
              height: '1rem',
              color: star <= rating ? '#fbbf24' : dark ? '#374151' : '#d1d5db',
              fill: star <= rating ? '#fbbf24' : 'none',
            }}
          />
        ))}
      </div>
    )
  }

  // ── Format Date ────────────────────────────────────────────
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Header */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <MessageSquare style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>Feedbacks</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              View and manage user feedbacks
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 1.5rem', paddingBottom: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: textSecondary }}>
            Loading feedbacks...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            {error}
          </div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: textSecondary }}>
            No feedbacks yet
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  transition: 'background 0.45s ease, border-color 0.45s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: textPrimary, fontSize: '0.9375rem' }}>
                        {feedback.full_name || feedback.username || 'Anonymous'}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        background: dark ? 'rgba(30,64,175,0.2)' : '#dbeafe',
                        color: dark ? '#93c5fd' : '#2563eb',
                      }}>
                        {feedback.user_type || 'User'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: textSecondary, margin: '0.25rem 0 0 0' }}>
                      {formatDate(feedback.created_at)}
                    </p>
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                
                {feedback.comment && (
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: textSecondary, 
                    margin: 0,
                    lineHeight: 1.6,
                    padding: '0.75rem',
                    background: dark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                    borderRadius: '0.5rem',
                  }}>
                    {feedback.comment}
                  </p>
                )}

                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDeleteClick(feedback.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                      color: '#ef4444',
                      border: `1px solid ${dark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.2)' : '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                  >
                    <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: textPrimary, margin: '0 0 0.5rem 0' }}>
              Delete Feedback
            </h3>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0 0 1.5rem 0' }}>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: textSecondary,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feedbacks