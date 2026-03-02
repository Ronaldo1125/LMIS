const ErrorAlert = ({ message, dark = false }) => {
  if (!message) return null

  return (
    <div style={{
      marginBottom: '1rem',
      padding: '0.75rem 1rem',
      background: dark ? '#2e1a1a' : '#fef2f2',
      border: `1px solid ${dark ? '#7f1d1d' : '#fca5a5'}`,
      borderRadius: '0.5rem',
    }}>
      <p style={{ color: dark ? '#fca5a5' : '#dc2626', fontSize: '0.875rem', margin: 0 }}>
        {message}
      </p>
    </div>
  )
}

export default ErrorAlert