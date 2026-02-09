import { useState } from 'react'
import { Shield, Activity, Monitor, Settings, Lock } from 'lucide-react'
import ActivityLogs from './SecurityComponents/ActivityLogs'
import SessionManagement from './SecurityComponents/SessionManagement'
import SecuritySettings from './SecurityComponents/SecuritySettings'

const Security = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Security Management</h1>
            <p className="text-sm text-gray-600">Monitor and control system security</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-1 inline-flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Component */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}

export default Security