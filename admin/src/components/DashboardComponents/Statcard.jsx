const StatCard = ({ title, value, icon: Icon, colorVar = 'var(--dark-blue-2)', dark }) => {
  return (
    <div
      style={{
        background: dark ? '#0f1f38' : '#ffffff',
        border: `1px solid ${dark ? '#1a3356' : '#e2e8f0'}`,
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Icon box */}
        <div style={{
          padding: '0.5rem',
          borderRadius: '0.4rem',
          flexShrink: 0,
          background: `${colorVar}${dark ? '25' : '15'}`,
          transition: 'background 0.45s ease',
        }}>
          <Icon style={{ width: '1.25rem', height: '1.25rem', color: colorVar }} />
        </div>

        {/* Divider */}
        <div style={{
          width: '1px', alignSelf: 'stretch',
          background: dark ? '#1a3356' : '#e2e8f0',
          flexShrink: 0,
        }} />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: dark ? '#6b8cae' : '#6b7280',
            margin: '0 0 0.1rem',
            transition: 'color 0.45s ease',
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '1.25rem', fontWeight: 700,
            color: dark ? '#dde8f5' : 'var(--dark-blue-1)',
            margin: 0, lineHeight: 1.2,
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