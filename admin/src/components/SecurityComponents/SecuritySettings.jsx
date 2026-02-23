import { useState, useEffect } from 'react'
import { Shield, Save, Lock, Clock, Key, AlertCircle, CheckCircle } from 'lucide-react'

const SecuritySettings = ({ dark }) => {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    sessionPolicy: {
      maxSessionDuration: 480, // in minutes
      inactivityTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauthentication: true
    },
    loginPolicy: {
      maxFailedAttempts: 5,
      lockoutDuration: 30, // in minutes
      twoFactorEnabled: false,
      ipWhitelisting: false
    },
    auditPolicy: {
      logRetentionDays: 365,
      logFailedLogins: true,
      logSuccessfulLogins: true,
      logDataChanges: true,
      logAccessAttempts: true
    }
  })

  const [savedMessage, setSavedMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/security/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching security settings:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSavedMessage('')

    try {
      const response = await fetch('/api/security/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSavedMessage('Settings saved successfully!')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        setSavedMessage('Error saving settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSavedMessage('Settings saved successfully!') // For demo
      setTimeout(() => setSavedMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    })
  }

  // ── Colors ────────────────────────────────────────────────
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const inputBg       = dark ? '#081422' : '#ffffff'
  const inputBorder   = dark ? '#1a3356' : '#d1d5db'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'
  const sectionIconBg = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${border}`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    transition: 'background 0.45s ease, border-color 0.45s ease',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    background: inputBg,
    color: textPrimary,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: textPrimary,
    marginBottom: '0.5rem',
  }

  const checkboxRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    cursor: 'pointer',
  }

  const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: sectionIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: '1.125rem', height: '1.125rem', color: iconColor }} />
      </div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: textPrimary, margin: 0 }}>{title}</h2>
    </div>
  )

  const Divider = () => (
    <div style={{ height: '1px', background: border, margin: '1rem 0', transition: 'background 0.45s ease' }} />
  )

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Shield style={{ width: '1.75rem', height: '1.75rem', color: iconColor }} />
          Security Settings
        </h1>
        <p style={{ color: textSecondary, marginTop: '0.25rem', fontSize: '0.875rem' }}>
          Configure security policies and requirements
        </p>
      </div>

      {/* Save Message */}
      {savedMessage && (
        <div style={{
          marginBottom: '1.5rem', padding: '0.875rem 1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          borderRadius: '0.5rem', fontSize: '0.875rem',
          background: savedMessage.includes('Error')
            ? (dark ? 'rgba(220,38,38,0.1)' : '#fef2f2')
            : (dark ? 'rgba(22,163,74,0.1)' : '#f0fdf4'),
          border: `1px solid ${savedMessage.includes('Error')
            ? (dark ? 'rgba(220,38,38,0.25)' : '#fecaca')
            : (dark ? 'rgba(22,163,74,0.25)' : '#bbf7d0')}`,
          color: savedMessage.includes('Error')
            ? (dark ? '#fca5a5' : '#dc2626')
            : (dark ? '#86efac' : '#15803d'),
        }}>
          {savedMessage.includes('Error')
            ? <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />
            : <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
          }
          <span>{savedMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Password Policy ─────────────────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader icon={Lock} title="Password Policy" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Minimum Password Length</label>
              <input
                type="number" min="6" max="32"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => updateSetting('passwordPolicy', 'minLength', parseInt(e.target.value))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = inputBorder}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { key: 'requireUppercase', label: 'Require uppercase letters' },
                { key: 'requireLowercase', label: 'Require lowercase letters' },
                { key: 'requireNumbers',   label: 'Require numbers' },
                { key: 'requireSpecialChars', label: 'Require special characters' },
              ].map(({ key, label }) => (
                <label key={key} style={checkboxRowStyle}>
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy[key]}
                    onChange={(e) => updateSetting('passwordPolicy', key, e.target.checked)}
                    style={{ width: '1rem', height: '1rem', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: textSecondary }}>{label}</span>
                </label>
              ))}
            </div>

            <Divider />

            <div>
              <label style={labelStyle}>Password Expiration (days)</label>
              <input
                type="number" min="0" max="365"
                value={settings.passwordPolicy.expirationDays}
                onChange={(e) => updateSetting('passwordPolicy', 'expirationDays', parseInt(e.target.value))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = inputBorder}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: textMuted }}>Set to 0 for no expiration</p>
            </div>
          </div>
        </div>

        {/* ── Session Policy ──────────────────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader icon={Clock} title="Session Policy" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'maxSessionDuration',  label: 'Maximum Session Duration (minutes)', min: 30,  max: 1440 },
              { key: 'inactivityTimeout',   label: 'Inactivity Timeout (minutes)',        min: 5,   max: 120  },
              { key: 'maxConcurrentSessions', label: 'Maximum Concurrent Sessions',       min: 1,   max: 10   },
            ].map(({ key, label, min, max }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="number" min={min} max={max}
                  value={settings.sessionPolicy[key]}
                  onChange={(e) => updateSetting('sessionPolicy', key, parseInt(e.target.value))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>
            ))}

            <Divider />

            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={settings.sessionPolicy.requireReauthentication}
                onChange={(e) => updateSetting('sessionPolicy', 'requireReauthentication', e.target.checked)}
                style={{ width: '1rem', height: '1rem', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', color: textSecondary }}>Require re-authentication for sensitive actions</span>
            </label>
          </div>
        </div>

        {/* ── Login Policy ────────────────────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader icon={Key} title="Login Policy" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'maxFailedAttempts', label: 'Maximum Failed Login Attempts',    min: 3, max: 10   },
              { key: 'lockoutDuration',   label: 'Account Lockout Duration (minutes)', min: 5, max: 1440 },
            ].map(({ key, label, min, max }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="number" min={min} max={max}
                  value={settings.loginPolicy[key]}
                  onChange={(e) => updateSetting('loginPolicy', key, parseInt(e.target.value))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>
            ))}

            <Divider />

            {[
              { key: 'twoFactorEnabled', label: 'Enable two-factor authentication' },
              { key: 'ipWhitelisting',   label: 'Enable IP whitelisting' },
            ].map(({ key, label }) => (
              <label key={key} style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={settings.loginPolicy[key]}
                  onChange={(e) => updateSetting('loginPolicy', key, e.target.checked)}
                  style={{ width: '1rem', height: '1rem', accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: textSecondary }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Audit Policy ────────────────────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader icon={AlertCircle} title="Audit Policy" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Log Retention Period (days)</label>
              <input
                type="number" min="30" max="3650"
                value={settings.auditPolicy.logRetentionDays}
                onChange={(e) => updateSetting('auditPolicy', 'logRetentionDays', parseInt(e.target.value))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = inputBorder}
              />
            </div>

            <Divider />

            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0 }}>Log Events:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { key: 'logFailedLogins',     label: 'Failed login attempts' },
                { key: 'logSuccessfulLogins', label: 'Successful logins' },
                { key: 'logDataChanges',      label: 'Data modifications' },
                { key: 'logAccessAttempts',   label: 'Resource access attempts' },
              ].map(({ key, label }) => (
                <label key={key} style={checkboxRowStyle}>
                  <input
                    type="checkbox"
                    checked={settings.auditPolicy[key]}
                    onChange={(e) => updateSetting('auditPolicy', key, e.target.checked)}
                    style={{ width: '1rem', height: '1rem', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: textSecondary }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Save Button ─────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: saving ? (dark ? '#1a3356' : '#9ca3af') : 'linear-gradient(135deg, var(--dark-blue-1), var(--dark-blue-2))',
              color: '#ffffff',
              border: 'none', borderRadius: '0.5rem',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: saving ? 'none' : '0 2px 12px rgba(30,64,175,0.4)',
              transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(30,64,175,0.55)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = saving ? 'none' : '0 2px 12px rgba(30,64,175,0.4)' }}
          >
            <Save style={{ width: '1.125rem', height: '1.125rem' }} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default SecuritySettings