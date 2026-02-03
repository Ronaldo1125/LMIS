import { SparklesIcon } from '@heroicons/react/24/outline'

const RecentAcquisitions = () => {
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
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .acquisition-item {
          animation: slideInRight 0.6s ease-out forwards;
          animation-delay: calc(var(--index) * 0.1s + 0.2s);
          opacity: 0;
        }
      `}</style>

      <div className="flex items-center gap-3 mb-6">
        <SparklesIcon className="w-5 h-5" style={{ color: 'var(--secondary-1-medium)' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
          Recent Acquisitions
        </h2>
      </div>

      <div className="space-y-4 flex-grow">
        {recentAcquisitions.map((item, index) => (
          <div
            key={index}
            className="acquisition-item bg-white p-4 rounded-lg border border-gray-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
            style={{
              '--index': index
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)'
              e.currentTarget.style.borderColor = item.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div 
              className="absolute top-0 left-0 w-1 h-full"
              style={{ background: item.color }}
            />
            
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 italic">
                  by {item.author}
                </p>
              </div>
              <span 
                className="ml-3 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{
                  background: `${item.color}15`,
                  color: item.color
                }}
              >
                {item.type}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
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
        ))}
      </div>

      <div className="mt-3 text-center">
        <button 
          className="w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 shadow-sm text-sm"
          style={{
            background: '#64748b'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(71, 85, 105, 0.3)'
            e.currentTarget.style.background = '#475569'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(71, 85, 105, 0.2)'
            e.currentTarget.style.background = '#64748b'
          }}
        >
          View All Acquisitions
        </button>
      </div>
    </div>
  )
}

export default RecentAcquisitions