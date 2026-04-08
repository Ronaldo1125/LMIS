import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  BookOpenIcon, DocumentTextIcon, NewspaperIcon, ArchiveBoxIcon,
  AcademicCapIcon, ScaleIcon, BookmarkIcon, QuestionMarkCircleIcon,
  XMarkIcon, ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL

const FONT_HEADING = "'Sora', -apple-system, sans-serif"
const FONT_BODY    = "'DM Sans', -apple-system, 'Segoe UI', sans-serif"

const categoryIcons = {
  'Books': BookOpenIcon, 'Reports': DocumentTextIcon, 'Periodicals': NewspaperIcon,
  'Sourcebook': ArchiveBoxIcon, 'Thesis/Research papers': AcademicCapIcon,
  'Statute/Law/Legal Documents': ScaleIcon, 'Guides/Manuals': BookmarkIcon,
  'Reference Materials': BookOpenIcon, 'Uncategorized': QuestionMarkCircleIcon
}

const categoryColors = {
  'Books': '#2563eb', 'Reports': '#64748b', 'Periodicals': '#7c3aed',
  'Sourcebook': '#f59e0b', 'Thesis/Research papers': '#0891b2',
  'Statute/Law/Legal Documents': '#374151', 'Guides/Manuals': '#059669',
  'Reference Materials': '#dc2626', 'Uncategorized': '#94a3b8'
}

const CollectionByCategory = ({ dark }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchCategoryData() }, [])

  const fetchCategoryData = async () => {
    try {
      setLoading(true); setError(null)
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      const [catRes, bookRes] = await Promise.all([
        fetch(`${API_URL}/books/meta/categories`, { headers }),
        fetch(`${API_URL}/books?limit=999999&showArchived=false`, { headers }),
      ])
      if (!catRes.ok || !bookRes.ok) throw new Error('Failed to fetch data')
      const categoriesData = await catRes.json()
      const booksData = await bookRes.json()
      const books = booksData.books || []

      const categoryCounts = {}, subcategoryCounts = {}
      let uncategorizedCount = 0
      books.forEach(book => {
        if (!book.category || book.category.trim() === '') { uncategorizedCount++ } else {
          const match = categoriesData.find(c => c.id === book.category || c.name === book.category)
          if (match) {
            if (match.parent_id) {
              const parent = categoriesData.find(c => c.id === match.parent_id)
              if (parent) {
                categoryCounts[parent.name] = (categoryCounts[parent.name] || 0) + 1
                const key = `${parent.name}::${match.name}`
                subcategoryCounts[key] = (subcategoryCounts[key] || 0) + 1
              }
            } else { categoryCounts[match.name] = (categoryCounts[match.name] || 0) + 1 }
          } else { categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1 }
        }
      })

      const parents = categoriesData.filter(c => !c.parent_id)
      const formatted = parents.map(parent => ({
        name: parent.name,
        icon: categoryIcons[parent.name] || BookOpenIcon,
        count: categoryCounts[parent.name] || 0,
        color: categoryColors[parent.name] || '#64748b',
        subcategories: categoriesData.filter(c => c.parent_id === parent.id)
          .map(sub => ({ name: sub.name, count: subcategoryCounts[`${parent.name}::${sub.name}`] || 0 }))
          .filter(s => s.count > 0)
      })).filter(c => c.count > 0).sort((a, b) => b.count - a.count)

      if (uncategorizedCount > 0) formatted.push({ name: 'Uncategorized', icon: QuestionMarkCircleIcon, count: uncategorizedCount, color: '#94a3b8' })
      setCategories(formatted)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const totalItems = categories.reduce((s, c) => s + c.count, 0)
  const openModal  = () => { setIsModalOpen(true); setTimeout(() => setIsAnimating(true), 10) }
  const closeModal = () => { setIsAnimating(false); setTimeout(() => setIsModalOpen(false), 380) }
  const toggleCat  = name => setExpandedCategories(p => ({ ...p, [name]: !p[name] }))

  // ── Tokens ──────────────────────────────────────────────────────────────
  const bg       = dark ? '#0c1c34' : '#ffffff'
  const bdr      = dark ? '#1a3356' : '#e8edf5'
  const txt1     = dark ? '#e2ecf8' : '#0f172a'
  const txt2     = dark ? '#6b8cae' : '#64748b'
  const txt3     = dark ? '#2e4d70' : '#94a3b8'
  const surface  = dark ? '#07111f' : '#f8fafc'
  
  const cardStyle = {
    background: bg, border: `1px solid ${bdr}`,
    borderRadius: 12,
    boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)',
    padding: '20px 22px', display: 'flex', flexDirection: 'column', height: '100%',
    transition: 'background 0.35s ease, border-color 0.35s ease',
    fontFamily: FONT_BODY,
  }

  const SectionHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: dark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.09)',
          border: `1px solid ${dark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.14)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BookOpenIcon style={{ width: '0.95rem', height: '0.95rem', color: dark ? '#60a5fa' : '#2563eb' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#334155', margin: 0, letterSpacing: '-0.02em', fontFamily: FONT_HEADING }}>
            Collection by Category
          </h2>
          <p style={{ fontSize: 11, color: txt2, margin: 0 }}>
            {totalItems > 0 ? `${totalItems.toLocaleString()} items across ${categories.length} categories` : 'Browse the collection'}
          </p>
        </div>
      </div>
    </div>
  )

  if (loading || error || categories.length === 0) return (
    <div style={cardStyle}>
      <SectionHeader />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 120 }}>
        <span style={{ color: error ? '#f87171' : txt2, fontSize: 13 }}>
          {loading ? 'Loading categories…' : error ? `Error: ${error}` : 'No categories found'}
        </span>
      </div>
    </div>
  )

  return (
    <div style={cardStyle}>
      <SectionHeader />

      {/* Category rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {categories.slice(0, 4).map((cat, i) => {
          const Icon = cat.icon
          const isHov = hoveredIndex === i
          const pct = totalItems > 0 ? Math.round((cat.count / totalItems) * 100) : 0
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: '11px 13px', borderRadius: 9,
                background: isHov ? (dark ? '#0f1e36' : `${cat.color}08`) : surface,
                border: `1px solid ${isHov ? cat.color + '45' : bdr}`,
                borderLeft: `3px solid ${cat.color}`,
                transform: isHov ? 'translateX(5px)' : 'translateX(0)',
                transition: 'all 0.25s ease', cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: `${cat.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: '0.9rem', height: '0.9rem', color: cat.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: txt1, margin: 0, fontFamily: FONT_HEADING }}>
                      {cat.name}
                    </p>
                    <p style={{ fontSize: 11, color: txt2, margin: 0 }}>{cat.count.toLocaleString()} items</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Mini progress bar */}
                  <div style={{ width: 48, height: 4, borderRadius: 99, background: dark ? '#1a3356' : '#e8edf5', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: 99, transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 800, color: cat.color,
                    minWidth: 32, textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"',
                    fontFamily: FONT_BODY, display: 'inline-block',
                  }}>
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={openModal}
        style={{
          marginTop: 14, padding: '9px 14px', borderRadius: 9,
          background: dark ? '#1a3356' : '#2563eb',
          color: '#ffffff', border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 13, width: '100%',
          transition: 'opacity 0.2s ease', fontFamily: FONT_BODY,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        View All Catalog ({totalItems.toLocaleString()} items)
      </button>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
            transition: 'background 0.38s ease',
          }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#0c1c34' : '#ffffff', border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              borderRadius: 16,
              boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.14)',
              width: '100%', maxWidth: '28rem', maxHeight: '82vh',
              display: 'flex', flexDirection: 'column',
              transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(16px)',
              opacity: isAnimating ? 1 : 0,
              transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: FONT_BODY,
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', borderBottom: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`,
              background: dark ? '#07111f' : '#f8fafc', borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#e2ecf8' : '#0f172a', margin: 0, fontFamily: FONT_HEADING }}>All Categories</h2>
                <p style={{ fontSize: 11, color: dark ? '#6b8cae' : '#64748b', margin: '2px 0 0' }}>
                  {totalItems.toLocaleString()} items in {categories.length} categories
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XMarkIcon style={{ width: '1.1rem', height: '1.1rem', color: txt2 }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, borderRadius: '0 0 16px 16px' }}>
              {categories.map(cat => {
                const Icon = cat.icon
                const isExpanded = expandedCategories[cat.name]
                const hasSub = cat.subcategories && cat.subcategories.length > 0
                return (
                  <div key={cat.name} style={{ border: `1px solid ${dark ? '#1a3356' : '#e8edf5'}`, borderRadius: 9, overflow: 'hidden' }}>
                    <button
                      onClick={() => hasSub && toggleCat(cat.name)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 13px', background: 'transparent', border: 'none',
                        cursor: hasSub ? 'pointer' : 'default', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (hasSub) e.currentTarget.style.background = dark ? '#0f1e36' : '#f8fafc' }}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon style={{ width: '0.875rem', height: '0.875rem', color: cat.color }} />
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: dark ? '#e2ecf8' : '#0f172a', display: 'block', fontFamily: FONT_HEADING }}>{cat.name}</span>
                          <span style={{ fontSize: 11, color: dark ? '#6b8cae' : '#64748b' }}>{cat.count.toLocaleString()} items</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 52, justifyContent: 'flex-end' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: cat.color, background: `${cat.color}15`,
                          fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"',
                          width: 28, height: 24, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>{cat.count}</span>
                        <div style={{ width: '0.875rem', flexShrink: 0 }}>
                          {hasSub && (isExpanded
                            ? <ChevronUpIcon style={{ width: '0.875rem', color: '#94a3b8' }} />
                            : <ChevronDownIcon style={{ width: '0.875rem', color: '#94a3b8' }} />
                          )}
                        </div>
                      </div>
                    </button>
                    {hasSub && isExpanded && (
                      <div style={{ padding: '0 14px 10px 52px', background: dark ? '#07111f' : '#f9fafb', borderTop: `1px solid ${dark ? '#1a3356' : '#e8edf5'}` }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
                          {cat.subcategories.map(sub => (
                            <li key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12, color: txt2 }}>
                              <span>{sub.name}</span>
                              <span style={{ fontWeight: 600, color: txt3, fontVariantNumeric: 'tabular-nums' }}>{sub.count}</span>
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
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default CollectionByCategory