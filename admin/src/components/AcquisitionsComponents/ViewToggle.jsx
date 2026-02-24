import { useState } from 'react';
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline';

const ViewToggle = ({ viewMode, onViewChange, dark }) => {
  const isGridActive = viewMode === 'grid';
  const isListActive = viewMode === 'list';

  const containerBg     = dark ? '#0f1f38' : '#ffffff'
  const containerBorder = dark ? '#1a3356' : '#cbd5e1'
  const hoverBg         = dark ? '#1a3356' : '#f1f5f9'
  const inactiveStroke  = dark ? '#93c5fd' : '#154A9A'

  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center',
        background: containerBg,
        border: `1px solid ${containerBorder}`,
        borderRadius: '0.5rem',
        padding: '0.25rem',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}
    >
      {/* Grid */}
      <ToggleButton
        onClick={() => onViewChange('grid')}
        active={isGridActive}
        label="Grid view"
        hoverBg={hoverBg}
        inactiveStroke={inactiveStroke}
      >
        <Squares2X2Icon
          style={{ width: '1.25rem', height: '1.25rem' }}
          stroke={isGridActive ? '#ffffff' : inactiveStroke}
          strokeWidth={2}
        />
      </ToggleButton>

      {/* List */}
      <ToggleButton
        onClick={() => onViewChange('list')}
        active={isListActive}
        label="List view"
        hoverBg={hoverBg}
        inactiveStroke={inactiveStroke}
      >
        <Bars3Icon
          style={{ width: '1.25rem', height: '1.25rem' }}
          stroke={isListActive ? '#ffffff' : inactiveStroke}
          strokeWidth={2}
        />
      </ToggleButton>
    </div>
  );
};

const ToggleButton = ({ onClick, active, label, hoverBg, children }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '2.5rem', height: '2.5rem',
        background: active ? '#154A9A' : hovered ? hoverBg : 'transparent',
        border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
        boxShadow: active ? '0 2px 8px rgba(21,74,154,0.4)' : 'none',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
        padding: 0, margin: 0,
      }}
    >
      {children}
    </button>
  )
}

export default ViewToggle;