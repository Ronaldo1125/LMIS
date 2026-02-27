import { useState } from 'react'
import { XMarkIcon, LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const FormField = ({ label, required, children, colSpan, dark }) => (
  <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
    <label
      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
      style={{ color: dark ? '#2e4d70' : '#6b7280' }}
    >
      {label} {required && <span style={{ color: '#f87171' }}>*</span>}
    </label>
    {children}
  </div>
)

const EditAccessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  editAccession,
  setEditAccession,
  dark,
  onAccessLevelChange, // optional callback after access level update
}) => {
  const [accessLevelLoading, setAccessLevelLoading] = useState(false)
  const [accessLevelError,   setAccessLevelError]   = useState(null)
  const [accessLevelSuccess, setAccessLevelSuccess] = useState(false)

  if (!isOpen) return null

  const set = (field) => (e) =>
    setEditAccession({ ...editAccession, [field]: e.target.value })

  // ── PATCH access level immediately when toggled ─────────────────────────────
  const handleAccessLevelToggle = async (newLevel) => {
    if (newLevel === editAccession.access_level) return
    setAccessLevelLoading(true)
    setAccessLevelError(null)
    setAccessLevelSuccess(false)
    try {
      await axios.patch(
        `${API_BASE}/accessions/${editAccession.id}/access-level`,
        { access_level: newLevel },
        { headers: getAuthHeaders() }
      )
      setEditAccession({ ...editAccession, access_level: newLevel })
      setAccessLevelSuccess(true)
      setTimeout(() => setAccessLevelSuccess(false), 2500)
      onAccessLevelChange && onAccessLevelChange(editAccession.id, newLevel)
    } catch (err) {
      setAccessLevelError(err.response?.data?.message || 'Failed to update access level.')
    } finally {
      setAccessLevelLoading(false)
    }
  }

  // ── COLORS ────────────────────────────────────────────────
  const modalBg       = dark ? '#0f1f38' : '#ffffff'
  const headerBg      = dark ? '#0d1d35' : '#ffffff'
  const headerBorder  = dark ? '#1a3356' : '#e2e8f0'
  const border        = dark ? '#1a3356' : '#e5e7eb'
  const textPrimary   = dark ? '#dde8f5' : '#1f2937'
  const textSecondary = dark ? '#6b8cae' : '#6b7280'
  const inputBg       = dark ? '#081422' : '#ffffff'
  const inputBorder   = dark ? '#1a3356' : '#d1d5db'
  const readOnlyBg    = dark ? '#060f1c' : '#f8fafc'
  const readOnlyText  = dark ? '#2e4d70' : '#6b7280'

  const inputClass = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem', fontSize: '0.875rem',
    background: inputBg, color: textPrimary, outline: 'none',
  }

  const readOnlyInputClass = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${dark ? '#0f1f38' : '#e2e8f0'}`,
    borderRadius: '0.5rem', fontSize: '0.875rem',
    background: readOnlyBg, color: readOnlyText,
    cursor: 'not-allowed',
  }

  const currentLevel = editAccession.access_level || 'public'

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: modalBg,
          border: dark ? `1px solid ${headerBorder}` : 'none',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10"
          style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}` }}
        >
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Edit Accession
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <XMarkIcon className="w-6 h-6" style={{ color: textSecondary }} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Accession Info ─────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
              style={{ color: dark ? '#2e4d70' : '#9ca3af', borderBottom: `1px solid ${border}` }}
            >
              Accession Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Accession Number" required dark={dark}>
                <input type="text" required value={editAccession.accession_no} onChange={set('accession_no')} style={inputClass} />
              </FormField>
              <FormField label="Date Accessioned" required dark={dark}>
                <input type="date" required value={editAccession.date_accessioned} onChange={set('date_accessioned')} style={inputClass} />
              </FormField>
            </div>
          </div>

          {/* ── Access Level ───────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
              style={{ color: dark ? '#2e4d70' : '#9ca3af', borderBottom: `1px solid ${border}` }}
            >
              Access Level
            </h3>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                {
                  value: 'public',
                  label: 'Public',
                  desc: 'Visible to all users',
                  Icon: GlobeAltIcon,
                  activeBg:    dark ? 'rgba(34,197,94,0.15)' : '#f0fdf4',
                  activeBorder: dark ? '#16a34a' : '#86efac',
                  activeColor: dark ? '#86efac' : '#16a34a',
                },
                {
                  value: 'staff_only',
                  label: 'Staff Only',
                  desc: 'Hidden from public users',
                  Icon: LockClosedIcon,
                  activeBg:    dark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                  activeBorder: dark ? '#dc2626' : '#fca5a5',
                  activeColor: dark ? '#fca5a5' : '#dc2626',
                },
              ].map(({ value, label, desc, Icon, activeBg, activeBorder, activeColor }) => {
                const isActive = currentLevel === value
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={accessLevelLoading}
                    onClick={() => handleAccessLevelToggle(value)}
                    style={{
                      flex: 1, minWidth: '140px',
                      padding: '0.75rem 1rem',
                      border: `2px solid ${isActive ? activeBorder : (dark ? '#1a3356' : '#e2e8f0')}`,
                      borderRadius: '0.625rem',
                      background: isActive ? activeBg : 'transparent',
                      cursor: accessLevelLoading ? 'wait' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      opacity: accessLevelLoading ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <Icon style={{ width: '0.95rem', height: '0.95rem', color: isActive ? activeColor : (dark ? '#6b8cae' : '#9ca3af') }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isActive ? activeColor : (dark ? '#6b8cae' : '#6b7280') }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: dark ? '#2e4d70' : '#9ca3af', margin: 0 }}>
                      {desc}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {accessLevelLoading && (
              <p style={{ fontSize: '0.8rem', color: dark ? '#6b8cae' : '#64748b', marginTop: '0.5rem' }}>
                Updating access level…
              </p>
            )}
            {accessLevelSuccess && (
              <p style={{ fontSize: '0.8rem', color: dark ? '#86efac' : '#16a34a', marginTop: '0.5rem' }}>
                ✓ Access level updated successfully.
              </p>
            )}
            {accessLevelError && (
              <p style={{ fontSize: '0.8rem', color: dark ? '#fca5a5' : '#dc2626', marginTop: '0.5rem' }}>
                {accessLevelError}
              </p>
            )}

            <p style={{ fontSize: '0.75rem', color: dark ? '#2e4d70' : '#94a3b8', marginTop: '0.5rem' }}>
              Changing access level also updates the linked catalog book immediately.
            </p>
          </div>

          {/* ── Bibliographic (read-only) ───────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
              style={{ color: dark ? '#2e4d70' : '#9ca3af', borderBottom: `1px solid ${border}` }}
            >
              Bibliographic Details
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 400, color: dark ? '#93c5fd' : '#3b82f6', textTransform: 'none' }}>
                — from catalog (read-only)
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Title" required colSpan={2} dark={dark}>
                <input type="text" value={editAccession.title} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Author" dark={dark}>
                <input type="text" value={editAccession.author} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Editor" dark={dark}>
                <input type="text" value={editAccession.editor} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Edition" dark={dark}>
                <input type="text" value={editAccession.edition} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Publication" dark={dark}>
                <input type="text" value={editAccession.publication} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Publisher" dark={dark}>
                <input type="text" value={editAccession.publisher} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Date of Publication" dark={dark}>
                <input type="date" value={editAccession.date_of_publication} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Extent" dark={dark}>
                <input type="text" value={editAccession.extent} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Dimensions" dark={dark}>
                <input type="text" value={editAccession.dimensions} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="ISBN" dark={dark}>
                <input type="text" value={editAccession.isbn} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="ISSN" dark={dark}>
                <input type="text" value={editAccession.issn} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Other Physical Details" colSpan={2} dark={dark}>
                <input type="text" value={editAccession.other_physical_details} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Accompanying Material" colSpan={2} dark={dark}>
                <input type="text" value={editAccession.accompanying_material} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Subjects" colSpan={2} dark={dark}>
                <input type="text" value={editAccession.subjects} readOnly style={readOnlyInputClass} />
              </FormField>
              <FormField label="Notes Area" colSpan={2} dark={dark}>
                <textarea rows={3} value={editAccession.notes_area} readOnly style={{ ...readOnlyInputClass, resize: 'none' }} />
              </FormField>
            </div>
          </div>

          {/* Info banner */}
          <div
            className="rounded-lg p-4"
            style={{
              border: `1px solid ${dark ? '#1a3356' : '#bfdbfe'}`,
              background: dark ? 'rgba(30,64,175,0.1)' : '#eff6ff',
            }}
          >
            <p className="text-sm font-medium" style={{ color: dark ? '#93c5fd' : '#1d4ed8' }}>
              Bibliographic data is locked
            </p>
            <p className="text-xs mt-1" style={{ color: dark ? '#6b8cae' : '#3b82f6' }}>
              To update bibliographic details, edit the original book record in the catalog.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2" style={{ borderTop: `1px solid ${border}` }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                border: `1px solid ${inputBorder}`,
                color: textSecondary,
                borderRadius: '0.5rem',
                background: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              style={{
                padding: '0.5rem 1.5rem',
                color: '#fff',
                borderRadius: '0.5rem',
                background: 'var(--secondary-3-medium)',
              }}
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EditAccessionModal