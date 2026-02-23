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

  const pageBg      = dark ? '#0a1628' : '#f1f5f9'
  const headerBg    = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const tabsBg      = dark ? '#0f1f38' : '#ffffff'
  const tabsBorder  = dark ? '#1a3356' : '#e2e8f0'
  const inactiveText = dark ? '#6b8cae' : '#64748b'
  const inactiveHover = dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'
  const iconBoxBg   = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor   = dark ? '#93c5fd' : '#2563eb'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      
      {/* Header */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1.25rem 1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <Shield style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>
              Security Management
            </h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              Monitor and control system security
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: pageBg, padding: '1rem 1.5rem', transition: 'background 0.45s ease' }}>
        <div style={{
          background: tabsBg,
          border: `1px solid ${tabsBorder}`,
          borderRadius: '0.75rem',
          padding: '0.25rem',
          display: 'flex', width: '100%',
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
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 500,
                  background: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : inactiveText,
                  border: 'none', cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
                  transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = inactiveHover }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon style={{ width: '1rem', height: '1rem' }} />
                {tab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div style={{ padding: '0 1.5rem 2.5rem' }}>
        {ActiveComponent && <ActiveComponent dark={dark} />}
      </div>

    </div>
  )
}

export default Security