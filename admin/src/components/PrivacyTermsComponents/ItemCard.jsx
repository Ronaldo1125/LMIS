// C:\Users\Laptop\Desktop\LMIS\admin\src\components\PrivacyTermsComponents\ItemCard.jsx

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const ChevronUp = () => (
  <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const ChevronDown = () => (
  <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ItemCard = ({ item, index, total, onEdit, onDelete, onMove, dark, theme }) => {
  const { cardBg, border, textPrimary, textMuted, danger } = theme

  return (
    <div style={{
      background: dark ? '#0a1628' : '#f8fafc',
      border: `1px solid ${border}`,
      borderRadius: '0.5rem',
      padding: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: textPrimary, margin: 0 }}>
            {item.header}
          </h3>
          <p style={{
            color: textMuted,
            margin: '0.5rem 0 0',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '4.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {item.content}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
          <button
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            title="Move up"
            style={{
              padding: '0.375rem', borderRadius: '0.25rem', border: 'none',
              background: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer',
              color: textMuted, opacity: index === 0 ? 0.3 : 1,
            }}
          >
            <ChevronUp />
          </button>
          <button
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
            title="Move down"
            style={{
              padding: '0.375rem', borderRadius: '0.25rem', border: 'none',
              background: 'transparent', cursor: index === total - 1 ? 'not-allowed' : 'pointer',
              color: textMuted, opacity: index === total - 1 ? 0.3 : 1,
            }}
          >
            <ChevronDown />
          </button>
          <button
            onClick={() => onEdit(index)}
            title="Edit"
            style={{ padding: '0.375rem', borderRadius: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', color: textMuted }}
          >
            <PencilIcon style={{ width: '1rem', height: '1rem' }} />
          </button>
          <button
            onClick={() => onDelete(index)}
            title="Delete"
            style={{ padding: '0.375rem', borderRadius: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', color: danger }}
          >
            <TrashIcon style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
