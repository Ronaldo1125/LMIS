import { CheckIcon } from '@heroicons/react/24/outline'
import { FONT_BODY } from './constants'

const FORMAT_HINT = `Formatting rules:
• Each new line = a bullet point
• To add a lead-in sentence (e.g. "We use your data to:"), separate it from the list with a blank line

Example:
We use your data to:

Authenticate users via Google Login
Display user profiles
Improve system features`

const EditForm = ({ editingItem, isAddingNew, onChange, onSave, onCancel, theme }) => {
  const { inputBg, border, textPrimary, textMuted, accent } = theme
  const isValid = editingItem.header.trim() && editingItem.content.trim()

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      background: 'rgba(21,74,154,0.08)',
      borderRadius: '0.5rem',
      border: `1px solid ${accent}`,
    }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, margin: '0 0 1rem', fontFamily: FONT_BODY }}>
        {isAddingNew ? 'Add New Section' : 'Edit Section'}
      </h3>

      {/* Header field */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textMuted, marginBottom: '0.375rem' }}>
          Header
        </label>
        <input
          type="text"
          value={editingItem.header}
          onChange={(e) => onChange({ ...editingItem, header: e.target.value })}
          placeholder="Enter section header"
          style={{
            width: '100%', padding: '0.625rem 0.75rem',
            borderRadius: '0.375rem', border: `1px solid ${border}`,
            background: inputBg, color: textPrimary,
            fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
            fontFamily: FONT_BODY,
          }}
        />
      </div>

      {/* Content field */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textMuted }}>
            Content
          </label>
          {/* Formatting hint tooltip trigger */}
          <FormatHintBadge accent={accent} textMuted={textMuted} />
        </div>
        <textarea
          value={editingItem.content}
          onChange={(e) => onChange({ ...editingItem, content: e.target.value })}
          placeholder={`Enter section content\n\nTip: Each new line becomes a bullet. Add a blank line to separate a lead-in sentence from the list.`}
          rows={6}
          style={{
            width: '100%', padding: '0.625rem 0.75rem',
            borderRadius: '0.375rem', border: `1px solid ${border}`,
            background: inputBg, color: textPrimary,
            fontSize: '0.875rem', outline: 'none',
            resize: 'vertical', fontFamily: FONT_BODY,
            boxSizing: 'border-box', lineHeight: '1.6',
          }}
        />
        {/* Inline formatting guide */}
        <div style={{
          marginTop: '0.5rem',
          padding: '0.625rem 0.75rem',
          background: 'rgba(21,74,154,0.05)',
          borderRadius: '0.375rem',
          border: `1px dashed ${accent}55`,
          fontSize: '0.7rem',
          color: textMuted,
          fontFamily: FONT_BODY,
          lineHeight: '1.6',
        }}>
          <span style={{ fontWeight: 600, color: accent }}>Formatting tips: </span>
          Each new line → bullet point.
          {' '}To use a <strong style={{ color: textPrimary }}>lead-in sentence</strong> (e.g. <em>"We use your data to:"</em>),
          {' '}leave a <strong style={{ color: textPrimary }}>blank line</strong> between it and the list — otherwise it will also become a bullet.
        </div>
      </div>

      {/* Live preview (shows when there's content) */}
      {editingItem.content.trim() && (
        <ContentPreview content={editingItem.content} textPrimary={textPrimary} textMuted={textMuted} border={border} accent={accent} />
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.375rem',
            border: `1px solid ${border}`, background: 'transparent',
            cursor: 'pointer', color: textMuted, fontSize: '0.875rem', fontFamily: FONT_BODY,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!isValid}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none',
            background: accent, cursor: !isValid ? 'not-allowed' : 'pointer',
            color: '#ffffff', fontSize: '0.875rem', opacity: !isValid ? 0.6 : 1,
            display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: FONT_BODY,
          }}
        >
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
          {isAddingNew ? 'Add' : 'Update'}
        </button>
      </div>
    </div>
  )
}

// ── Tooltip badge ─────────────────────────────────────────────────────────────
const FormatHintBadge = ({ accent, textMuted }) => {
  return (
    <span
      title={FORMAT_HINT}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        fontSize: '0.65rem', fontWeight: 600,
        color: accent, cursor: 'help',
        padding: '0.15rem 0.4rem',
        borderRadius: '999px',
        border: `1px solid ${accent}55`,
        background: `${accent}10`,
        fontFamily: FONT_BODY,
        userSelect: 'none',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      Formatting guide
    </span>
  )
}

// ── Live preview ──────────────────────────────────────────────────────────────
const ContentPreview = ({ content, textPrimary, textMuted, border, accent }) => {
  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)

  return (
    <div style={{
      marginBottom: '0.75rem',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${border}`,
      background: 'rgba(255,255,255,0.5)',
    }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: accent, marginBottom: '0.5rem', fontFamily: FONT_BODY }}>
        LIVE PREVIEW
      </p>
      <div style={{ fontSize: '0.8rem', color: textMuted, lineHeight: '1.6', fontFamily: FONT_BODY }}>
        {paragraphs.map((para, pi) => {
          const lines = para.split('\n').map(l => l.trim()).filter(Boolean)
          if (lines.length === 1) {
            return <p key={pi} style={{ margin: '0 0 0.5rem' }}>{lines[0]}</p>
          }
          return (
            <ul key={pi} style={{ margin: '0 0 0.5rem', padding: 0, listStyle: 'none' }}>
              {lines.map((line, li) => (
                <li key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', marginBottom: '0.2rem' }}>
                  <span style={{ marginTop: '0.45rem', width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )
        })}
      </div>
    </div>
  )
}

export default EditForm