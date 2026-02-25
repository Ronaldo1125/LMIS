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

const CollectionByCategory = ({ dark }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
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

      const categoriesResponse = await fetch('http://localhost:5000/api/books/meta/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
      const categoriesData = await categoriesResponse.json()

      const booksResponse = await fetch('http://localhost:5000/api/books?limit=999999&showArchived=false', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!booksResponse.ok) throw new Error('Failed to fetch books')
      const booksData = await booksResponse.json()
      const books = booksData.books || []

      const categoryCounts = {}
      const subcategoryCounts = {}
      let uncategorizedCount = 0

      books.forEach(book => {
        if (!book.category || book.category.trim() === '') {
          uncategorizedCount++
        } else {
          const categoryMatch = categoriesData.find(cat => 
            cat.id === book.category || cat.name === book.category
          )

          if (categoryMatch) {
            if (categoryMatch.parent_id) {
              const parentCategory = categoriesData.find(cat => cat.id === categoryMatch.parent_id)
              if (parentCategory) {
                categoryCounts[parentCategory.name] = (categoryCounts[parentCategory.name] || 0) + 1
                const subKey = `${parentCategory.name}::${categoryMatch.name}`
                subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1
              }
            } else {
              categoryCounts[categoryMatch.name] = (categoryCounts[categoryMatch.name] || 0) + 1
            }
          } else {
            categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1
          }
        }
      })

      const parentCategories = categoriesData.filter(cat => !cat.parent_id)
      const formattedCategories = parentCategories.map(parent => {
        const subcategories = categoriesData
          .filter(cat => cat.parent_id === parent.id)
          .map(sub => ({
            name: sub.name,
            count: subcategoryCounts[`${parent.name}::${sub.name}`] || 0
          }))
          .filter(sub => sub.count > 0)

        return {
          name: parent.name,
          icon: categoryIcons[parent.name] || BookOpenIcon,
          count: categoryCounts[parent.name] || 0,
          color: categoryColors[parent.name] || '#64748b',
          subcategories: subcategories.length > 0 ? subcategories : undefined
        }
      }).filter(cat => cat.count > 0)

      if (uncategorizedCount > 0) {
        formattedCategories.push({
          name: 'Uncategorized',
          icon: QuestionMarkCircleIcon,
          count: uncategorizedCount,
          color: '#94a3b8'
        })
      }

      formattedCategories.sort((a, b) => b.count - a.count)
      setCategories(formattedCategories)
    } catch (err) {
      console.error('Error fetching category data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalItems = categories.reduce((sum, cat) => sum + cat.count, 0)

  const openModal = () => {
    setIsModalOpen(true)
    setTimeout(() => setIsAnimating(true), 10)
  }

  const closeModal = () => {
    setIsAnimating(false)
    setTimeout(() => setIsModalOpen(false), 400)
  }

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  // ── Colors (Matching RecentAcquisitions) ───────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const cardBorder   = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#111827'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted     = dark ? '#2e4d70' : '#6b7280'
  const itemBg       = dark ? '#081422' : '#ffffff'
  const itemBorder   = dark ? '#1a3356' : '#e2e8f0'
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

  if (loading || error || categories.length === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
          Collection by Category
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: error ? (dark ? '#fca5a5' : '#ef4444') : textSecondary }}>
            {loading ? 'Loading categories...' : error ? `Error: ${error}` : 'No categories found'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue-1)', marginBottom: '1.5rem' }}>
        Collection by Category
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {categories.slice(0, 4).map((cat, index) => {
          const Icon = cat.icon
          const isHovered = hoveredCategory === index
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: isHovered ? (dark ? '#1a3356' : `${cat.color}15`) : itemBg,
                border: `1px solid ${itemBorder}`,
                borderLeft: `4px solid ${cat.color}`,
                cursor: 'pointer',
                transform: isHovered ? 'translateX(6px)' : 'translateX(0)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${cat.color}20` 
                  }}>
                    <Icon style={{ width: '1.25rem', height: '1.25rem', color: cat.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: 0 }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: textSecondary, margin: 0 }}>{cat.count.toLocaleString()} items</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: cat.color }}>
                  {cat.count}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={openModal}
        style={{
          marginTop: '1rem', padding: '0.625rem 1rem',
          borderRadius: '0.5rem',
          background: dark ? '#1a3356' : '#64748b',
          color: '#ffffff',
          border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: '0.875rem',
          transition: 'background 0.2s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = dark ? '#2e4d70' : '#475569' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = dark ? '#1a3356' : '#64748b' }}
      >
        View All Catalog ({totalItems.toLocaleString()} total items)
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              width: '100%', maxWidth: '28rem',
              maxHeight: '80vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(2rem)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem', borderBottom: `1px solid ${modalBorder}`,
              background: dark ? '#0d1d35' : '#ffffff', borderRadius: '1rem 1rem 0 0'
            }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--dark-blue-1)', margin: 0 }}>All Categories</h2>
                <p style={{ fontSize: '0.75rem', color: textMuted, margin: '0.125rem 0 0' }}>
                  {totalItems.toLocaleString()} items in {categories.length} categories
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: '0.5rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = closeHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XMarkIcon style={{ width: '1.25rem', height: '1.25rem', color: textSecondary }} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categories.map((cat) => {
                const Icon = cat.icon
                const isExpanded = expandedCategories[cat.name]
                const hasSub = cat.subcategories && cat.subcategories.length > 0

                return (
                  <div key={cat.name} style={{ border: `1px solid ${itemBorder}`, borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <button
                      onClick={() => hasSub && toggleCategory(cat.name)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem', background: 'transparent', border: 'none', cursor: hasSub ? 'pointer' : 'default',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat.color}20` }}>
                          <Icon style={{ width: '1.125rem', height: '1.125rem', color: cat.color }} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, display: 'block' }}>{cat.name}</span>
                          <span style={{ fontSize: '0.75rem', color: textSecondary }}>{cat.count.toLocaleString()} items</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: cat.color, background: `${cat.color}15` }}>
                          {cat.count}
                        </span>
                        {hasSub && (isExpanded ? <ChevronUpIcon style={{width:'1rem', color:textMuted}}/> : <ChevronDownIcon style={{width:'1rem', color:textMuted}}/>)}
                      </div>
                    </button>

                    {hasSub && isExpanded && (
                      <div style={{ padding: '0 1rem 0.75rem 3.5rem', background: dark ? 'rgba(255,255,255,0.02)' : '#f9fafb', borderTop: `1px solid ${itemBorder}` }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
                          {cat.subcategories.map((sub) => (
                            <li key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.8125rem', color: textSecondary }}>
                              <span>{sub.name}</span>
                              <span style={{ fontWeight: 500, color: textMuted }}>{sub.count}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem', borderTop: `1px solid ${modalBorder}`, display: 'flex', justifyContent: 'flex-end', background: dark ? '#0d1d35' : '#ffffff', borderRadius: '0 0 1rem 1rem' }}>
              <button
                onClick={closeModal}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: 'var(--dark-blue-1)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
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