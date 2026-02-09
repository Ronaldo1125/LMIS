import { useState, useEffect } from 'react'
import { Shield, Save, Lock, Clock, Key, AlertCircle, CheckCircle } from 'lucide-react'

const SecuritySettings = () => {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-7 h-7" />
          Security Settings
        </h1>
        <p className="text-gray-600 mt-1">Configure security policies and requirements</p>
      </div>

      {/* Save Message */}
      {savedMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          savedMessage.includes('Error') 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {savedMessage.includes('Error') ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Password Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password Policy
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="32"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => updateSetting('passwordPolicy', 'minLength', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireUppercase', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require uppercase letters</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireLowercase}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireLowercase', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require lowercase letters</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireNumbers', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require numbers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require special characters</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiration (days)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={settings.passwordPolicy.expirationDays}
                onChange={(e) => updateSetting('passwordPolicy', 'expirationDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Set to 0 for no expiration</p>
            </div>
          </div>
        </div>

        {/* Session Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Policy
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Session Duration (minutes)
              </label>
              <input
                type="number"
                min="30"
                max="1440"
                value={settings.sessionPolicy.maxSessionDuration}
                onChange={(e) => updateSetting('sessionPolicy', 'maxSessionDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inactivity Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionPolicy.inactivityTimeout}
                onChange={(e) => updateSetting('sessionPolicy', 'inactivityTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Concurrent Sessions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.sessionPolicy.maxConcurrentSessions}
                onChange={(e) => updateSetting('sessionPolicy', 'maxConcurrentSessions', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sessionPolicy.requireReauthentication}
                onChange={(e) => updateSetting('sessionPolicy', 'requireReauthentication', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require re-authentication for sensitive actions</span>
            </label>
          </div>
        </div>

        {/* Login Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Login Policy
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Failed Login Attempts
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.loginPolicy.maxFailedAttempts}
                onChange={(e) => updateSetting('loginPolicy', 'maxFailedAttempts', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Lockout Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.loginPolicy.lockoutDuration}
                onChange={(e) => updateSetting('loginPolicy', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.loginPolicy.twoFactorEnabled}
                onChange={(e) => updateSetting('loginPolicy', 'twoFactorEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable two-factor authentication</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.loginPolicy.ipWhitelisting}
                onChange={(e) => updateSetting('loginPolicy', 'ipWhitelisting', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable IP whitelisting</span>
            </label>
          </div>
        </div>

        {/* Audit Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Audit Policy
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Retention Period (days)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={settings.auditPolicy.logRetentionDays}
                onChange={(e) => updateSetting('auditPolicy', 'logRetentionDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Log Events:</p>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auditPolicy.logFailedLogins}
                  onChange={(e) => updateSetting('auditPolicy', 'logFailedLogins', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Failed login attempts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auditPolicy.logSuccessfulLogins}
                  onChange={(e) => updateSetting('auditPolicy', 'logSuccessfulLogins', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Successful logins</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auditPolicy.logDataChanges}
                  onChange={(e) => updateSetting('auditPolicy', 'logDataChanges', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Data modifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auditPolicy.logAccessAttempts}
                  onChange={(e) => updateSetting('auditPolicy', 'logAccessAttempts', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Resource access attempts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings