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
import { XMarkIcon } from '@heroicons/react/24/outline'

const CollectionByCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    { name: 'Books', icon: BookOpenIcon, count: 1247, color: 'var(--dark-blue-1)' },
    { 
      name: 'Reports', 
      icon: DocumentTextIcon, 
      count: 389, 
      color: '#64748b',
      subcategories: ['Annual Reports', 'Special Reports']
    },
    { 
      name: 'Periodicals', 
      icon: NewspaperIcon, 
      count: 542, 
      color: 'var(--secondary-1-medium)',
      subcategories: ['Magazines', 'Newspapers', 'Journals']
    },
    { name: 'Sourcebook', icon: ArchiveBoxIcon, count: 210, color: 'var(--secondary-3-medium)' },
    { name: 'Thesis/Research papers', icon: AcademicCapIcon, count: 156, color: 'var(--dark-blue-1)' },
    { name: 'Statute/Law/Legal Documents', icon: ScaleIcon, count: 98, color: '#64748b' },
    { name: 'Guides/Manuals', icon: BookmarkIcon, count: 75, color: 'var(--secondary-1-medium)' },
    { 
      name: 'Reference Materials', 
      icon: BookOpenIcon, 
      count: 320, 
      color: 'var(--secondary-3-medium)',
      subcategories: ['Encyclopedia', 'Atlas']
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
        Collection by Category
      </h2>

      {/* Front view cards (summary only) */}
      <div className="space-y-3 flex-grow">
        {categories.slice(0,4).map((cat, index) => {
          const Icon = cat.icon
          const isHovered = hoveredCategory === index
          return (
            <div
              key={cat.name}
              className="p-4 rounded-lg shadow-sm cursor-pointer transition-all"
              style={{
                background: isHovered ? `${cat.color}15` : '#fff',
                borderLeft: `4px solid ${cat.color}`,
                transform: isHovered ? 'translateX(6px)' : 'translateX(0)'
              }}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-600">{cat.count.toLocaleString()} items</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: cat.color }}>
                  {cat.count}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Button */}
      <div className="mt-4">
        <button 
          className="w-full px-4 py-2.5 rounded-lg text-white font-semibold shadow-sm text-sm"
          style={{ background: '#64748b' }}
          onClick={() => setIsModalOpen(true)}
        >
          View All Categories
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                All Categories
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Category Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <div key={cat.name} className="p-4 rounded-lg shadow-sm border flex flex-col gap-2"
                       style={{ borderColor: cat.color }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                        <span className="font-medium text-gray-800">{cat.name}</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded" 
                            style={{ background: `${cat.color}20`, color: cat.color }}>
                        {cat.count} items
                      </span>
                    </div>
                    {/* Subcategories */}
                    {cat.subcategories && (
                      <ul className="ml-6 list-disc text-xs text-gray-600 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <li key={sub}>{sub}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
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

export default CollectionByCategory