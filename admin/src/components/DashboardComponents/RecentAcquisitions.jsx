import { useState } from 'react'
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'

const RecentAcquisitions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const recentAcquisitions = [
    {
      title: 'Digital Transformation in Public Libraries',
      type: 'Book',
      author: 'Dr. Maria Santos',
      date: '2026-01-28',
      category: 'Books',
      color: 'var(--dark-blue-1)'
    },
    {
      title: 'Annual Climate Report 2025',
      type: 'Report',
      author: 'Environmental Council',
      date: '2026-01-25',
      category: 'Reports',
      color: '#64748b'
    },
    {
      title: 'Journal of Information Science - Feb 2026',
      type: 'Periodical',
      author: 'Various Authors',
      date: '2026-01-22',
      category: 'Periodicals',
      color: 'var(--secondary-1-medium)'
    },
    {
      title: 'Atlas of Global History',
      type: 'Reference Material',
      author: 'World History Institute',
      date: '2026-01-20',
      category: 'Reference Materials',
      color: 'var(--secondary-3-medium)'
    },
    {
      title: 'Legal Statutes Compilation 2026',
      type: 'Law Document',
      author: 'National Law Commission',
      date: '2026-01-18',
      category: 'Statute/Law/Legal Documents',
      color: '#64748b'
    },
    {
      title: 'Research on Renewable Energy',
      type: 'Thesis',
      author: 'Engr. Juan Dela Cruz',
      date: '2026-01-15',
      category: 'Thesis/Research Papers',
      color: 'var(--dark-blue-1)'
    },
    {
      title: 'Library User Guide 2026',
      type: 'Manual',
      author: 'Library Staff',
      date: '2026-01-12',
      category: 'Guides/Manuals',
      color: 'var(--secondary-1-medium)'
    }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .acquisition-item {
          animation: slideInRight 0.6s ease-out forwards;
          animation-delay: calc(var(--index) * 0.1s + 0.2s);
          opacity: 0;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SparklesIcon className="w-5 h-5" style={{ color: 'var(--secondary-1-medium)' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
          Recent Acquisitions
        </h2>
      </div>

      {/* Front view: show only first 3 */}
      <div className="space-y-4 flex-grow">
        {recentAcquisitions.slice(0,3).map((item, index) => (
          <div
            key={index}
            className="acquisition-item bg-white p-4 rounded-lg border border-gray-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
            style={{ '--index': index }}
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: item.color }} />
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 italic">by {item.author}</p>
              </div>
              <span
                className="ml-3 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                {item.type}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">{item.category}</span>
              <span className="text-xs font-semibold" style={{ color: item.color }}>
                {formatDate(item.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-3 text-center">
        <button
          className="w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 shadow-sm text-sm"
          style={{ background: '#64748b' }}
          onClick={() => setIsModalOpen(true)}
        >
          View All Acquisitions
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                All Acquisitions
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Grid of acquisitions */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAcquisitions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow-sm border flex flex-col gap-2"
                  style={{ borderColor: item.color }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-600 italic">by {item.author}</p>
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded uppercase"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-xs text-gray-500">{item.category}</span>
                    <span className="text-xs font-semibold" style={{ color: item.color }}>
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
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