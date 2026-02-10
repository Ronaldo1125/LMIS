import { useState } from 'react'
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  NewspaperIcon, 
  ArchiveBoxIcon, 
  AcademicCapIcon, 
  ScaleIcon, 
  BookmarkIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

const CollectionByCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})

  const categories = [
    { name: 'Books', icon: BookOpenIcon, count: 1247, color: 'var(--dark-blue-1)' },
    { 
      name: 'Reports', 
      icon: DocumentTextIcon, 
      count: 389, 
      color: '#64748b',
      subcategories: [
        { name: 'Annual Reports', count: 120 },
        { name: 'Special Reports', count: 45 }
      ]
    },
    { 
      name: 'Periodicals', 
      icon: NewspaperIcon, 
      count: 542, 
      color: 'var(--secondary-1-medium)',
      subcategories: [
        { name: 'Magazines', count: 200 },
        { name: 'Newspapers', count: 180 },
        { name: 'Journals', count: 162 }
      ]
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
      subcategories: [
        { name: 'Encyclopedia', count: 150 },
        { name: 'Atlas', count: 170 }
      ]
    }
  ]

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
        Collection by Category
      </h2>

      {/* Front view cards */}
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
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                All Categories
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Category List */}
            <div className="p-4 space-y-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isExpanded = expandedCategories[cat.name]
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0

                return (
                  <div key={cat.name} className="border rounded-lg">
                    <button
                      onClick={() => hasSubcategories && toggleCategory(cat.name)}
                      className="flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      {hasSubcategories && (
                        isExpanded ? (
                          <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </button>

                    {/* Subcategories with item counts */}
                    {hasSubcategories && isExpanded && (
                      <div className="px-6 pb-3 bg-gray-50 border-t">
                        <ul className="space-y-2 mt-2 text-sm text-gray-700">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.name} className="flex items-center justify-between">
                              <span>{sub.name}</span>
                              <span className="text-xs text-gray-500">{sub.count} items</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white"
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