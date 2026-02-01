import { useState } from 'react'
import { useNotifications } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import { Card } from '../common/Card'

// --- Toggle Switch Helper ---
const Toggle = ({ on, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      on ? 'bg-accent-medium' : 'bg-surface-3'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
        on ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

export const NotificationSettings = () => {
  const { user } = useAuth()
  const { permission, settings, requestPermission, updateSettings, addToast } = useNotifications()
  const [newTime, setNewTime] = useState('')

  // --- Permission Button ---
  const handleEnableNotifications = async () => {
    const result = await requestPermission()
    if (result.success) {
      addToast({ type: 'success', title: 'Enabled!', message: 'Browser notifications are now on.' })
    } else {
      addToast({ type: 'error', title: 'Blocked', message: 'Please allow notifications in your browser settings.' })
    }
  }

  // --- Toggle a boolean setting ---
  const toggle = (key) => {
    updateSettings({ [key]: !settings[key] })
  }

  // --- Add a new reminder time ---
  const addTime = () => {
    if (!newTime || settings.reminderTimes.includes(newTime)) return
    updateSettings({ reminderTimes: [...settings.reminderTimes, newTime].sort() })
    setNewTime('')
    addToast({ type: 'success', title: 'Added', message: `Reminder set for ${newTime}` })
  }

  // --- Remove a reminder time ---
  const removeTime = (time) => {
    updateSettings({ reminderTimes: settings.reminderTimes.filter((t) => t !== time) })
    addToast({ type: 'info', title: 'Removed', message: `Reminder at ${time} removed` })
  }

  return (
    <div className="space-y-5">
      {/* Permission Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Browser Permission</p>
            <p className={`text-xs mt-0.5 ${permission === 'granted' ? 'text-green-400' : 'text-text-muted'}`}>
              {permission === 'granted' ? '✅ Granted' : permission === 'denied' ? '❌ Blocked' : '⚠️ Not yet enabled'}
            </p>
          </div>
          {permission !== 'granted' && (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-1.5 bg-accent-medium text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Enable
            </button>
          )}
        </div>
        {permission === 'denied' && (
          <p className="text-xs text-yellow-400 mt-3">
            Notifications are blocked. Click the lock icon in your browser address bar to allow them.
          </p>
        )}
      </Card>

      {/* Toggles Card */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Browser Notifications</p>
              <p className="text-xs text-text-muted">Push notifications on your device</p>
            </div>
            <Toggle on={settings.browserNotifications} onClick={() => toggle('browserNotifications')} disabled={permission !== 'granted'} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Email Reminders</p>
              <p className="text-xs text-text-muted">Sent to {user?.email}</p>
            </div>
            <Toggle on={settings.emailReminders} onClick={() => toggle('emailReminders')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Daily Digest</p>
              <p className="text-xs text-text-muted">A daily summary email of all your habits</p>
            </div>
            <Toggle on={settings.dailyDigest} onClick={() => toggle('dailyDigest')} />
          </div>
        </div>
      </Card>

      {/* Reminder Times Card */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Reminder Times</h3>

        {/* Add Time */}
        <div className="flex gap-2 mb-4">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-accent-medium text-sm"
          />
          <button
            onClick={addTime}
            disabled={!newTime}
            className="px-4 py-2 bg-accent-medium text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Time List */}
        <div className="space-y-2">
          {settings.reminderTimes.length === 0 && (
            <p className="text-xs text-text-muted text-center py-3">No reminders set yet</p>
          )}
          {settings.reminderTimes.map((time) => (
            <div key={time} className="flex items-center justify-between px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-text-secondary">{time}</span>
              </div>
              <button onClick={() => removeTime(time)} className="text-xs text-red-400 hover:text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Digest Time (only shown if daily digest is on) */}
      {settings.dailyDigest && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Daily Digest Time</h3>
          <input
            type="time"
            value={settings.digestTime}
            onChange={(e) => updateSettings({ digestTime: e.target.value })}
            className="w-full px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-accent-medium text-sm"
          />
          <p className="text-xs text-text-muted mt-2">You'll receive a summary email at this time every day.</p>
        </Card>
      )}
    </div>
  )
}

export default NotificationSettings