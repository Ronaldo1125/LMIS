// C:\Users\Laptop\Desktop\LMIS\admin\src\components\PrivacyTermsEditor.jsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShieldCheckIcon, CheckIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import api from '../utils/api'

import { SECTIONS, FONT_DISPLAY, FONT_BODY, getTheme } from './PrivacyTermsComponents/constants'
import SectionTabs from './PrivacyTermsComponents/SectionTabs'
import ItemList from './PrivacyTermsComponents/ItemList'

// ── Confirmation Modal ─────────────────────────────────────────────────────
const SaveConfirmModal = ({ onConfirm, onCancel, saving, dark, theme }) => {
  const { cardBg, border, textPrimary, textSecondary, textMuted, accent } = theme

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: '0.75rem',
        padding: '1.75rem',
        width: '100%',
        maxWidth: '26rem',
        boxShadow: dark
          ? '0 20px 60px rgba(0,0,0,0.6)'
          : '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.2s ease',
        fontFamily: FONT_BODY,
      }}>
        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{
            flexShrink: 0,
            padding: '0.5rem',
            background: 'rgba(5,150,105,0.1)',
            borderRadius: '0.5rem',
          }}>
            <CheckIcon style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              color: textPrimary,
              fontFamily: FONT_DISPLAY,
            }}>
              Save changes?
            </h3>
            <p style={{
              margin: '0.3rem 0 0',
              fontSize: '0.875rem',
              color: textSecondary,
              lineHeight: '1.5',
            }}>
              This will update the published content visible to your library's users. Are you sure you want to continue?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem' }}>
          <button
            onClick={onCancel}
            disabled={saving}
            style={{
              padding: '0.625rem 1.125rem',
              borderRadius: '0.5rem',
              border: `1px solid ${border}`,
              background: 'transparent',
              color: textSecondary,
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: FONT_BODY,
              transition: 'opacity 0.15s ease',
              opacity: saving ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: saving ? textMuted : accent,
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: FONT_BODY,
              transition: 'background 0.15s ease',
            }}
          >
            {saving ? (
              <>
                <ArrowPathIcon style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                Confirm Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Success Modal ──────────────────────────────────────────────────────────
const SuccessModal = ({ onClose, dark, theme }) => {
  const { cardBg, border, textPrimary, textSecondary, accent } = theme

  // Auto-close after 2.5 s
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: '0.75rem',
        padding: '2rem 2.25rem',
        width: '100%',
        maxWidth: '22rem',
        textAlign: 'center',
        boxShadow: dark
          ? '0 20px 60px rgba(0,0,0,0.6)'
          : '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.2s ease',
        fontFamily: FONT_BODY,
      }}>
        {/* Animated check circle */}
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'rgba(5,150,105,0.12)',
          border: '2px solid rgba(5,150,105,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <CheckIcon style={{ width: '1.75rem', height: '1.75rem', color: '#059669' }} />
        </div>

        <h3 style={{
          margin: '0 0 0.375rem',
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: textPrimary,
          fontFamily: FONT_DISPLAY,
        }}>
          Changes Saved
        </h3>
        <p style={{
          margin: '0 0 1.5rem',
          fontSize: '0.875rem',
          color: textSecondary,
          lineHeight: '1.5',
        }}>
          Your content has been updated successfully.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: accent,
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: FONT_BODY,
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
const PrivacyTermsEditor = ({ dark }) => {
  const theme = getTheme(dark)
  const {
    pageBg, headerBg, headerBorder, cardBg,
    border, textPrimary, textSecondary, textMuted,
    iconBoxBg, iconColor, accent, danger,
  } = theme

  const [activeSection, setActiveSection] = useState('privacy_policy')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => { fetchSectionData() }, [activeSection])

  const fetchSectionData = async () => {
    setLoading(true)
    setIsDirty(false)
    try {
      const response = await api.get(`/privacy-terms?section=${activeSection}`)
      if (response.data.success && response.data.data.length > 0) {
        setItems(response.data.data[0].items || [])
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error fetching privacy terms:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Opens the confirmation modal instead of saving immediately
  const handleSaveClick = () => {
    setErrorMessage(null)
    setShowConfirmModal(true)
  }

  // Called when user confirms inside the modal
  const handleConfirmSave = async () => {
    setSaving(true)
    try {
      const existingResponse = await api.get(`/privacy-terms?section=${activeSection}`)
      if (existingResponse.data.success && existingResponse.data.data.length > 0) {
        const existingId = existingResponse.data.data[0].id
        await api.put(`/privacy-terms/${existingId}`, { section: activeSection, items })
      } else {
        await api.post('/privacy-terms', { section: activeSection, items })
      }
      setIsDirty(false)
      setShowConfirmModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error saving privacy terms:', error)
      setShowConfirmModal(false)
      setErrorMessage('Failed to save changes. Please try again.')
      setTimeout(() => setErrorMessage(null), 4000)
    } finally {
      setSaving(false)
    }
  }

  // ── Item handlers ──────────────────────────────────────────────────────────
  const handleAddItem    = () => { setEditingItem({ header: '', content: '', tempId: Date.now() }); setIsAddingNew(true) }
  const handleEditItem   = (index) => { setEditingItem({ ...items[index], index }); setIsAddingNew(false) }
  const handleDeleteItem = (index) => { setItems(items.filter((_, i) => i !== index)); setIsDirty(true) }
  const handleCancelEdit = () => setEditingItem(null)

  const handleSaveItem = () => {
    if (!editingItem.header.trim() || !editingItem.content.trim()) return
    if (isAddingNew) {
      setItems([...items, { header: editingItem.header, content: editingItem.content }])
    } else {
      const next = [...items]
      next[editingItem.index] = { header: editingItem.header, content: editingItem.content }
      setItems(next)
    }
    setIsDirty(true)
    setEditingItem(null)
  }

  const handleMoveItem = (index, direction) => {
    const next = [...items]
    if (direction === 'up' && index > 0)
      [next[index], next[index - 1]] = [next[index - 1], next[index]]
    else if (direction === 'down' && index < next.length - 1)
      [next[index], next[index + 1]] = [next[index + 1], next[index]]
    setItems(next)
    setIsDirty(true)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Modals */}
      {showConfirmModal && (
        <SaveConfirmModal
          onConfirm={handleConfirmSave}
          onCancel={() => !saving && setShowConfirmModal(false)}
          saving={saving}
          dark={dark}
          theme={theme}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          dark={dark}
          theme={theme}
        />
      )}

      <div style={{
        minHeight: '100vh',
        background: pageBg,
        fontFamily: FONT_BODY,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transition: 'background 0.45s ease',
      }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
              <ShieldCheckIcon style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease', fontFamily: FONT_DISPLAY }}>
                Privacy & Terms Editor
              </h1>
              <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease', fontFamily: FONT_BODY }}>
                Manage your library's privacy policy and terms of service content
              </p>
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="px-6">

          {/* Tabs */}
          <SectionTabs
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            dark={dark}
            theme={theme}
          />

          {/* Error message (save failures only) */}
          {errorMessage && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: danger,
              fontSize: '0.875rem', fontFamily: FONT_BODY,
            }}>
              {errorMessage}
            </div>
          )}

          {/* Card */}
          <div style={{
            background: cardBg, borderRadius: '0.75rem', padding: '1.5rem',
            border: `1px solid ${border}`,
            boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'background 0.45s ease',
          }}>
            {/* Section label */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: textPrimary, margin: 0, fontFamily: FONT_DISPLAY }}>
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
              <p style={{ color: textMuted, margin: '0.25rem 0 0', fontSize: '0.875rem', fontFamily: FONT_BODY }}>
                {SECTIONS.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {/* Loading */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
                <ArrowPathIcon style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '0.5rem', fontFamily: FONT_BODY }}>Loading content...</p>
              </div>
            ) : (
              <ItemList
                items={items}
                editingItem={editingItem}
                isAddingNew={isAddingNew}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onMoveItem={handleMoveItem}
                onEditChange={setEditingItem}
                onSaveItem={handleSaveItem}
                onCancelEdit={handleCancelEdit}
                dark={dark}
                theme={theme}
              />
            )}
          </div>

          {/* Bottom spacer so content isn't hidden behind the floating button */}
          <div style={{ height: '5rem' }} />
        </div>
      </div>

      {/* ── Floating Save Button ──────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        opacity: isDirty ? 1 : 0,
        transform: isDirty ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)',
        pointerEvents: isDirty ? 'auto' : 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>
        <span style={{
          fontSize: '0.78rem',
          color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.38)',
          fontFamily: FONT_BODY,
          background: dark ? 'rgba(20,20,20,0.7)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '0.3rem 0.7rem',
          borderRadius: '999px',
          border: `1px solid ${border}`,
          whiteSpace: 'nowrap',
        }}>
          Unsaved changes
        </span>
        <button
          onClick={handleSaveClick}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            background: accent,
            cursor: saving ? 'not-allowed' : 'pointer',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: FONT_BODY,
            boxShadow: dark
              ? '0 4px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.08)',
            transition: 'background 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {saving ? (
            <>
              <ArrowPathIcon style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon style={{ width: '1rem', height: '1rem' }} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; }             to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn   { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </>
  )
}

export default PrivacyTermsEditor