import { useState, useEffect } from 'react'
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  NewspaperIcon, 
  ArchiveBoxIcon, 
  AcademicCapIcon, 
  ScaleIcon, 
  BookmarkIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

const CollectionByCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Icon mapping for categories
  const categoryIcons = {
    'Books': BookOpenIcon,
    'Reports': DocumentTextIcon,
    'Periodicals': NewspaperIcon,
    'Sourcebook': ArchiveBoxIcon,
    'Thesis/Research papers': AcademicCapIcon,
    'Statute/Law/Legal Documents': ScaleIcon,
    'Guides/Manuals': BookmarkIcon,
    'Reference Materials': BookOpenIcon,
    'Uncategorized': QuestionMarkCircleIcon
  }

  // Color mapping for categories
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

  useEffect(() => {
    fetchCategoryData()
  }, [])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all categories from backend
      const categoriesResponse = await fetch('http://localhost:5000/api/books/meta/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories')
      }

      const categoriesData = await categoriesResponse.json()

      // Fetch all books to count by category
      const booksResponse = await fetch('http://localhost:5000/api/books?limit=999999&showArchived=false', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!booksResponse.ok) {
        throw new Error('Failed to fetch books')
      }

      const booksData = await booksResponse.json()
      const books = booksData.books || []

      // Count books by category and subcategory
      const categoryCounts = {}
      const subcategoryCounts = {}
      let uncategorizedCount = 0

      books.forEach(book => {
        if (!book.category || book.category.trim() === '') {
          uncategorizedCount++
        } else {
          // Find the category in the hierarchical structure
          const categoryMatch = categoriesData.find(cat => 
            cat.id === book.category || cat.name === book.category
          )

          if (categoryMatch) {
            if (categoryMatch.parent_id) {
              // It's a subcategory
              const parentCategory = categoriesData.find(cat => cat.id === categoryMatch.parent_id)
              if (parentCategory) {
                categoryCounts[parentCategory.name] = (categoryCounts[parentCategory.name] || 0) + 1
                const subKey = `${parentCategory.name}::${categoryMatch.name}`
                subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1
              }
            } else {
              // It's a parent category
              categoryCounts[categoryMatch.name] = (categoryCounts[categoryMatch.name] || 0) + 1
            }
          } else {
            // Category not found in database, count as the category name directly
            categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1
          }
        }
      })

      // Build category hierarchy with counts
      const parentCategories = categoriesData.filter(cat => !cat.parent_id)
      const formattedCategories = parentCategories.map(parent => {
        const subcategories = categoriesData
          .filter(cat => cat.parent_id === parent.id)
          .map(sub => ({
            name: sub.name,
            count: subcategoryCounts[`${parent.name}::${sub.name}`] || 0
          }))
          .filter(sub => sub.count > 0) // Only show subcategories with items

        return {
          name: parent.name,
          icon: categoryIcons[parent.name] || BookOpenIcon,
          count: categoryCounts[parent.name] || 0,
          color: categoryColors[parent.name] || '#64748b',
          subcategories: subcategories.length > 0 ? subcategories : undefined
        }
      }).filter(cat => cat.count > 0) // Only show categories with items

      // Add uncategorized if there are any
      if (uncategorizedCount > 0) {
        formattedCategories.push({
          name: 'Uncategorized',
          icon: QuestionMarkCircleIcon,
          count: uncategorizedCount,
          color: '#94a3b8'
        })
      }

      // Sort by count (descending)
      formattedCategories.sort((a, b) => b.count - a.count)

      setCategories(formattedCategories)
    } catch (err) {
      console.error('Error fetching category data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total items across all categories
  const totalItems = categories.reduce((sum, cat) => sum + cat.count, 0)

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Collection by Category
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-gray-500">Loading categories...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Collection by Category
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
          Collection by Category
        </h2>
        <div className="flex items-center justify-center flex-grow">
          <div className="text-gray-500">No categories found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark-blue-1)' }}>
        Collection by Category
      </h2>

      {/* Front view cards */}
      <div className="space-y-3 flex-grow">
        {categories.slice(0, 4).map((cat, index) => {
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
          View All Catalog ({totalItems.toLocaleString()} total items)
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
            <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--dark-blue-1)' }}>
                    All Categories
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {totalItems.toLocaleString()} total items across {categories.length} categories
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="p-4 space-y-3">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isExpanded = expandedCategories[cat.name]
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0

                return (
                  <div key={cat.name} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => hasSubcategories && toggleCategory(cat.name)}
                      className="flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}20` }}>
                          <Icon className="w-5 h-5" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900 block">{cat.name}</span>
                          <span className="text-xs text-gray-500">{cat.count.toLocaleString()} items</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold px-2 py-1 rounded" style={{ color: cat.color, background: `${cat.color}15` }}>
                          {cat.count}
                        </span>
                        {hasSubcategories && (
                          isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                          )
                        )}
                      </div>
                    </button>

                    {/* Subcategories with item counts */}
                    {hasSubcategories && isExpanded && (
                      <div className="px-6 pb-3 bg-gray-50 border-t">
                        <ul className="space-y-2 mt-2 text-sm text-gray-700">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.name} className="flex items-center justify-between py-1">
                              <span className="text-gray-700">{sub.name}</span>
                              <span className="text-xs text-gray-500 font-medium">{sub.count} items</span>
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