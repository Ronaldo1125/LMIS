// C:\Users\Laptop\Desktop\LMIS\admin\src\components\PrivacyTermsComponents\ItemList.jsx

import { useRef, useEffect } from 'react'
import { ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline'
import ItemCard from './ItemCard'
import EditForm from './EditForm'
import { FONT_BODY } from './constants'

const ItemList = ({
  items, editingItem, isAddingNew,
  onAddItem, onEditItem, onDeleteItem, onMoveItem,
  onEditChange, onSaveItem, onCancelEdit,
  dark, theme,
}) => {
  const { border, textMuted, accent } = theme
  const editFormRef = useRef(null)

  // Scroll to edit form whenever it opens (edit or add)
  useEffect(() => {
    if (editingItem && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingItem])

  return (
    <>
      {/* Empty state */}
      {items.length === 0 && !editingItem ? (
        <div style={{
          textAlign: 'center', padding: '3rem', color: textMuted,
          background: dark ? 'rgba(21,74,154,0.05)' : '#f8fafc',
          borderRadius: '0.5rem', border: `1px dashed ${border}`,
        }}>
          <ShieldCheckIcon style={{ width: '3rem', height: '3rem', opacity: 0.5, margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', fontFamily: FONT_BODY }}>
            No content yet. Add your first section.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item, index) => (
            <ItemCard
              key={index}
              item={item}
              index={index}
              total={items.length}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onMove={onMoveItem}
              dark={dark}
              theme={theme}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      {!editingItem && (
        <button
          onClick={onAddItem}
          style={{
            marginTop: '1rem', padding: '0.625rem 1rem',
            borderRadius: '0.5rem', border: `1px dashed ${border}`,
            background: 'transparent', cursor: 'pointer', color: textMuted,
            fontSize: '0.875rem', fontFamily: FONT_BODY,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', width: '100%', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted }}
        >
          <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          Add New Section
        </button>
      )}

      {/* Edit / Add form */}
      {editingItem && (
        <div ref={editFormRef} style={{ scrollMarginTop: '1rem' }}>
          <EditForm
            editingItem={editingItem}
            isAddingNew={isAddingNew}
            onChange={onEditChange}
            onSave={onSaveItem}
            onCancel={onCancelEdit}
            theme={theme}
          />
        </div>
      )}
    </>
  )
}

export default ItemList