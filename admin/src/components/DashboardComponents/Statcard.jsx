const StatCard = ({ title, value, icon: Icon, colorVar = 'var(--dark-blue-2)', dark }) => {
  return (
    <div
      style={{
        background: dark ? '#0f1f38' : '#ffffff',
        border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Icon box */}
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          flexShrink: 0,
          background: `${colorVar}${dark ? '25' : '15'}`,
          transition: 'background 0.45s ease',
        }}>
          <Icon style={{ width: '2rem', height: '2rem', color: colorVar }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.875rem', fontWeight: 500,
            color: dark ? '#6b8cae' : '#4b5563',
            marginBottom: '0.25rem',
            transition: 'color 0.45s ease',
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '1.5rem', fontWeight: 700,
            color: dark ? '#dde8f5' : 'var(--dark-blue-1)',
            margin: 0,
            transition: 'color 0.45s ease',
          }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatCard