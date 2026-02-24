import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const RecentAcquisitions = () => {
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
        color: categoryColors[item.category] || '#94a3b8',
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Recent Acquisitions
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-gray-500">Loading acquisitions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Recent Acquisitions
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (acquisitions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Recent Acquisitions
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-gray-500">No recent acquisitions found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full relative">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
        Recent Acquisitions
      </h2>

      {/* Preview — EXACTLY SAME (NO IMAGE, NO SIZE CHANGE) */}
      <div className="space-y-4 flex-grow">
        {acquisitions.slice(0, 4).map((item, index) => (
          <div key={item.id || index} className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-xs text-gray-600 italic">
              by {item.author}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={openModal}
        className="mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ background: '#64748b' }}
      >
        View More ({acquisitions.length} total)
      </button>

      {/* Modal — SAME SIZE */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-400 ${
            isAnimating ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col
            transform transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              isAnimating
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-50 opacity-0 translate-y-10'
            }`}
            style={{ transformOrigin: 'bottom center' }}
          >

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                  Recent Acquisitions
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {acquisitions.length} items acquired in the last 14 days
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {acquisitions.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-4 rounded-lg border flex gap-4"
                  style={{ borderColor: item.color }}
                >
                  {/* Image Placeholder — ONLY IN MODAL */}
                  <div className="w-20 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                    Image
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 italic">
                          by {item.author}
                        </p>
                      </div>

                      <span
                        className="px-2 py-1 text-xs font-semibold rounded uppercase"
                        style={{
                          background: `${item.color}20`,
                          color: item.color
                        }}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-xs text-gray-500">
                        {item.category}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: item.color }}
                      >
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--dark-blue-1)' }}
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