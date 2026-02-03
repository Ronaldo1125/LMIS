import { useState } from 'react'
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  NewspaperIcon, 
  ArchiveBoxIcon, 
  AcademicCapIcon, 
  ScaleIcon, 
  BookmarkIcon 
} from '@heroicons/react/24/outline'

const CollectionByCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const categories = [
    { name: 'Books', icon: BookOpenIcon, count: 1247, color: 'var(--dark-blue-1)' },
    { name: 'Reports', icon: DocumentTextIcon, count: 389, color: '#64748b' },
    { name: 'Periodicals', icon: NewspaperIcon, count: 542, color: 'var(--secondary-1-medium)' },
    { name: 'Annuals', icon: NewspaperIcon, count: 834, color: 'var(--secondary-3-medium)' }
  ]
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .category-card {
          animation: slideInLeft 0.6s ease-out forwards;
          animation-delay: calc(var(--index) * 0.08s);
          opacity: 0;
        }
      `}</style>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
          Collection by Category
        </h2>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent opacity-30" />
      </div>

      <div className="space-y-3 flex-grow">
        {categories.map((category, index) => {
          const Icon = category.icon
          const isHovered = hoveredCategory === index
          
          return (
            <div
              key={category.name}
              className="category-card"
              style={{
                '--index': index,
                background: isHovered 
                  ? `linear-gradient(135deg, ${category.color}15, ${category.color}25)`
                  : '#ffffff',
                borderLeft: `4px solid ${category.color}`,
                padding: '1rem',
                borderRadius: '0 8px 8px 0',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                boxShadow: isHovered 
                  ? '0 8px 24px rgba(0,0,0,0.12)' 
                  : '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `${category.color}20`
                    }}
                  >
                    <Icon 
                      className="w-5 h-5 transition-transform duration-300"
                      style={{ 
                        color: category.color,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }} 
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {category.count.toLocaleString()} items
                    </p>
                  </div>
                </div>
                <div 
                  className="text-xl font-bold opacity-80"
                  style={{ color: category.color }}
                >
                  {category.count}
                </div>
              </div>
            </div>
          )
        })}
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
          View All Categories
        </button>
      </div>
    </div>
  )
}

export default CollectionByCategory