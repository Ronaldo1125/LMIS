import React from 'react';

const SortControls = ({ sortBy, sortOrder, onSortChange, dark }) => {
  const containerBg  = dark ? '#0f1f38' : '#ffffff'
  const containerBorder = dark ? '#1a3356' : '#e2e8f0'
  const labelColor   = dark ? '#6b8cae' : '#475569'
  const inactiveText = dark ? '#6b8cae' : '#64748b'
  const inactiveHoverBg   = dark ? '#1a3356' : '#f1f5f9'
  const inactiveHoverText = dark ? '#93c5fd' : '#0F61F7'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.5rem 1rem',
        background: containerBg,
        border: `2px solid ${containerBorder}`,
        borderRadius: '0.5rem',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#0F61F7'}
      onMouseLeave={e => e.currentTarget.style.borderColor = containerBorder}
    >
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: labelColor, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
        Sort by:
      </span>

      {/* Alphabetical */}
      <SortButton
        label="A-Z"
        active={sortBy === 'alphabetical'}
        sortOrder={sortOrder}
        onClick={() => onSortChange('alphabetical')}
        inactiveText={inactiveText}
        inactiveHoverBg={inactiveHoverBg}
        inactiveHoverText={inactiveHoverText}
      />

      {/* Date */}
      <SortButton
        label="Date"
        active={sortBy === 'date'}
        sortOrder={sortOrder}
        onClick={() => onSortChange('date')}
        inactiveText={inactiveText}
        inactiveHoverBg={inactiveHoverBg}
        inactiveHoverText={inactiveHoverText}
      />
    </div>
  )
}

const SortButton = ({ label, active, sortOrder, onClick, inactiveText, inactiveHoverBg, inactiveHoverText }) => {
  const [hovered, setHovered] = React.useState(false)

  const bg    = active ? '#154A9A' : hovered ? inactiveHoverBg : 'transparent'
  const color = active ? '#ffffff' : hovered ? inactiveHoverText : inactiveText

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.375rem 1rem',
        background: bg,
        color: color,
        border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: 600,
        boxShadow: active ? '0 2px 8px rgba(21,74,154,0.4)' : 'none',
        transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <span>{label}</span>
      {active && (
        <svg
          width="16" height="16"
          viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M8 3L12 7H4L8 3Z" fill="currentColor" />
          <path d="M8 13L4 9H12L8 13Z" fill="currentColor" opacity="0.3" />
        </svg>
      )}
    </button>
  )
}

export default SortControls;