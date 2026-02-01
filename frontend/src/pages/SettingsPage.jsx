import { useAuth } from '../components/context/AuthContext'
import { NotificationSettings } from '../components/notifications/NotificationSettings'

export const SettingsPage = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Settings</h1>
          <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Notification Settings — this renders all the reminder config cards */}
      <NotificationSettings />

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}

export default SettingsPage