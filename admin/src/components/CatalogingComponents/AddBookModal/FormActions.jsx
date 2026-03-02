const FormActions = ({
  onCancel,
  loading = false,
  submitText = 'Submit',
  loadingText = 'Submitting...',
  cancelText = 'Cancel',
  dark = false,
}) => {
  const border      = dark ? '#1a3356' : '#e2e8f0'
  const inputBorder = dark ? '#1a3356' : '#d1d5db'
  const textSecondary = dark ? '#6b8cae' : '#64748b'

  return (
    <div style={{
      display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
      paddingTop: '0.5rem',
      borderTop: `1px solid ${border}`,
      marginTop: '0.5rem',
    }}>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        style={{
          padding: '0.5rem 1.5rem',
          background: 'transparent',
          border: `1px solid ${inputBorder}`,
          color: textSecondary,
          borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem', fontWeight: 500,
          transition: 'background 0.2s ease',
          fontFamily: 'inherit',
          opacity: loading ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.5rem 1.5rem',
          background: loading ? (dark ? '#1a3356' : '#e5e7eb') : 'var(--secondary-3-medium)',
          color: loading ? (dark ? '#2e4d70' : '#9ca3af') : '#ffffff',
          border: 'none', borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: loading ? 'none' : '0 2px 8px rgba(255,166,0,0.3)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
          fontFamily: 'inherit',
        }}
      >
        {loading ? loadingText : submitText}
      </button>
    </div>
  )
}

export default FormActions