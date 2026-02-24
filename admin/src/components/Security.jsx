import { useState } from 'react'
import { Shield, Activity, Monitor, Settings } from 'lucide-react'
import ActivityLogs from './SecurityComponents/ActivityLogs'
import SessionManagement from './SecurityComponents/SessionManagement'
import SecuritySettings from './SecurityComponents/SecuritySettings'

const Security = ({ dark }) => {
  const [activeTab, setActiveTab] = useState('activity-logs')

  const tabs = [
    {
      id: 'activity-logs',
      name: 'Activity Logs',
      icon: Activity,
      component: ActivityLogs
    },
    {
      id: 'sessions',
      name: 'Sessions',
      icon: Monitor,
      component: SessionManagement
    },
    {
      id: 'settings',
      name: 'Security Settings',
      icon: Settings,
      component: SecuritySettings
    }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

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
            <Shield style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>Security Management</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              Monitor and control system security
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: pageBg, transition: 'background 0.45s ease' }}>
        <div style={{ padding: '0 1.5rem' }}>
          <div style={{
            background: cardBg,
            border: `1px solid ${headerBorder}`,
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: '0.5rem',
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            transition: 'background 0.45s ease, border-color 0.45s ease',
          }}>
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.75rem 0',
                    borderRadius: '0.75rem',
                    fontSize: '1rem', fontWeight: 600,
                    background: isActive ? '#2563eb' : 'transparent',
                    color: isActive ? '#fff' : textSecondary,
                    boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.12)' : 'none',
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem', color: isActive ? '#fff' : iconColor }} />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active Tab Content */}
      <div style={{ padding: '0 1.5rem', paddingBottom: '2rem' }}>
        {ActiveComponent && <ActiveComponent dark={dark} />}
      </div>
    </div>
  )
}

export default Security
