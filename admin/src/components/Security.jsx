import { useState } from 'react'
import { Shield, Activity, Monitor, Settings } from 'lucide-react'
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
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Security Management
            </h1>
            <p className="text-sm text-gray-600">
              Monitor and control system security
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-0 z-40 bg-gray-50">
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl shadow-sm p-1 flex w-full border border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100' 
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="px-6 pb-10">
        {ActiveComponent && <ActiveComponent />}
      </div>

    </div>
  )
}

export default Security
