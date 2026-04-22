import { useState } from 'react'
import { Activity } from 'lucide-react'
import ActivityLogs from './SecurityComponents/ActivityLogs'

const Security = ({ dark }) => {

  // ── Colors ────────────────────────────────────────────────
  const pageBg       = dark ? '#0a1628' : '#f8fafc'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg    = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor    = dark ? '#93c5fd' : '#2563eb'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Header */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <Activity style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>Activity Logs</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              Monitor and track all system activities
            </p>
          </div>
        </div>
      </div>

      {/* Active Tab Content */}
      <div style={{ padding: '0 1.5rem', paddingBottom: '2rem' }}>
        <ActivityLogs dark={dark} />
      </div>
    </div>
  )
}

export default Security